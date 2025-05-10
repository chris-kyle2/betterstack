import boto3
import os
from fastapi import HTTPException,Depends
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from jose import jwt



security = HTTPBearer()

COGNITO_REGION = os.getenv("COGNITO_REGION","us-east-1")
COGNITO_USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID","us-east-1_1Qfz8qLsw")
COGNITO_CLIENT_ID = os.getenv("COGNITO_CLIENT_ID","3cm526f7chp1vf8bkn59srqss5")

cognito = boto3.client("cognito-idp",region_name=COGNITO_REGION)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security))->str:
    try:
        token = credentials.credentials
        decoded = jwt.decode(
            token,
            cognito.get_public_key(COGNITO_USER_POOL_ID),
            algorithms=["RS256"],
            audience=COGNITO_CLIENT_ID,
        )
        return decoded["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")









