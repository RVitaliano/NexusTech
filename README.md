# 🖥️ NexusTech — Sistema de Gerenciamento de Estoque

> Sistema web completo para gerenciamento de estoque de uma loja de tecnologia, desenvolvido com FastAPI no backend e React no frontend.

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

---

## 📋 Sobre o Projeto

O **NexusTech** é um sistema de gerenciamento de estoque desenvolvido para lojas de tecnologia. Permite o controle completo de produtos e serviços, movimentações de estoque, e geração de relatórios com gráficos em tempo real.

Projeto desenvolvido para portfólio, com foco em boas práticas de desenvolvimento, arquitetura limpa e separação entre frontend e backend.

---

## ✨ Funcionalidades

- 🔐 **Autenticação** — Registro e login com JWT + bcrypt
- 📦 **Produtos** — CRUD completo com filtros e paginação
- 🔧 **Serviços** — Gerenciamento separado de serviços da loja
- 📊 **Estoque** — Controle de entradas e saídas com histórico
- 📈 **Relatórios** — Dashboard com gráficos de movimentações, top produtos e distribuição de categorias
- ⚠️ **Alertas** — Notificações automáticas de estoque abaixo do mínimo

---

## 🏗️ Arquitetura

```
NexusTech/
├── backend/          # API REST (FastAPI + SQLite)
└── frontend/         # Interface web (React + Tailwind)
```

O frontend consome a API REST do backend via `axios`. Os dois serviços rodam separadamente em portas diferentes.

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Uso |
|---|---|
| **FastAPI** | Framework web para a API REST |
| **SQLAlchemy** | ORM para o banco de dados |
| **SQLite** | Banco de dados |
| **Pydantic** | Validação de dados |
| **JWT + bcrypt** | Autenticação segura |
| **Uvicorn** | Servidor ASGI |

### Frontend
| Tecnologia | Uso |
|---|---|
| **React 18** | Biblioteca de interface |
| **TypeScript** | Tipagem estática |
| **Tailwind CSS** | Estilização |
| **Recharts** | Gráficos |
| **Axios** | Requisições HTTP |
| **React Router** | Navegação entre páginas |
| **Vite** | Build e dev server |

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Python 3.11+
- Node.js 18+

### Backend

```bash
# Entre na pasta do backend
cd backend

# Crie e ative o ambiente virtual
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Crie o arquivo .env com base no exemplo
cp .env.example .env

# Rode o servidor
uvicorn app.main:app --reload
```

A API estará disponível em `http://localhost:8000`

Documentação automática em `http://localhost:8000/docs`

### Frontend

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

---

## 📡 Rotas da API

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/registro` | Criar novo usuário |
| `POST` | `/auth/login` | Autenticar e receber token JWT |

### Produtos & Serviços
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/produtos` | Listar todos os itens |
| `GET` | `/produtos/{id}` | Buscar item por ID |
| `POST` | `/produtos` | Criar novo item |
| `PUT` | `/produtos/{id}` | Editar item |
| `DELETE` | `/produtos/{id}` | Desativar item |

### Estoque
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/estoque` | Listar movimentações |
| `GET` | `/estoque/item/{id}` | Movimentações de um item |
| `POST` | `/estoque` | Registrar entrada ou saída |

### Relatórios
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/relatorios/dashboard` | Resumo geral do estoque |
| `GET` | `/relatorios/movimentacoes` | Histórico por dia |
| `GET` | `/relatorios/mais-movimentados` | Top 5 produtos |

---

## 📁 Estrutura do Backend

```
backend/
├── app/
│   ├── main.py          # Ponto de entrada da API
│   ├── database.py      # Conexão com o SQLite
│   ├── models.py        # Tabelas do banco (SQLAlchemy)
│   ├── schemas.py       # Validação de dados (Pydantic)
│   └── routes/
│       ├── auth.py      # Rotas de autenticação
│       ├── produtos.py  # Rotas de produtos/serviços
│       ├── estoque.py   # Rotas de movimentação
│       └── relatorios.py# Rotas de relatórios
├── .env.example
└── requirements.txt
```

## 📁 Estrutura do Frontend

```
frontend/
└── src/
    └── app/
        ├── pages/       # Login, Register, Dashboard, Produtos...
        ├── components/  # Componentes reutilizáveis
        ├── context/     # AuthContext (estado global)
        ├── services/    # api.ts (configuração do axios)
        └── routes.ts    # Definição de rotas
```

---

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/` com base no `.env.example`:

```env
SECRET_KEY=sua-chave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

