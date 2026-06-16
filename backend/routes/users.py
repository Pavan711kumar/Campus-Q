from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
from auth import verify_token
from main import db

router = APIRouter()

@router.get("/")
def get_users(token: dict = Depends(verify_token)):
    # allow list: if request.auth != null;
    docs = db.collection("users").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

@router.get("/{user_id}")
def get_user(user_id: str, token: dict = Depends(verify_token)):
    # allow read: if request.auth != null;
    doc = db.collection("users").document(user_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": doc.id, **doc.to_dict()}

@router.post("/{user_id}")
def create_user(user_id: str, data: Dict[str, Any], token: dict = Depends(verify_token)):
    # allow create: if request.auth != null && request.auth.uid == userId;
    if token.get("uid") != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to create this user")
    
    db.collection("users").document(user_id).set(data)
    return {"message": "User created successfully", "id": user_id}

@router.put("/{user_id}")
def update_user(user_id: str, data: Dict[str, Any], token: dict = Depends(verify_token)):
    # allow update: if request.auth != null;
    # Note: Rules allow any authenticated user to update any user doc (based on original firestore.rules)
    db.collection("users").document(user_id).update(data)
    return {"message": "User updated successfully", "id": user_id}
