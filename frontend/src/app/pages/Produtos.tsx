import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Select } from '../components/Select';

interface Product {
  id: number;
  nome: string;
  categoria: 'produto' | 'servico';
  preco: number;
  quantidade: number;
  status: 'ativo' | 'inativo';
  descricao: string;
  quantidadeMinima: number;
}

const initialProducts: Product[] = [
  { id: 1, nome: 'iPhone 15 Pro Max', categoria: 'produto', preco: 7999, quantidade: 45, status: 'ativo', descricao: 'Smartphone Apple', quantidadeMinima: 10 },
  { id: 2, nome: 'MacBook Pro 16"', categoria: 'produto', preco: 15999, quantidade: 23, status: 'ativo', descricao: 'Notebook profissional', quantidadeMinima: 5 },
  { id: 3, nome: 'Instalação de Software', categoria: 'servico', preco: 150, quantidade: 0, status: 'ativo', descricao: 'Serviço de instalação', quantidadeMinima: 0 },
  { id: 4, nome: 'iPad Air', categoria: 'produto', preco: 4999, quantidade: 18, status: 'ativo', descricao: 'Tablet Apple', quantidadeMinima: 8 },
  { id: 5, nome: 'Manutenção de Notebook', categoria: 'servico', preco: 200, quantidade: 0, status: 'ativo', descricao: 'Serviço de manutenção', quantidadeMinima: 0 },
  { id: 6, nome: 'AirPods Pro', categoria: 'produto', preco: 2499, quantidade: 62, status: 'ativo', descricao: 'Fones sem fio', quantidadeMinima: 20 },
  { id: 7, nome: 'Magic Mouse', categoria: 'produto', preco: 899, quantidade: 8, status: 'inativo', descricao: 'Mouse Apple', quantidadeMinima: 15 },
  { id: 8, nome: 'Consultoria Técnica', categoria: 'servico', preco: 300, quantidade: 0, status: 'ativo', descricao: 'Consultoria especializada', quantidadeMinima: 0 },
];

export function Produtos() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todas');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: 'produto' as 'produto' | 'servico',
    preco: 0,
    quantidade: 0,
    quantidadeMinima: 0,
    status: 'ativo' as 'ativo' | 'inativo',
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nome: product.nome,
        descricao: product.descricao,
        categoria: product.categoria,
        preco: product.preco,
        quantidade: product.quantidade,
        quantidadeMinima: product.quantidadeMinima,
        status: product.status,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nome: '',
        descricao: '',
        categoria: 'produto',
        preco: 0,
        quantidade: 0,
        quantidadeMinima: 0,
        status: 'ativo',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...formData, id: p.id } : p));
    } else {
      setProducts([...products, { ...formData, id: Date.now() }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente excluir este item?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Filtros
  const filteredProducts = products.filter(product => {
    const matchSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = filterCategoria === 'todas' || product.categoria === filterCategoria;
    const matchStatus = filterStatus === 'todos' || product.status === filterStatus;
    return matchSearch && matchCategoria && matchStatus;
  });

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Produtos & Serviços</h1>
          <p className="text-muted-foreground">Gerencie produtos e serviços</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-5 h-5 mr-2" />
          Novo Item
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-input-background border border-border rounded px-10 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Select
            options={[
              { value: 'todas', label: 'Todas categorias' },
              { value: 'produto', label: 'Produtos' },
              { value: 'servico', label: 'Serviços' },
            ]}
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
          />
          <Select
            options={[
              { value: 'todos', label: 'Todos status' },
              { value: 'ativo', label: 'Ativos' },
              { value: 'inativo', label: 'Inativos' },
            ]}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr className="text-left text-sm">
                <th className="p-4">Nome</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Quantidade</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="border-t border-border hover:bg-secondary/50 transition-colors">
                  <td className="p-4">{product.nome}</td>
                  <td className="p-4">
                    <Badge variant={product.categoria === 'produto' ? 'info' : 'success'}>
                      {product.categoria}
                    </Badge>
                  </td>
                  <td className="p-4">R$ {product.preco.toFixed(2)}</td>
                  <td className="p-4">{product.quantidade}</td>
                  <td className="p-4">
                    <Badge variant={product.status === 'ativo' ? 'success' : 'error'}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredProducts.length)} de {filteredProducts.length} itens
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Editar Item' : 'Novo Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="bg-input-background border border-border rounded px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              required
            />
          </div>
          <Select
            label="Categoria"
            options={[
              { value: 'produto', label: 'Produto' },
              { value: 'servico', label: 'Serviço' },
            ]}
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value as 'produto' | 'servico' })}
          />
          <Input
            label="Preço (R$)"
            type="number"
            step="0.01"
            value={formData.preco}
            onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
            required
          />
          <Input
            label="Quantidade Inicial"
            type="number"
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) })}
            required
          />
          <Input
            label="Quantidade Mínima"
            type="number"
            value={formData.quantidadeMinima}
            onChange={(e) => setFormData({ ...formData, quantidadeMinima: parseInt(e.target.value) })}
            required
          />
          <Select
            label="Status"
            options={[
              { value: 'ativo', label: 'Ativo' },
              { value: 'inativo', label: 'Inativo' },
            ]}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ativo' | 'inativo' })}
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingProduct ? 'Salvar' : 'Criar'}
            </Button>
            <Button type="button" variant="secondary" className="flex-1" onClick={handleCloseModal}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
