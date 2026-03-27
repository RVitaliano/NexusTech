import { useState, useEffect } from 'react';
import { Plus, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import api from '../services/api';

interface Movement {
  id: number;
  criado_em: string;
  item_id: number;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  observacao: string | null;
  item_nome?: string;
}

interface Product {
  id: number;
  nome: string;
  quantidade: number;
}

export function Estoque() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [formData, setFormData] = useState({
    item_id: 0,
    tipo: 'entrada' as 'entrada' | 'saida',
    quantidade: 1,
    observacao: '',
  });

  // ── Carrega dados da API ──────────────────────────────────────
  async function carregarDados() {
    try {
      const [movRes, prodRes] = await Promise.all([
        api.get('/estoque'),
        api.get('/produtos'),
      ]);

      // Enriquece movimentações com o nome do produto
      const prods: Product[] = prodRes.data;
      const movs: Movement[] = movRes.data.map((m: Movement) => ({
        ...m,
        item_nome: prods.find(p => p.id === m.item_id)?.nome ?? `Item #${m.item_id}`,
      }));

      setMovements(movs);
      setProducts(prods);

      // Define produto inicial do formulário
      if (prods.length > 0) {
        setFormData(f => ({ ...f, item_id: prods[0].id }));
      }
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // ── Modal ─────────────────────────────────────────────────────
  const handleOpenModal = () => {
    setFormData({
      item_id: products[0]?.id ?? 0,
      tipo: 'entrada',
      quantidade: 1,
      observacao: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  // ── Registrar movimentação ────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/estoque', formData);
      await carregarDados();
      handleCloseModal();
    } catch (error: any) {
      const msg = error?.response?.data?.detail ?? 'Erro ao registrar movimentação';
      alert(msg);
    }
  };

  // ── Filtros ───────────────────────────────────────────────────
  const filteredMovements = movements.filter(m => {
    const matchSearch = m.item_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filterTipo === 'todos' || m.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  // ── Paginação ─────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovements = filteredMovements.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Estoque</h1>
          <p className="text-muted-foreground">Controle de movimentações</p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus className="w-5 h-5 mr-2" />
          Registrar Movimentação
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-input-background border border-border rounded px-10 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Select
            options={[
              { value: 'todos', label: 'Todos os tipos' },
              { value: 'entrada', label: 'Entradas' },
              { value: 'saida', label: 'Saídas' },
            ]}
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr className="text-left text-sm">
                <th className="p-4">Data</th>
                <th className="p-4">Produto</th>
                <th className="p-4">Tipo</th>
                <th className="p-4 text-right">Quantidade</th>
                <th className="p-4">Observação</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMovements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Nenhuma movimentação encontrada.
                  </td>
                </tr>
              ) : (
                paginatedMovements.map((movement) => (
                  <tr key={movement.id} className="border-t border-border hover:bg-secondary/50 transition-colors">
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(movement.criado_em).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-4">{movement.item_nome}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {movement.tipo === 'entrada' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <Badge variant={movement.tipo === 'entrada' ? 'success' : 'error'}>
                          {movement.tipo}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium">{movement.quantidade}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {movement.observacao ?? '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredMovements.length === 0 ? 0 : startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredMovements.length)} de {filteredMovements.length} movimentações
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}>
              Anterior
            </Button>
            <Button variant="secondary" size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}>
              Próxima
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Registrar Movimentação">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Produto"
            options={products.map(p => ({ value: String(p.id), label: `${p.nome} (estoque: ${p.quantidade})` }))}
            value={String(formData.item_id)}
            onChange={(e) => setFormData({ ...formData, item_id: parseInt(e.target.value) })}
          />
          <Select
            label="Tipo"
            options={[
              { value: 'entrada', label: 'Entrada' },
              { value: 'saida', label: 'Saída' },
            ]}
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'entrada' | 'saida' })}
          />
          <Input
            label="Quantidade"
            type="number"
            min="1"
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) })}
            required
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm">Observação</label>
            <textarea
              value={formData.observacao}
              onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
              className="bg-input-background border border-border rounded px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Motivo da movimentação..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">Registrar</Button>
            <Button type="button" variant="secondary" className="flex-1" onClick={handleCloseModal}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}