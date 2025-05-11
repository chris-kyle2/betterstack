from fastapi import FastAPI
from app.routers import users,endpoints

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


app.include_router(users.router)
app.include_router(endpoints.router)