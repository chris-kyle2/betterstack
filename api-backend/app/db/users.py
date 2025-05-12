from app.db.dynamodb import get_table
from app.schemas import UserCreate, UserOut
from datetime import datetime
from fastapi import HTTPException,Depends
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
import os

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security))->str:
    return credentials.credentials


TABLE_NAME = os.getenv('DYNAMODB_TABLE', 'dev-us-east-1-cognito-users-table-dynamodb-table')
def create_user(user: UserCreate) -> UserOut:
    try:
            
        table = get_table(TABLE_NAME)
        item = {
            "user_id": user.user_id,
            "email": user.email,
            "plan": user.plan,
            "created_at": datetime.now().isoformat()
        }
        table.put_item(Item=item)
        return UserOut(**item)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

def get_users() -> list[UserOut]:
    try:
        table = get_table(TABLE_NAME)
        response = table.scan()
        return [UserOut(**item) for item in response['Items']]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
    

def get_user_by_id(user_id: int) -> UserOut:
    table = get_table(TABLE_NAME)
    response = table.get_item(Key={"user_id": user_id})
    if 'Item' in response:
        return UserOut(**response['Item'])
    else:
        raise HTTPException(status_code=404, detail=f"User with id: {user_id} not found")

def delete_user(user_id: int) -> None:
    table = get_table(TABLE_NAME)
    try:
        if not get_user_by_id(user_id):
            raise HTTPException(status_code=404, detail=f"User with id: {user_id} not found")
        table.delete_item(Key = {"user_id": user_id})
        return {"message": f"User with id: {user_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    








