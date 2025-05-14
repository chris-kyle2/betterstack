from pydantic import BaseModel, EmailStr,validator

from typing import Optional,Dict
from datetime import datetime

class UserCreate(BaseModel):
    user_id: str
    email: EmailStr
    plan: Optional[str] = "Free"

class UserOut(UserCreate):
    plan: Optional[str] = "Free"
    created_at: datetime

    class Config:
        orm_mode = True


class EndPointIn(BaseModel):
    url: str
    is_active: bool = True
    @validator('url')
    def validate_url(cls, v):
        if not v.startswith('http'):
            raise ValueError('URL must start with http or https')
        return v

class EndPointOut(EndPointIn):
    endpoint_id: str
    created_at: datetime
    

    class Config:
        orm_mode = True



class TimeRangeParams(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class LogResponse(BaseModel):
    log_id: str
    endpoint_id: str
    user_id: str
    timestamp: datetime
    status_code: Optional[int] 
    response_time: Optional[float] 
    dns_latency: Optional[float] 
    connection_latency: Optional[float] 
    total_latency: Optional[float] 
    is_up: bool
    certificate_valid: bool
    error_message: Optional[str] 
    is_secure: bool
    certificate_expiry_date: Optional[str] 
    certificate_issuer: Optional[str] 
    tls_version: Optional[str] 
    secure_protocol: bool
    region: Optional[str] = None

    class Config:
        orm_mode = True

class TimeRangeResponse(BaseModel):
    start_time: datetime
    end_time: datetime
    total_logs: int
    logs: list[LogResponse]
    next_token: Optional[str] = None

    class Config:
        orm_mode = True



    
class LogListResponse(BaseModel):
    logs: list[LogResponse]
    total_count: int
    next_token: Optional[str] = None
    has_more: bool

    class Config:
        orm_mode = True


class LogStatsResponse(BaseModel):
    total_checks: int
    successful_checks: int
    failed_checks: int
    uptime_percentage: float
    average_response_time: float
    average_dns_latency: float
    average_connection_latency: float
    average_total_latency: float
    status_code_distribution: Dict[int, int]
    class Config:
        orm_mode = True


    



