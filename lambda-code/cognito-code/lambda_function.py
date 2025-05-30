import boto3
import json
import os
from datetime import datetime


dynamodb = boto3.resource('dynamodb')
user_table = dynamodb.Table(os.environ['TABLE_NAME'])

def handler(event, context):
    try:
        user_attributes = event['request']['userAttributes']
        print(event)
        print(f"User attributes: {user_attributes}")

        user_item = {
            'user_id': user_attributes['sub'],
            'email': user_attributes['email'],
            'name': user_attributes['name'],
            'created_at': datetime.now().isoformat(),
            'is_active': True,
            'updated_at': datetime.now().isoformat()
        }

        user_table.put_item(Item=user_item)
        print(f"User item: {user_item} inserted into table {os.environ['TABLE_NAME']}")
  
    except Exception as e:
        print(f"Error processing user attributes: {e}")
    
    return event
        

        