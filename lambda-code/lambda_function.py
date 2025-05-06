import asyncio
import os
import time
import httpx
import boto3
import uuid
from datetime import datetime

# List of websites to monitor
WEBSITES = [
    "https://www.google.com",
    "https://www.github.com",
    "https://www.wikipedia.org",
    "https://www.stackoverflow.com",
]

# DynamoDB table name from environment variables
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
        # Validate required fields
        if "url" not in result or "timestamp" not in result or "status" not in result:
            print(f"Invalid result skipped: {result}")
            continue

        # Write result to DynamoDB
        item = {
            "id": str(uuid.uuid4()),
            "url": result["url"],
            "timestamp": result["timestamp"],
            "status": result["status"],
            "status_code": result.get("status_code") or "N/A",
            "response_time_ms": result.get("response_time_ms") or 0,
        }
        try:
            table.put_item(Item=item)
        except Exception as e:
            print(f"Error saving to DynamoDB for {result['url']}: {e}")

    return {
        "status": "done",
        "checked": len(results),
        "successful_checks": sum(1 for r in results if r["status"] == "up"),
        "failed_checks": sum(1 for r in results if r["status"] == "down"),
    }
