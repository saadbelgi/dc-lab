import re
import os
import uuid
from typing import Optional, Union
from uu import Error
from fastapi.responses import FileResponse

import jwt
from cryptography.fernet import Fernet
from database import Course, CourseReadWithStudents, Teacher, create_tables, engine
from fastapi import FastAPI, File, Request, Response, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Session, select

# for plotting and visualisation
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from io import StringIO, BytesIO

# for threading
import threading

UPLOAD_PATH = r'C:\Users\arifa\Desktop\college stuff\dc\exp3\server\uploads'

# JWT variables:
JWT_SECRET = b"deff1952d59f883ece260e8683fed21ab0ad9a53323eca4f"
JWT_ALGORITHM = "HS256"


# generate key for encrypting passwords, or read existing key:


def get_encrypter() -> Fernet:
    """Returns a Fernet instance for encryption and decryption of passwords"""
    f = open('key.txt', 'rb')
    key = f.read()
    if len(key) == 0:
        key = Fernet.generate_key()
        f.close()
        f = open('key.txt', 'wb')
        f.write(key)
    f.close()
    return Fernet(key)


class StandardResponse(BaseModel):
    """Format of a standard response of this API"""
    error: bool
    message: str


class SignupReq(BaseModel):
    """Request body for /signup endpoint"""
    name: str
    email: str
    password: str


class LoginReq(BaseModel):
    """Request body for /login endpoint"""
    email: str
    password: str


class PostCourseReq(BaseModel):
    """Request body for POST /course endpoint"""
    name: str
    code: str


class AuthenticationResponse(BaseModel):
    """Result of authenticate function"""
    authenticated: bool
    id: Optional[int] = None


def authenticate(request: Request) -> AuthenticationResponse:
    """Authenticate request"""
    print(request.cookies)
    if 'token' not in request.cookies:
        return AuthenticationResponse(authenticated=False)
    rcvd_token = request.cookies['token']
    try:
        decoded = jwt.decode(rcvd_token, JWT_SECRET, [JWT_ALGORITHM])
        return AuthenticationResponse(authenticated=True, id=decoded["id"])
    except Error:
        return AuthenticationResponse(authenticated=False)


# get encrypter instance
encrypter = get_encrypter()

# create DB tables
create_tables()

app = FastAPI()


