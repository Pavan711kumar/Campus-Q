import os
import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

cred_path = os.getenv('FIREBASE_CREDENTIALS', 'serviceAccountKey.json')
try:
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        # Fallback to Application Default Credentials
        firebase_admin.initialize_app()
except ValueError:
    # App already initialized
    pass

db = firestore.client()

app = FastAPI(title="Student Canteen API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes import users, canteens, menu, orders

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(canteens.router, prefix="/api/canteens", tags=["canteens"])
app.include_router(menu.router, prefix="/api/menuItems", tags=["menuItems"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Student Canteen API"}
