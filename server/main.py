from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import user, teacher, course
from dotenv import load_dotenv
import os

load_dotenv()
db_name = os.environ.get("DB_NAME")
db_host = os.environ.get("DB_HOST")
db_user = os.environ.get("DB_USER")
db_password = os.environ.get("DB_PASSWORD")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(user.router, prefix="/user", tags=["user"])
app.include_router(teacher.router, prefix="/teacher", tags=["teacher"])
app.include_router(course.router, prefix="/course", tags=["course"])