from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from router import router as repai
load_dotenv()

app = FastAPI()

app.include_router(repai)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

