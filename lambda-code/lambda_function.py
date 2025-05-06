import asyncio
import os
import time
import httpx
import boto3
from datetime import datetime

# List of websites to monitor
WEBSITES = [
    "https://www.google.com",
    "https://www.github.com",
    "https://www.wikipedia.org",
    "https://www.stackoverflow.com",
]

TABLE_NAME = os.environ.get("TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

async def check_website(client, url):
    try:
        start = time.time()
        response = await client.get(url, timeout=10.0)
        end = time.time()
        return {
            "url": url,
            "status_code": response.status_code,
            "response_time_ms": int((end - start) * 1000),
            "timestamp": datetime.utcnow().isoformat(),
            "status": "up" if response.status_code < 500 else "down",
        }
    except Exception as e:
        return {
            "url": url,
            "status_code": None,
            "response_time_ms": None,
            "timestamp": datetime.utcnow().isoformat(),
            "status": "down",
            "error": str(e),
        }

async def monitor_websites():
    async with httpx.AsyncClient() as client:
        tasks = [check_website(client, url) for url in WEBSITES]
        return await asyncio.gather(*tasks)

def lambda_handler(event, context):
    results = asyncio.run(monitor_websites())
    for result in results:
        # Write result to DynamoDB
        item = {
            "id": str(uuid.uuid4()),
            "url": result["url"],
            "timestamp": result["timestamp"],
            "status": result["status"],
            "status_code": result["status_code"] or "N/A",
            "response_time_ms": result["response_time_ms"] or 0,
        }
        table.put_item(Item=item)

    return {"status": "done", "checked": len(results)}
