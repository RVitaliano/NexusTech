from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Item, MovimentacaoEstoque, TipoMovimentacao, CategoriaItem

router = APIRouter()

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    total_produtos = db.query(Item).filter(
        Item.categoria == CategoriaItem.PRODUTO,
        Item.ativo == True
    ).count()

    total_servicos = db.query(Item).filter(
        Item.categoria == CategoriaItem.SERVICO,
        Item.ativo == True
    ).count()

    estoque_baixo = db.query(Item).filter(
        Item.quantidade <=Item.quantidade_minima,
        Item.categoria == CategoriaItem.PRODUTO,
        Item.ativo == True
    ).all()

    valor_total = db.query(
        func.sum(Item.preco * Item.quantidade)
    ).filter(Item.ativo == True).scalar() or 0

    total_entradas = db.query(
        func.sum(MovimentacaoEstoque.quantidade)
    ).filter(MovimentacaoEstoque.tipo == TipoMovimentacao.ENTRADA).scalar() or 0

    total_saidas = db.query(
        func.sum(MovimentacaoEstoque.quantidade)
    ).filter(MovimentacaoEstoque.tipo == TipoMovimentacao.SAIDA).scalar() or 0

    return {
        "total_produtos": total_produtos,
        "total_servicos": total_servicos,
        "valor_total_estoque": round(valor_total, 2),
        "total_entradas": total_entradas,
        "total_saidas": total_saidas,
        "estoque_baixo": [
            {
                "id": item.id,
                "nome": item.nome,
                "quantidade": item.quantidade,
                "quantidade_minima": item.quantidade_minima
            }
            for item in estoque_baixo
        ]
    }

@router.get("/movimentacoes")
def relatorio_movimentacoes(db: Session = Depends(get_db)):
    entradas = db.query(
        func.date(MovimentacaoEstoque.criado_em).label("data"),
        func.sum(MovimentacaoEstoque.quantidade).label("total"),
    ).filter(
        MovimentacaoEstoque.tipo == TipoMovimentacao.ENTRADA
    ).group_by(
        func.date(MovimentacaoEstoque.criado_em)
    ).all()

    saidas = db.query(
        func.date(MovimentacaoEstoque.criado_em).label("data"),
        func.sum(MovimentacaoEstoque.quantidade).label("total"),
    ).filter(
        MovimentacaoEstoque.tipo == TipoMovimentacao.SAIDA
    ).group_by(
        func.date(MovimentacaoEstoque.criado_em)
    ).all()

    return {
        "entradas": [{"data": str(e.data), "total": e.total} for e in entradas],
        "saidas": [{"data": str(s.data), "total": s.total} for s in saidas]
    }

@router.get("/mais-movimentados")
def mais_movimentados(db: Session = Depends(get_db)):
    resultado = db.query(
        Item.nome,
        func.sum(MovimentacaoEstoque.quantidade).label("total_movimentado")
    ).join(
        MovimentacaoEstoque
    ).group_by(
        Item.id
    ).order_by(
        func.sum(MovimentacaoEstoque.quantidade).desc()
    ).limit(5).all()

    return [
        {"nome": r.nome, "total_movimentado": r.total_movimentado}
        for r in resultado
    ]