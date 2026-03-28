from pydantic import BaseModel, EmailStr


class SRegister(BaseModel):
    email: EmailStr
    password:str


class SLogin(BaseModel):
    email:EmailStr
    password:str


class SupdUser(BaseModel):
    id:int
    email:EmailStr
