from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from auth import verify_token
from main import db
from google.cloud.firestore_v1.base_query import FieldFilter

router = APIRouter()

@router.get("/")
def get_menu_items(canteen_id: str = None, token: dict = Depends(verify_token)):
    # allow read: if request.auth != null;
    query = db.collection("menuItems")
    if canteen_id:
        query = query.where(filter=FieldFilter("canteenId", "==", canteen_id))
    
    docs = query.stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

@router.post("/")
def create_menu_item(data: Dict[str, Any], token: dict = Depends(verify_token)):
    # allow create: if request.auth != null;
    doc_ref = db.collection("menuItems").document()
    # If the frontend sent a timestamp field, handle it if necessary
    doc_ref.set(data)
    return {"message": "Menu item created successfully", "id": doc_ref.id}

@router.put("/{item_id}")
def update_menu_item(item_id: str, data: Dict[str, Any], token: dict = Depends(verify_token)):
    # allow update: if request.auth != null;
    db.collection("menuItems").document(item_id).update(data)
    return {"message": "Menu item updated successfully", "id": item_id}

@router.delete("/{item_id}")
def delete_menu_item(item_id: str, token: dict = Depends(verify_token)):
    # allow delete: if request.auth != null;
    db.collection("menuItems").document(item_id).delete()
    return {"message": "Menu item deleted successfully", "id": item_id}