@app.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(payload: SignupReq, response: Response) -> StandardResponse:
    """Path function for signup endpoint"""
    if re.match(r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$", payload.password) is None:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return StandardResponse(error=True, message="Password doesn't match required format")
    try:
        with Session(engine) as session:
            teacher = session.exec(select(Teacher).where(
                Teacher.email == payload.email)).first()
            if teacher is not None:
                response.status_code = status.HTTP_409_CONFLICT
                return StandardResponse(error=True, message="Teacher is already registered")
            encrypted_pwd = encrypter.encrypt(payload.password.encode())
            teacher = Teacher(name=payload.name,
                              email=payload.email, password=encrypted_pwd)
            session.add(teacher)
            # generate JWT
            jwt_payload = {"id": teacher.id}
            token = jwt.encode(jwt_payload, JWT_SECRET,
                               algorithm=JWT_ALGORITHM)
            response.set_cookie(key="token", value=token, httponly=True,
                                samesite='none', max_age=86400)
            session.commit()
            return StandardResponse(error=False, message="Teacher registered successfully")
    except Error:
        return StandardResponse(error=True, message="Some issue")


@app.post("/login", status_code=status.HTTP_200_OK)
def login(payload: LoginReq, response: Response) -> StandardResponse:
    """Path function for login endpoint"""
    if re.match(r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$", payload.password) is None:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return StandardResponse(error=True, message="Invalid password")
    try:
        with Session(engine) as session:
            teacher = session.exec(select(Teacher).where(
                Teacher.email == payload.email)).first()
            if teacher is None:
                response.status_code = status.HTTP_404_NOT_FOUND
                return StandardResponse(error=True, message="Teacher is not registered")
            decrypted_pwd = encrypter.decrypt(teacher.password).decode()
            if decrypted_pwd != payload.password:
                response.status_code = status.HTTP_401_UNAUTHORIZED
                return StandardResponse(error=True, message="Wrong password")
            # generate JWT
            jwt_payload = {"id": teacher.id}
            token = jwt.encode(jwt_payload, JWT_SECRET,
                               algorithm=JWT_ALGORITHM)
            response.set_cookie(key="token", value=token, httponly=True,
                                samesite='none', secure=True, max_age=86400)
            session.commit()
            return StandardResponse(error=False, message="Logged in successfully")
    except Error:
        return StandardResponse(error=True, message="Some issue")


@app.get('/course')
def get_courses(request: Request, response: Response) -> Union[StandardResponse, list[CourseReadWithStudents]]:
    """Path function for GET course endpoint, gets all courses for logged in teacher"""
    res = authenticate(request=request)
    if not res.authenticated:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return StandardResponse(error=True, message="Not authenticated")
    user_id = res.id
    with Session(engine) as session:
        teacher = session.get(Teacher, user_id)
        if teacher is None:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return StandardResponse(error=True, message="Token corrupted")
        ret = []
        for course in teacher.courses:
            ret.append(CourseReadWithStudents(id=course.id, name=course.name, # type: ignore
                       code=course.code, students=course.students, teacher_id=course.teacher_id))
        return ret


@app.post('/course')
def add_course(payload: PostCourseReq, request: Request, response: Response) -> StandardResponse:
    """Path function for POST course endpoint, adds a new course under the teacher"""
    res = authenticate(request=request)
    if not res.authenticated or res.id is None:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return StandardResponse(error=True, message="Not authenticated")
    user_id = res.id
    try:
        with Session(engine) as session:
            course = Course(name=payload.name, code=payload.code,
                            teacher_id=user_id)
            session.add(course)
            session.commit()
            return StandardResponse(error=False, message='COurse created')
    except Error:
        return StandardResponse(error=True, message="Some issue")


def save_file(b: bytes, path):
    """Function to save bytes object to a file"""
    with open(path, 'wb') as out_file:
        out_file.write(b)


def visualize(b: bytes):
    """Function to generate plots"""
    df = pd.read_csv(StringIO(b.decode('utf-8')))
    (fig, ax) = plt.subplots(4, 1)
    fig.set_size_inches((10, 30))
    sns.histplot(df, x='ISE-1', bins=4, ax=ax[0])
    sns.histplot(df, x='ISE-2', bins=5, ax=ax[1])
    sns.histplot(df, x='MSE', bins=5, ax=ax[2])
    sns.histplot(df, x='ESE', bins=5, ax=ax[3])
    # img_buf = BytesIO()
    plt.savefig("my_image.png", format='png')
    plt.close(fig)
    # print(img_buf.read())
    print('Image buffer generated')
    # return img_buf.read()

class ThreadWithReturnValue(threading.Thread):
    def __init__(self, group=None, target=None, name=None,
                 args=(), kwargs={}):
        threading.Thread.__init__(self, group, target, name, args, kwargs)
        self._return = None

    def run(self):
        if self._target is not None:
            self._return = self._target(*self._args, **self._kwargs)

    def join(self, *args):
        threading.Thread.join(self, *args)
        return self._return


@app.post('/marksheet')
async def upload_marksheet(marksheet: UploadFile, request: Request, response: Response):
    """Path function for POST marsheet endpoint, saves the marksheet and returns some analytics"""
    res = authenticate(request=request)
    if not res.authenticated or res.id is None:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return StandardResponse(error=True, message="Not authenticated")
    try:
        if marksheet.content_type != 'text/csv':
            return StandardResponse(error=True, message="Only CSV files are accepted")
        filename = uuid.uuid4().hex + '.csv'
        out_path = os.path.join(UPLOAD_PATH, filename)
        binary_file = await marksheet.read()
        t1 = threading.Thread(target=save_file, args=[binary_file, out_path])
        t2 = ThreadWithReturnValue(target=visualize, args=[binary_file])
        t1.start()
        t2.start()
        t2.join()
        return FileResponse(path='my_image.png', media_type='image/png')
    except Error:
        return StandardResponse(error=True, message="Some issue")


app.add_middleware(CORSMiddleware,
                   allow_origins=['http://localhost:5173'],
                   allow_credentials=True,
                   allow_methods=['*'],
                   allow_headers=['*'],
                   expose_headers=["*"])
