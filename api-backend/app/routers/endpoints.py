from fastapi import APIRouter,Depends,HTTPException,status
from app.schemas import EndPointIn, EndPointOut
from app.db.endpoints import create_endpoint, get_endpoints, get_endpoint, update_endpoint, delete_endpoint
from app.auth.cognito import get_current_user


router = APIRouter(
    prefix='/endpoints',
    tags=['endpoints']
)


@router.post("",response_model=EndPointOut,status_code=status.HTTP_201_CREATED)
def create_endpoint_route(endpoint: EndPointIn,user_id: str = Depends(get_current_user)):
    try:
        return create_endpoint(endpoint,user_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("",response_model=list[EndPointOut],status_code=status.HTTP_200_OK)
def get_endpoints_route(user_id: str = Depends(get_current_user)):
    try:
        return get_endpoints(user_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{endpoint_id}",response_model=EndPointOut,status_code=status.HTTP_200_OK)
def get_one_endpoint_route(endpoint_id: str,user_id: str = Depends(get_current_user)):
    try:
        return get_endpoint(endpoint_id,user_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.put("/{endpoint_id}",response_model=EndPointOut,status_code = status.HTTP_200_OK)
def update_endpoint_route(endpoint_id: str,endpoint: EndPointIn,user_id: str = Depends(get_current_user)):
    try:
        return update_endpoint(endpoint_id,endpoint,user_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/{endpoint_id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_endpoint_route(endpoint_id: str,user_id: str = Depends(get_current_user)):
    try:
       delete_endpoint(endpoint_id,user_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))





