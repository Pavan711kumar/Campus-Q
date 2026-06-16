from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from auth import verify_token
from main import db

router = APIRouter()

@router.get("/")
def get_canteens(token: dict = Depends(verify_token)):
    # allow read: if request.auth != null;
    docs = db.collection("canteens").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

@router.get("/{canteen_id}")
def get_canteen(canteen_id: str, token: dict = Depends(verify_token)):
    doc = db.collection("canteens").document(canteen_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Canteen not found")
    return {"id": doc.id, **doc.to_dict()}

@router.post("/")
def create_canteen(data: Dict[str, Any], token: dict = Depends(verify_token)):
    # allow create: if request.auth != null;
    doc_id = data.pop("id", None)
    if doc_id:
        doc_ref = db.collection("canteens").document(doc_id)
    else:
        doc_ref = db.collection("canteens").document()
    doc_ref.set(data)
    return {"message": "Canteen created successfully", "id": doc_ref.id}

@router.put("/{canteen_id}")
def update_canteen(canteen_id: str, data: Dict[str, Any], token: dict = Depends(verify_token)):
    # allow update: if request.auth != null;
    db.collection("canteens").document(canteen_id).update(data)
    return {"message": "Canteen updated successfully", "id": canteen_id}

@router.delete("/{canteen_id}")
def delete_canteen(canteen_id: str, token: dict = Depends(verify_token)):
    # allow delete: if request.auth != null;
    db.collection("canteens").document(canteen_id).delete()
    return {"message": "Canteen deleted successfully", "id": canteen_id}
