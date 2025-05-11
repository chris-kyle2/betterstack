from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import UserOut, UserCreate
from datetime import datetime
from app.db.users import get_users as get_users_db , get_user_by_id as get_user_by_id_db
from app.db.users import create_user as create_user_db
from app.db.users import delete_user as delete_user_db
from app.auth.cognito import get_current_user


router = APIRouter(
    prefix='/users',
    tags=['users']
)


@router.get("/me",response_model=UserOut,status_code=status.HTTP_200_OK)
def get_current_user_info(current_user_id: str = Depends(get_current_user)):
    return get_user_by_id_db(current_user_id)


@router.get("",response_model=list[UserOut],status_code=status.HTTP_200_OK)
def get_users():
    return get_users_db()


@router.get("/{user_id}",response_model=UserOut,status_code=status.HTTP_200_OK)
def get_user_by_id(user_id: str,current_user_id: str = Depends(get_current_user)):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this user")
    return get_user_by_id_db(user_id)


@router.post("",response_model=UserOut,status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate):
    return create_user_db(user)



@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str,current_user_id: str = Depends(get_current_user)):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")
    return delete_user_db(user_id)
    