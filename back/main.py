from fastapi import FastAPI,Request, status,HTTPException
from ai_api_adapter import callApi,prepareApi
from prepare_prompt import checkUrl,prepare
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta, timezone
from fastapi.responses import JSONResponse
import jwt
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.authentication import AuthenticationMiddleware

from starlette.authentication import (
    AuthCredentials, AuthenticationBackend, AuthenticationError, SimpleUser
)
import traceback
import re
app = FastAPI()
ip_address =  "http://localhost:8000"
origins = [
    "http://localhost:8000",
    "http://localhost:3000",
]

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BasicAuthBackend(AuthenticationBackend):
    async def authenticate(self, request: Request):
        client_ip = get_client_ip(request)
        if client_ip in blocked_ips:
            raise AuthenticationError('Too many incorrect requests. You are temporarily blocked.')
        route_path = request.url.path
        if request.scope.get("method", None) == 'OPTIONS':
            return
        if not route_path.startswith('/api'):
            return
        if route_path.startswith('/api/token'):
            return            
        try:
            auth = request.headers["Authorization"]
            scheme, credentials = auth.split()
            if scheme.lower() != 'bearer' or client_ip!= check_token_ip(credentials):
                print(scheme)
                print(client_ip)
                raise AuthenticationError('Invalid basic auth credentials')
        except:
            traceback.print_exc()
            raise AuthenticationError('Invalid basic auth credentials')
        return AuthCredentials(["authenticated"]), SimpleUser("1")

app.add_middleware(AuthenticationMiddleware, backend=BasicAuthBackend())
failed_attempts={}
blocked_ips={}
MAX_FAILED_ATTEMPTS=10
BLOCK_DURATION = timedelta(minutes=60)


def create_access_token(to_encode: dict, expires_delta: timedelta | None = None):
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def check_token_ip(token):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    cur_ip: str = payload.get("ip")
    if cur_ip is None:
        raise credentials_exception
    return cur_ip

@app.post("/api/token")
async def token(request:Request):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        to_encode={"ip": get_client_ip(request)}, expires_delta=access_token_expires
    )
    return {"token": access_token, "token_type": "bearer"}

@app.get("/api")
async def root():
    return {"message": "Hello World"}

@app.get("/api/url")
async def read_item(url: str):
    print(url)
    t = callApi(prepare(url))
    print(t)
    matches = re.findall(r'\[(.*?)\]', t)
    if len(matches) == 0: 
        return []    
    return str(matches[0]).split(',')

app.mount("/", StaticFiles(directory="static"), name="static")
prepareApi()

@app.exception_handler(StarletteHTTPException)
async def custom_404_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        client_ip = get_client_ip(request)
        failed_attempts[client_ip] = failed_attempts.get(client_ip, 0) + 1
        if failed_attempts[client_ip] >= MAX_FAILED_ATTEMPTS:
            blocked_ips[client_ip] = datetime.now() + BLOCK_DURATION
        return JSONResponse(
        status_code=404,
        content={"message": "Oops! The resource was not found."},
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


def get_client_ip(request:Request):
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    
    if x_forwarded_for:
        client_ip = x_forwarded_for.split(",")[0].strip()
    else:
        client_ip = request.client.host
    return client_ip