from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.post("/add")
async def add_course():
    # Your logic to add a new course
    return {"message": "Add course endpoint"}

@router.get("/all")
async def get_all_courses():
    # Your logic to get all courses
    return {"message": "Get all courses endpoint"}
