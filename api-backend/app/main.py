from fastapi import FastAPI
from app.routers import users,endpoints,logsRoute
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["betterstack.vercel.app","http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], # Allows all methods
    allow_headers=["*"],  # Allows all headers
    expose_headers=["*"]
)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


app.include_router(users.router)
app.include_router(endpoints.router)
app.include_router(logsRoute.router)