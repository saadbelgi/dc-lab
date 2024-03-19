from typing import Optional
from sqlmodel import create_engine, SQLModel, Field, Relationship, Column, VARCHAR


DATABASE_URL = "mysql://springstudent:springstudent@localhost/dc_exp3"
engine = create_engine(DATABASE_URL, echo=True)


class Teacher(SQLModel, table=True):
    """Teacher model"""
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(sa_column=Column("email", VARCHAR(255), unique=True))
    password: bytes

    courses: list["Course"] = Relationship(back_populates="teacher")


class Enrolment(SQLModel, table=True):
    """Enrolment model, which links student to course"""
    student_id: Optional[int] = Field(
        default=None, foreign_key="student.id", primary_key=True
    )
    course_id: Optional[int] = Field(
        default=None, foreign_key="course.id", primary_key=True
    )


class Course(SQLModel, table=True):
    """Course model"""
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    code: str
    teacher_id: int = Field(foreign_key="teacher.id")

    teacher: Teacher = Relationship(back_populates="courses")
    students: list["Student"] = Relationship(
        back_populates="courses", link_model=Enrolment)


class Student(SQLModel, table=True):
    """Student model"""
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    courses: list["Course"] = Relationship(
        back_populates="students", link_model=Enrolment)

# relationship and response models to extract relationship attributes data


class StudentRead(SQLModel):
    """Data model representing Student read from database"""
    id: int
    name: str


class CourseReadWithStudents(SQLModel):
    """Response model: Course + student data"""
    id: int
    name: str
    code: str
    teacher_id: int
    students: list[Student] = []


class TeacherReadWithCourses(SQLModel):
    """Response model: Teacher + courses + student data"""
    id: int
    name: str
    email: str
    password: bytes
    courses: list[CourseReadWithStudents] = []


def create_tables():
    """Create tables in the database"""
    SQLModel.metadata.create_all(engine)


if __name__ == '__main__':
    create_tables()
