from fastapi import APIRouter, HTTPException, Query, Depends
from app.db.logsFetch import get_logs_by_endpoint
from app.schemas import LogListResponse
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
    

    
