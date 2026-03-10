from sqlalchemy import select, insert

from backend.database import async_session_maker


class BaseDao:


    model = None

    @classmethod
    async def get_one_or_none(cls, **filter_by):
        async  with async_session_maker() as session:
            query = select(cls.model).filter_by(**filter_by)
            result = await  session.execute(query)
            return  result.scalar_one_or_none()



    @classmethod
    async def  add(cls, **data):
        async  with async_session_maker() as session:
            query = insert(cls.model).values(**data)
            await session.execute(query)
            await session.commit()

    @classmethod
    async def find_by_email(cls, model_email: str):
        async  with async_session_maker() as session:
            query = select(cls.model).filter_by(email=model_email)
            result = await  session.execute(query)
            return result.scalar_one_or_none()




