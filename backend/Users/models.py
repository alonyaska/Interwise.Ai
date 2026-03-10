from sqlalchemy import Column, Integer, String, Boolean

from backend.database import Base


class UsersModel(Base):
    __tablename__ = "Users"


    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    sub_is = Column(Boolean, nullable=True)

