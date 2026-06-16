from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from auth import verify_token
from main import db
from google.cloud.firestore_v1.base_query import FieldFilter

router = APIRouter()

@router.get("/")
def get_orders(canteen_id: str = None, studentId: str = None, token: dict = Depends(verify_token)):
    # allow read: if request.auth != null;
    query = db.collection("orders")
    
    # Optional filtering based on frontend usage
    if canteen_id:
        query = query.where(filter=FieldFilter("canteenId", "==", canteen_id))
    if studentId:
        query = query.where(filter=FieldFilter("studentId", "==", studentId))
        
    docs = query.stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

@router.post("/")
def create_order(data: Dict[str, Any], token: dict = Depends(verify_token)):
    # allow create: if request.auth != null;
    doc_ref = db.collection("orders").document()
    doc_ref.set(data)
    return {"message": "Order created successfully", "id": doc_ref.id}

@router.put("/{order_id}")
def update_order(order_id: str, data: Dict[str, Any], token: dict = Depends(verify_token)):
    # allow update: if request.auth != null;
    db.collection("orders").document(order_id).update(data)
    return {"message": "Order updated successfully", "id": order_id}

@router.delete("/{order_id}")
def delete_order(order_id: str, token: dict = Depends(verify_token)):
    # allow delete: if request.auth != null;
    db.collection("orders").document(order_id).delete()
    return {"message": "Order deleted successfully", "id": order_id}
