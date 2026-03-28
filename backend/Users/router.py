from fastapi import APIRouter, Response, Depends, HTTPException
from watchfiles import awatch

from backend.Users.schemas import SRegister, SLogin, SupdUser
from backend.Users.service import UserService
from backend.Users.dependencies import get_current_user
from backend.exceptions import NotUpdate

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]

)


@router.post("/Register")
async  def register_user(user_data:SRegister):
    await  UserService.register_or_401(user_data)
    return {"status": "registered"}




@router.post("/Login")
async  def login_user(user_data:SLogin, response:Response):
    await  UserService.login_or_401(user_data, response)
    return {"status": "ok"}


@router.post("/Logout")
async  def logout_user(response:Response):
    await  UserService.logout_user(response)
    return {"status": "logged_out"}


@router.get("/me")
async def get_me(current_user = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email}

@router.get("/mylove")
async  def get_my_love(current_user = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "ur Love": "Sonya <3"}


@router.patch("/me")
async def update_profile_me(user_data: SupdUser, current_user = Depends(get_current_user)):
    payload = SupdUser(id=current_user.id, email=user_data.email)
    updated_user = await UserService.upd_me(payload)
    if not updated_user:
        raise NotUpdate
    return {"id": updated_user.id, "email": updated_user.email}











