import requests
import os
from fastapi import HTTPException,Depends
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from jose import jwt



security = HTTPBearer()

COGNITO_REGION = os.getenv("COGNITO_REGION","us-east-1")
COGNITO_USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID","us-east-1_1Qfz8qLsw")
COGNITO_CLIENT_ID = os.getenv("COGNITO_CLIENT_ID","3o46972ns1ataqhvnf1jm19sdp")

JWKS_URL = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USER_POOL_ID}/.well-known/jwks.json"

jwks = requests.get(JWKS_URL).json()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security))->str:
    try:
        token = credentials.credentials
        print(f"Received token: {token[:20]}...")
        try:
          header = jwt.get_unverified_header(token)
          print(f"Token header: {header}")
        except Exception as e:
          print(f"Error getting header: {e}")
          raise HTTPException(status_code=401, detail="Invalid token format")
        kid = header["kid"]
        if not kid:
            raise HTTPException(status_code=401, detail="Token missing key id")
        key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
        if not key:
            raise HTTPException(status_code=401, detail="Token key not found")
        
        decoded = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=COGNITO_CLIENT_ID,
            issuer=f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USER_POOL_ID}",
        )
        return decoded["sub"]
    except Exception as e:
        print(f"Error decoding token: {e}")
        raise HTTPException(status_code=401, detail="Unauthorized")









