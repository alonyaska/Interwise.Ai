from backend.Users.models import UsersModel
from backend.dao.base import BaseDao


class UsersDao(BaseDao):
    model = UsersModel