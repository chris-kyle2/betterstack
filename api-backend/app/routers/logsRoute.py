from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.responses import StreamingResponse
from app.db.logsFetch import get_logs_by_endpoint
from app.schemas import LogListResponse
from app.auth.cognito import get_current_user
from typing import Optional
from datetime import datetime
import csv
import io

router = APIRouter(
    prefix="/logs",
    tags=["logs"]
)

@router.get("/{endpoint_id}", response_model=LogListResponse,status_code=200)
async def get_logs_by_endpoint_route(endpoint_id: str,user_id: str=Depends(get_current_user),
    limit: Optional[int] = Query(10,ge=1,le=100),
    next_token: Optional[str] = Query(None)
):
    try:
        return get_logs_by_endpoint(endpoint_id,user_id,limit,next_token)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/{endpoint_id}/export")
async def export_logs(
    endpoint_id: str,
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    user_id: str = Depends(get_current_user)
):
    try:
        logs = get_logs_by_endpoint(endpoint_id,user_id)
        if not logs:
            raise HTTPException(status_code=404, detail="No logs found")
        
        # Create a CSV buffer
        csv_buffer = io.StringIO()
        writer = csv.writer(csv_buffer)
        
        # Write the header
        writer.writerow(["Timestamp","Status","Response Time","User Agent"])
        
        # Write the data
        for log in logs.logs:
            writer.writerow([
                log.timestamp,
                log.region,
                'Online' if log.is_up else 'offline',
                log.response_time,
                log.dns_latency,
                log.connection_latency,
                log.total_latency,
                log.status_code,
                'Success' if log.status_code < 400 else 'Error',
                'Valid' if log.certificate_valid else 'Invalid',
                log.error_message or 'None'
                ])
        
        # Move the cursor to the beginning of the stream
        csv_buffer.seek(0)
        return StreamingResponse(
            iter([csv_buffer.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=logs_{endpoint_id}.csv"}
        )
        
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
