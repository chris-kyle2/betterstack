import boto3
from boto3.dynamodb.conditions import Key
from app.schemas import EndPointIn, EndPointOut
from datetime import datetime
from fastapi import HTTPException, Depends
from app.auth.cognito import get_current_user
import os
import uuid

dynamodb_client = boto3.resource('dynamodb')
TABLE_NAME = os.getenv('DYNAMODB_TABLE', 'dev-us-east-1-central-api-endpoints-table-endpoints-dynamodb-table')
endpoints_table = dynamodb_client.Table(TABLE_NAME)

def create_endpoint(endpoint: EndPointIn,user_id: str)->EndPointOut:
    try:
        endpoint_id = str(uuid.uuid4())
        created_at = datetime.now().isoformat()
        item = {
            'user_id': user_id,
            'endpoint_id': endpoint_id,
            'url': endpoint.url,
            'is_active': endpoint.is_active,
            'created_at': created_at,
        }
        endpoints_table.put_item(Item=item)
        return EndPointOut(
            endpoint_id=endpoint_id,
            url=endpoint.url,
            is_active=endpoint.is_active,
            created_at=datetime.fromisoformat(created_at)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

def get_endpoints(user_id: str)-> list[EndPointOut]:
    try:
        response = endpoints_table.query(
            KeyConditionExpression=Key('user_id').eq(user_id)
        )
        return [EndPointOut(**item) for item in response['Items']]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

def get_endpoint(endpoint_id: str, user_id: str)->EndPointOut:
    try:
        response = endpoints_table.get_item(
            Key={'user_id': user_id, 'endpoint_id': endpoint_id}
        )
        if 'Item' not in response:
            raise HTTPException(status_code=404, detail='Endpoint not found')
        return EndPointOut(**response['Item'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

def update_endpoint(endpoint_id: str, endpoint: EndPointIn, user_id: str )->EndPointOut:
    try:
        response = endpoints_table.update_item(
            Key={'user_id': user_id, 'endpoint_id': endpoint_id},
            UpdateExpression='set url = :url, is_active = :is_active',
            ExpressionAttributeValues={
                ':url': endpoint.url,
                ':is_active': endpoint.is_active
            },
            ReturnValues='UPDATED_NEW'
        )
        return EndPointOut(**response['Attributes'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

def delete_endpoint(endpoint_id: str,user_id: str )->dict:
    try:
        endpoints_table.delete_item(
            Key={'user_id': user_id, 'endpoint_id': endpoint_id}
        )
        return {'message': 'Endpoint deleted successfully'}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    




