from fastapi import APIRouter, HTTPException, Query, Depends
from app.db.logsFetch import get_logs_by_endpoint, get_log_stats, get_logs_by_time_range
from app.schemas import LogListResponse, LogStatsResponse, TimeRangeResponse, TimeRangeParams
from app.auth.cognito import get_current_user
from typing import Optional
from datetime import datetime

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
    
@router.get("/stats",response_model=LogStatsResponse,status_code=200)
async def  get_log_stats_route(
    endpoint_id: str,
    start_time: Optional[datetime]=Query(None),
    end_time: Optional[datetime]=Query(None),
    user_id: str=Depends(get_current_user),
    limit: Optional[int] = Query(10,ge=1,le=2),
    next_token: Optional[str] = Query(None)
):
    try:
        return get_log_stats(endpoint_id,user_id,start_time,end_time,time_range,limit,next_token)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/time-range",response_model=TimeRangeResponse,status_code=200)
async def get_time_range_route(
    time_range: TimeRangeParams,
    user_id: str=Depends(get_current_user),
    
    limit: Optional[int] = Query(10,ge=1,le=10),
    next_token: Optional[str] = Query(None),
    
):
    try:
        return get_logs_by_time_range(user_id,time_range,limit,next_token)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    