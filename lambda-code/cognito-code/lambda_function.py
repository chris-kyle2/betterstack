import boto3
import json
import os
from datetime import datetime


dynamodb = boto3.resource('dynamodb')
user_table = dynamodb.Table(os.environ['TABLE_NAME'])

def handler(event, context):
    try:
        user_attributes = event['request']['userAttributes']
        print(f"User attributes: {user_attributes}")

        user_item = {
            'user_id': user_attributes['sub'],
            'email': user_attributes['email'],
            'created_at': datetime.now().isoformat(),
            'is_active': True,
            'user_name': user_attributes['username'],
            'updated_at': datetime.now().isoformat()
        }

        user_table.put_item(Item=user_item)
        

        return {
            'statusCode': 200,
            'body': json.dumps('User attributes processed successfully')
        }
    except Exception as e:
        print(f"Error processing user attributes: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {e}')
        }