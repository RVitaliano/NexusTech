from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Item
from app.schemas import ItemCreate, ItemUpdate, ItemResponse
from typing import List

router = APIRouter()


@router.get("/", response_model=List[ItemResponse])
def listar_todos(db: Session = Depends(get_db)):
    return db.query(Item).filter(Item.ativo == True).all()

@router.get("/{item_id}", response_model=ItemResponse)
def buscar_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    return item

@router.post("/", response_model=ItemResponse, status_code=201)
def criar_item(item: ItemCreate, db: Session = Depends(get_db)):
    novo_item = Item(**item.model_dump())
    db.add(novo_item)
    db.commit()
    db.refresh(novo_item)
    return novo_item

@router.put("/{item_id}", response_model=ItemResponse)
def editar_item(item_id: int, dados: ItemUpdate, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")

    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(item, campo, valor)

    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def deletar_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")

    item.ativo = False
    db.commit()
    return {"message": f"Item `{item.nome}` desativado com sucesso!"}