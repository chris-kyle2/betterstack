import boto3
import requests
import os
from datetime import datetime
import socket
import OpenSSL
from urllib.parse import urlparse
import time

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
endpoints_table = dynamodb.Table(os.environ['ENDPOINTS_TABLE_NAME'])
logs_table = dynamodb.Table(os.environ['LOGS_TABLE_NAME'])

def measure_latency(url):
    """Measure DNS resolution, connection, and total latency"""
    try:
        parsed_url = urlparse(url)
        hostname = parsed_url.netloc
        
        # DNS Resolution time
        dns_start = time.time()
        socket.gethostbyname(hostname)
        dns_time = (time.time() - dns_start) * 1000  # Convert to milliseconds
        
        # Connection time
        conn_start = time.time()
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        sock.connect((hostname, 443 if url.startswith('https://') else 80))
        conn_time = (time.time() - conn_start) * 1000  # Convert to milliseconds
        sock.close()
        
        return {
            'dns_latency': round(dns_time, 2),
            'connection_latency': round(conn_time, 2),
            'total_latency': round(dns_time + conn_time, 2)
        }
    except Exception as e:
        print(f"Latency measurement error: {str(e)}")
        return {
            'dns_latency': None,
            'connection_latency': None,
            'total_latency': None
        }

def check_ssl_certificate(url):
    """Check SSL certificate validity and details"""
    try:
        parsed_url = urlparse(url)
        hostname = parsed_url.netloc
        port = 443
        
        context = OpenSSL.SSL.Context(OpenSSL.SSL.TLS_CLIENT_METHOD)
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        sock.connect((hostname, port))
        ssl_sock = OpenSSL.SSL.Connection(context, sock)
        ssl_sock.set_connect_state()
        ssl_sock.do_handshake()
        
        cert = ssl_sock.get_peer_certificate()
        return {
            'certificate_valid': True,
            'certificate_expiry_date': cert.get_notAfter().decode('utf-8'),
            'certificate_issuer': cert.get_issuer().CN,
            'tls_version': ssl_sock.get_protocol_version_name(),
            'secure_protocol': True
        }
    except Exception as e:
        return {
            'certificate_valid': False,
            'certificate_expiry_date': None,
            'certificate_issuer': None,
            'tls_version': None,
            'secure_protocol': False,
            'error': str(e)
        }
    finally:
        if 'ssl_sock' in locals():
            ssl_sock.shutdown()
        if 'sock' in locals():
            sock.close()

def check_endpoint(endpoint):
    """Check if an endpoint is responding and get all metrics"""
    try:
        # Measure latency first
        latency_metrics = measure_latency(endpoint['url'])
        
        # Check HTTP response
        start_time = time.time()
        response = requests.get(endpoint['url'], timeout=5)
        response_time = (time.time() - start_time) * 1000  # Convert to milliseconds
        
        http_result = {
            'status_code': response.status_code,
            'response_time': round(response_time, 2),
            'is_up': 200 <= response.status_code < 300,
            'dns_latency': latency_metrics['dns_latency'],
            'connection_latency': latency_metrics['connection_latency'],
            'total_latency': latency_metrics['total_latency']
        }
        
        # Check SSL if URL is HTTPS
        if endpoint['url'].startswith('https://'):
            ssl_result = check_ssl_certificate(endpoint['url'])
            return {**http_result, **ssl_result}
        
        return {
            **http_result,
            'certificate_valid': None,
            'certificate_expiry_date': None,
            'certificate_issuer': None,
            'tls_version': None,
            'secure_protocol': False
        }
        
    except Exception as e:
        return {
            'status_code': None,
            'response_time': None,
            'is_up': False,
            'dns_latency': None,
            'connection_latency': None,
            'total_latency': None,
            'certificate_valid': None,
            'certificate_expiry_date': None,
            'certificate_issuer': None,
            'tls_version': None,
            'secure_protocol': False,
            'error': str(e)
        }

def log_monitoring_result(endpoint, check_result):
    """Log the monitoring result to DynamoDB"""
    try:
        log_id = f"{datetime.now().strftime('%Y%m%d%H%M%S')}-{endpoint['endpoint_id']}"
        log_item = {
            'log_id': log_id,
            'endpoint_id': endpoint['endpoint_id'],
            'user_id': endpoint['user_id'],
            'timestamp': datetime.now().isoformat(),
            'status_code': check_result.get('status_code'),
            'response_time': check_result.get('response_time'),
            'dns_latency': check_result.get('dns_latency'),
            'connection_latency': check_result.get('connection_latency'),
            'total_latency': check_result.get('total_latency'),
            'is_up': check_result.get('is_up'),
            'certificate_valid': check_result.get('certificate_valid'),
            'certificate_expiry_date': check_result.get('certificate_expiry_date'),
            'certificate_issuer': check_result.get('certificate_issuer'),
            'tls_version': check_result.get('tls_version'),
            'secure_protocol': check_result.get('secure_protocol')
        }
        logs_table.put_item(Item=log_item)
    except Exception as e:
        print(f"Error logging result: {str(e)}")

def get_endpoints():
    """Fetch all endpoints from DynamoDB table"""
    try:
        response = endpoints_table.scan()
        return response.get('Items', [])
    except Exception as e:
        print(f"Error fetching endpoints: {str(e)}")
        return []

def lambda_handler(event, context):
    """Main Lambda handler function"""
    try:
        endpoints = get_endpoints()
        for endpoint in endpoints:
            result = check_endpoint(endpoint)
            log_monitoring_result(endpoint, result)
        return {
            'statusCode': 200,
            'body': f'Successfully monitored {len(endpoints)} endpoints'
        }
    except Exception as e:
        print(f"Error in lambda_handler: {str(e)}")
        return {
            'statusCode': 500,
            'body': f'Error: {str(e)}'
        }