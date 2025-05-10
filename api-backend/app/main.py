from fastapi import FastAPI
from app.routers import users

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


app.include_router(users.router, prefix="/users", tags=["users"])