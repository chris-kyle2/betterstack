import boto3
import os
import json
from datetime import datetime
from boto3.dynamodb.conditions import Key
from typing import Optional
from fastapi import HTTPException
from app.schemas import  LogListResponse, LogResponse, LogStatsResponse, TimeRangeParams


dynamodb_client = boto3.resource('dynamodb')
TABLE_NAME = os.getenv('DYNAMODB_TABLE', 'dev-us-east-1-central-api-logs-dynamodb-table')

def get_logs_by_endpoint(endpoint_id: str, user_id: str, limit: Optional[int] = 10, next_token: Optional[str] = None) -> LogListResponse:
    try: 
        print(f"[DEBUG] Starting get_logs_by_endpoint for endpoint_id: {endpoint_id}, user_id: {user_id}")
        logs_table = dynamodb_client.Table(TABLE_NAME)
        
        query_params = {
            'IndexName': 'endpoint_id-index',
            'KeyConditionExpression': 'endpoint_id = :endpoint_id',
            'FilterExpression': 'user_id = :user_id',
            'ExpressionAttributeValues': {
                ':endpoint_id': endpoint_id,
                ':user_id': user_id
            },
            'Limit': limit,
            'ScanIndexForward': False
        }
        print(f"[DEBUG] Query parameters: {json.dumps(query_params, default=str)}")
        
        if next_token:
            query_params['ExclusiveStartKey'] = json.loads(next_token)
            print(f"[DEBUG] Using next_token: {next_token}")
        
        try:
            response = logs_table.query(**query_params)
            print(f"[DEBUG] DynamoDB response received. Count: {response.get('Count')}, ScannedCount: {response.get('ScannedCount')}")
        except Exception as query_error:
            print(f"[ERROR] DynamoDB query failed: {str(query_error)}")
            raise HTTPException(status_code=500, detail=f"DynamoDB query failed: {str(query_error)}")
        
        # Convert DynamoDB items to the correct format
        logs = []
        for index, item in enumerate(response['Items']):
            try:
                print(f"[DEBUG] Processing item {index + 1}/{len(response['Items'])}")
                print(f"[DEBUG] Raw item: {json.dumps(item, default=str)}")
                
                # Convert numeric values from strings
                if 'response_time' in item and item['response_time'] is not None:
                    item['response_time'] = float(item['response_time'])
                    print(f"[DEBUG] Converted response_time: {item['response_time']}")
                
                if 'dns_latency' in item and item['dns_latency'] is not None:
                    item['dns_latency'] = float(item['dns_latency'])
                    print(f"[DEBUG] Converted dns_latency: {item['dns_latency']}")
                
                if 'connect_latency' in item and item['connect_latency'] is not None:
                    item['connect_latency'] = float(item['connect_latency'])
                    print(f"[DEBUG] Converted connect_latency: {item['connect_latency']}")
                
                if 'total_latency' in item and item['total_latency'] is not None:
                    item['total_latency'] = float(item['total_latency'])
                    print(f"[DEBUG] Converted total_latency: {item['total_latency']}")
                
                if 'status_code' in item and item['status_code'] is not None:
                    item['status_code'] = int(item['status_code'])
                    print(f"[DEBUG] Converted status_code: {item['status_code']}")
                
                # Convert timestamp string to datetime
                if 'timestamp' in item:
                    item['timestamp'] = datetime.fromisoformat(item['timestamp'].replace('Z', '+00:00'))
                    print(f"[DEBUG] Converted timestamp: {item['timestamp']}")
                
                # Convert boolean values
                if 'is_up' in item:
                    item['is_up'] = bool(item['is_up'])
                    print(f"[DEBUG] Converted is_up: {item['is_up']}")
                
                if 'certificate_valid' in item:
                    item['certificate_valid'] = bool(item['certificate_valid'])
                    print(f"[DEBUG] Converted certificate_valid: {item['certificate_valid']}")
                
                if 'is_secure' in item:
                    item['is_secure'] = bool(item['is_secure'])
                    print(f"[DEBUG] Converted is_secure: {item['is_secure']}")
                
                # Set secure_protocol based on is_secure
                if 'is_secure' in item:
                    item['secure_protocol'] = item['is_secure']
                    print(f"[DEBUG] Set secure_protocol based on is_secure: {item['secure_protocol']}")
                
                # Handle optional string fields
                if 'error_message' in item:
                    item['error_message'] = str(item['error_message']) if item['error_message'] is not None else None
                    print(f"[DEBUG] Set error_message: {item['error_message']}")
                
                try:
                    log_response = LogResponse(**item)
                    logs.append(log_response)
                    print(f"[DEBUG] Successfully created LogResponse for item {index + 1}")
                except Exception as model_error:
                    print(f"[ERROR] Failed to create LogResponse for item {index + 1}: {str(model_error)}")
                    print(f"[ERROR] Item data: {json.dumps(item, default=str)}")
                    raise HTTPException(
                        status_code=500, 
                        detail=f"Failed to create LogResponse: {str(model_error)}"
                    )
                
            except Exception as item_error:
                print(f"[ERROR] Failed to process item {index + 1}: {str(item_error)}")
                raise HTTPException(
                    status_code=500, 
                    detail=f"Failed to process log item: {str(item_error)}"
                )

        total_count = response['Count']
        has_more = 'LastEvaluatedKey' in response
        next_token = json.dumps(response['LastEvaluatedKey']) if has_more else None
        
        print(f"[DEBUG] Processed {len(logs)} logs successfully")
        print(f"[DEBUG] Total count: {total_count}, Has more: {has_more}")

        return LogListResponse(
            logs=logs,
            total_count=total_count,
            next_token=next_token,
            has_more=has_more
        )
        
    except dynamodb_client.meta.client.exceptions.ClientError as e:
        print(f"[ERROR] DynamoDB Client Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"DynamoDB Error: {str(e)}")
    except Exception as e:
        print(f"[ERROR] Unexpected error in get_logs_by_endpoint: {str(e)}")
        print(f"[ERROR] Error type: {type(e)}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Error fetching logs from DynamoDB: {str(e)}")

def get_logs_by_time_range(user_id: str,time_range: TimeRangeParams,limit: Optional[int] = 10,next_token: Optional[str] = None) -> LogListResponse:
    try:
        logs_table = dynamodb_client.Table(TABLE_NAME)
        query_params = {
            'IndexName': 'timestamp-index',
            'FilterExpression': 'user_id = :user_id',
            'ExpressionAttributeValues': {
                ':user_id': user_id
            },
            'Limit': limit,
            'ScanIndexForward': False


        }
        if time_range.start_time and time_range.end_time:
            query_params['KeyConditionExpression'] = 'timestamp BETWEEN :start_time AND :end_time'
            query_params['ExpressionAttributeValues'].update({
                ':start_time': time_range.start_time.isoformat(),
                ':end_time': time_range.end_time.isoformat()
            })
        else:
            query_params['KeyConditionExpression'] = 'timestamp >= :start_time'
            query_params['ExpressionAttributeValues'].update({
                ':start_time': '1970-01-01T00:00:00'
            })
            
            
            
        if next_token:
            query_params['ExclusiveStartKey'] = json.loads(next_token)
        response = logs_table.query(**query_params)
        logs = [LogResponse(**item) for item in response['Items']]
        total_count = response['Count']
        has_more = 'LastEvaluatedKey' in response
        next_token = json.dumps(response['LastEvaluatedKey']) if has_more else None

        return LogListResponse(
            logs=logs,
            total_count=total_count,
            next_token=next_token,
            has_more=has_more
        )
    except dynamodb_client.meta.client.exceptions.ClientError as e:
        raise HTTPException(status_code=500, detail=f"DynamoDB Error : {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching logs from DynamoDB: {str(e)}")
        
def get_log_stats(
        endpoint_id: str,
        user_id: str,
        start_time: Optional[datetime]=None,
        end_time: Optional[datetime]=None,
        limit: Optional[int] = 10,
        next_token: Optional[str] = None
       
) -> LogStatsResponse:
    try:
        logs_table = dynamodb_client.Table(TABLE_NAME)
        query_params = {
            'IndexName': 'endpoint_id-index',
            'KeyConditionExpression': 'endpoint_id = :endpoint_id',
            'FilterExpression': 'user_id = :user_id',
            'ExpressionAttributeValues': {
                ':endpoint_id': endpoint_id,
                ':user_id': user_id
            },
            'Limit': limit,
            'ScanIndexForward': False

        }
        if start_time and end_time:
            query_params['KeyConditionExpression'] = 'AND timestamp BETWEEN :start_time AND :end_time'
            query_params['ExpressionAttributeValues'].update({
                ':start_time': start_time.isoformat(),
                ':end_time': end_time.isoformat()
            }) 
        if next_token:
            query_params['ExclusiveStartKey'] = json.loads(next_token)
        response = logs_table.query(**query_params)
        logs = [LogResponse(**item) for item in response['Items']]
        has_more = 'LastEvaluatedKey' in response
        next_token = json.dumps(response['LastEvaluatedKey']) if has_more else None
        


        total_checks = len(logs)
        successful_checks = sum(1 for log in logs if log.is_up)
        failed_checks = total_checks - successful_checks

        response_times = [log.response_time for log in logs if log.response_time is not None]
        dns_latencies = [log.dns_latency for log in logs if log.dns_latency is not None]
        connection_latencies = [log.connection_latency for log in logs if log.connection_latency is not None]
        total_latencies = [log.total_latency for log in logs if log.total_latency is not None]

        status_code_dist ={}
        for log in logs:
            if log.status_code:
                status_code_dist[log.status_code] = status_code_dist.get(log.status_code,0) + 1
            

        return LogStatsResponse(
                    total_checks=total_checks,
                    successful_checks=successful_checks,
                    failed_checks=failed_checks,
                    average_response_time=sum(response_times) / len(response_times) if response_times else 0,
                    average_dns_latency=sum(dns_latencies) / len(dns_latencies) if dns_latencies else 0,
                    average_connection_latency=sum(connection_latencies) / len(connection_latencies) if connection_latencies else 0,
                    average_total_latency=sum(total_latencies) / len(total_latencies) if total_latencies else 0,
                    status_code_distribution=status_code_dist
        )
    except dynamodb_client.meta.client.exceptions.ClientError as e:
        raise HTTPException(status_code=500, detail=f"DynamoDB Error : {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching logs from DynamoDB: {str(e)}")
    
    