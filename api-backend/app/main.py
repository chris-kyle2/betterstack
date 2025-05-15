from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.routers import users, endpoints, logsRoute
from fastapi.middleware.cors import CORSMiddleware
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://betterstack.vercel.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

# Add CORS and error handling middleware
@app.middleware("http")
async def add_cors_and_log_requests(request: Request, call_next):
    # Handle preflight requests
    if request.method == "OPTIONS":
        return JSONResponse(
            content={},
            headers={
                "Access-Control-Allow-Origin": "https://betterstack.vercel.app",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Max-Age": "3600",
            },
        )

    # Log the request
    logger.info(f"Request: {request.method} {request.url}")
    
    try:
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        
        # Add CORS headers to the response
        response.headers["Access-Control-Allow-Origin"] = "https://betterstack.vercel.app"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        
        return response
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(e)}"},
            headers={
                "Access-Control-Allow-Origin": "https://betterstack.vercel.app",
                "Access-Control-Allow-Credentials": "true",
            }
        )

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

# Include routers
app.include_router(users.router)
app.include_router(endpoints.router)
app.include_router(logsRoute.router)