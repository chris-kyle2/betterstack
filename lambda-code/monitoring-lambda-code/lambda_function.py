import boto3
import requests
import os
from datetime import datetime
import socket
import ssl
from urllib.parse import urlparse
import time
from decimal import Decimal

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb',region_name='us-east-1')
# endpoints_table = dynamodb.Table(os.environ['ENDPOINTS_TABLE_NAME'])  # Commented out for testing
logs_table_name = os.environ.get('LOGS_TABLE_NAME')
print(logs_table_name)

if not logs_table_name:
    raise ValueError("LOGS_TABLE_NAME environment variable is not set")
try:
    logs_table = dynamodb.Table(logs_table_name)
except Exception as e:
    print(f"Error initializing DynamoDB table: {str(e)}")
    raise

# Hardcoded test endpoints
TEST_ENDPOINTS = [
    {
        'endpoint_id': '7c6005ce-268c-4ae2-9744-ed77af1e9bd5',
        'user_id': 'c4184438-e021-703a-97e9-b9eff58cdff8',
        'url': 'https://www.google.com'
    },
    {
        'endpoint_id': '43afccc4-1eba-42b8-98e8-a8e113cbc0a5',
        'user_id': 'c4184438-e021-703a-97e9-b9eff58cdff8',
        'url': 'https://www.github.com'
    },
    {
        'endpoint_id': 'a9d69e39-611d-4cd6-b574-7163c6a62d00',
        'user_id': 'c4184438-e021-703a-97e9-b9eff58cdff8',
        'url': 'https://www.amazon.com'
    }
]

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
    """Check SSL certificate validity and details using built-in ssl module"""
    try:
        parsed_url = urlparse(url)
        hostname = parsed_url.netloc
        port = 443
        
        # Create SSL context with default settings
        context = ssl.create_default_context()
        
        # Create connection and wrap with SSL
        with socket.create_connection((hostname, port), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                
                # Convert certificate dates to datetime
                not_before = datetime.strptime(cert['notBefore'], '%b %d %H:%M:%S %Y %Z')
                not_after = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                
                return {
                    'certificate_valid': True,
                    'certificate_expiry_date': not_after.isoformat(),
                    'certificate_issuer': dict(x[0] for x in cert['issuer']).get('CN', ''),
                    'tls_version': ssock.version(),
                    'secure_protocol': True,
                    'cipher': ssock.cipher()[0]  # Get cipher name
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
        
        # Convert float values to Decimal
        log_item = {
            'log_id': log_id,
            'endpoint_id': endpoint['endpoint_id'],
            'user_id': endpoint['user_id'],
            'timestamp': datetime.now().isoformat(),
            'status_code': check_result.get('status_code'),
            'response_time': Decimal(str(check_result.get('response_time'))) if check_result.get('response_time') is not None else None,
            'dns_latency': Decimal(str(check_result.get('dns_latency'))) if check_result.get('dns_latency') is not None else None,
            'connection_latency': Decimal(str(check_result.get('connection_latency'))) if check_result.get('connection_latency') is not None else None,
            'total_latency': Decimal(str(check_result.get('total_latency'))) if check_result.get('total_latency') is not None else None,
            'is_up': check_result.get('is_up'),
            'certificate_valid': check_result.get('certificate_valid'),
            'certificate_expiry_date': check_result.get('certificate_expiry_date'),
            'certificate_issuer': check_result.get('certificate_issuer'),
            'tls_version': check_result.get('tls_version'),
            'secure_protocol': check_result.get('secure_protocol')
        }
        
        # Remove None values to avoid DynamoDB errors
        log_item = {k: v for k, v in log_item.items() if v is not None}
        print(f"Attempting to write logs to {logs_table_name}")
        print(log_item)
        logs_table.put_item(Item=log_item)
        print(f"Successfully logged result for {endpoint['url']}")
    except Exception as e:
        print(f"Error logging result: {str(e)}")

def get_endpoints():
    """Return hardcoded test endpoints instead of fetching from DynamoDB"""
    return TEST_ENDPOINTS

def lambda_handler(event, context):
    """Main Lambda handler function"""
    try:
        endpoints = get_endpoints()
        for endpoint in endpoints:
            print(f"Checking endpoint: {endpoint['url']}")  # Added logging
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