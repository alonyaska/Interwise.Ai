from backend.Users.auth import get_password_hash, authenticate_user, create_access_token
from backend.Users.dao import UsersDao
from backend.Users.schemas import SRegister, SLogin

from backend.exceptions import UserAlreedyHasInSite, UserNotLogin
from fastapi import  Response

class UserService:






    @classmethod
    async  def register_or_401(cls, user_data:  SRegister):
        existing_user = await  UsersDao.get_one_or_none(email=user_data.email)
        if existing_user:
            raise UserAlreedyHasInSite()
        hashed_password = get_password_hash(user_data.password)
        await  UsersDao.add(email=user_data.email, hashed_password=hashed_password)



    @classmethod
    async  def login_or_401(cls, user_data: SLogin, response: Response):
        user = await  authenticate_user(email=user_data.email, password=user_data.password)
        if not user:
            raise  UserNotLogin()
        token = create_access_token({"sub": str(user.id),
                                     "email": str(user.email)})
        response.set_cookie("user_url_token", token, httponly=True, secure=False, samesite="lax")
        return  token


    @classmethod
    async  def logout_user(cls, response:Response):
        response.delete_cookie("user_url_token")
