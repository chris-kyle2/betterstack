import boto3
from botocore.exceptions import ClientError
import os


dynamodb = boto3.resource('dynamodb', region_name=os.getenv('AWS_REGION','us-east-1'))

def get_table(table_name: str):
    try:
       return dynamodb.Table(table_name)
    except ClientError as e:
        print(e.response['Error']['Message'])
        raise e
       

