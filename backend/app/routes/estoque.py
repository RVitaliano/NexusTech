from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Item, MovimentacaoEstoque, TipoMovimentacao
from app.schemas import MovimentacaoCreate, MovimentacaoResponse

router = APIRouter()

@router.get("/", response_model=List[MovimentacaoResponse])
def listar_movimentacoes(db: Session = Depends(get_db)):
    return  db.query(MovimentacaoEstoque).order_by(
        MovimentacaoEstoque.criado_em.desc()
    ).all()

@router.get("/item/{item_id}", response_model=List[MovimentacaoResponse])
def movimentacoes_por_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    return db.query(MovimentacaoEstoque).filter(
        MovimentacaoEstoque.id == item.id
    ).order_by(
        MovimentacaoEstoque.criado_em.desc()
    ).all()

@router.post("/", response_model=MovimentacaoResponse, status_code=201)
def registrar_movimentacao(dados: MovimentacaoCreate, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == dados.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")

    if dados.tipo == TipoMovimentacao.SAIDA:
        if item.quantidade == dados.quantidade:
            raise HTTPException(
                status_code=400,
                detail=f"Estoque insuficiente. Disponível: {item.quantidade}"
            )
        item.quantidade -= dados.quantidade

    elif dados.tipo == TipoMovimentacao.ENTRADA:
        Item.quantidade += dados.quantidade

    movimentacao = MovimentacaoEstoque(**dados.model_dump())
    db.add(movimentacao)
    db.commit()
    db.refresh(movimentacao)
    return movimentacao