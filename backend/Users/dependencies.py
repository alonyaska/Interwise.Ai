from datetime import datetime

from fastapi import Request
from fastapi.params import Depends
from jose import jwt, JWTError

from backend.Users.dao import UsersDao
from backend.config import settings
from backend.exceptions import UserNotLogin, TokenAbsentException, TokenIsExpireException, IncorrectTokenType


def get_token(request: Request):
    token = request.cookies.get("user_url_token")
    if not  token:
        raise  UserNotLogin()
    return token



async def  get_current_user(token: str = Depends(get_token)):
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, settings.ALGORITHM
        )

    except JWTError:
        raise TokenAbsentException()
    expire: str = payload.get("exp")
    if (not expire) or (int(expire) < datetime.utcnow().timestamp()):
        raise TokenIsExpireException()
    email: str = payload.get("email")
    if not email:
        raise IncorrectTokenType()
    user = await  UsersDao.find_by_email(email)
    if not  user:
        raise IncorrectTokenType()

    return  user

