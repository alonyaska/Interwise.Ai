from fastapi import APIRouter, Response



from backend.Users.schemas import SRegister, SLogin
from backend.Users.service import UserService

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]

)



@router.post("/Register")
async  def register_user(user_data:SRegister):
    await  UserService.register_or_401(user_data)




@router.post("/Login")
async  def login_user(user_data:SLogin, response:Response):
    await  UserService.login_or_401(user_data, response)


@router.post("/Logout")
async  def logout_user(response:Response):
    await  UserService.logout_user(response)











