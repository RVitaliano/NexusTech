import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import api from '../services/api';

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  ativo: boolean;
  quantidade_minima: number;
}

export function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: 0,
    quantidade: 0,
    quantidade_minima: 0,
    categoria: 'servico',
  });

  // ── Carrega só serviços da API ────────────────────────────────
  async function carregarServicos() {
    try {
      const res = await api.get('/produtos');
      const soServicos = res.data.filter((i: any) => i.categoria === 'servico');
      setServicos(soServicos);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarServicos();
  }, []);

  // ── Modal ─────────────────────────────────────────────────────
  const handleOpenModal = (servico?: Servico) => {
    if (servico) {
      setEditingServico(servico);
      setFormData({
        nome: servico.nome,
        descricao: servico.descricao,
        preco: servico.preco,
        quantidade: 0,
        quantidade_minima: servico.quantidade_minima,
        categoria: 'servico',
      });
    } else {
      setEditingServico(null);
      setFormData({
        nome: '',
        descricao: '',
        preco: 0,
        quantidade: 0,
        quantidade_minima: 0,
        categoria: 'servico',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingServico(null);
  };

  // ── Criar ou editar ───────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingServico) {
        await api.put(`/produtos/${editingServico.id}`, formData);
      } else {
        await api.post('/produtos', formData);
      }
      await carregarServicos();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
    }
  };

  // ── Deletar ───────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente excluir este serviço?')) {
      try {
        await api.delete(`/produtos/${id}`);
        await carregarServicos();
      } catch (error) {
        console.error('Erro ao deletar serviço:', error);
      }
    }
  };

  // ── Filtro e paginação ────────────────────────────────────────
  const filtered = servicos.filter(s =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

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
          <h1 className="text-3xl font-bold">Serviços</h1>
          <p className="text-muted-foreground">Gerencie os serviços da loja</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-5 h-5 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {/* Filtro */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-input-background border border-border rounded px-10 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr className="text-left text-sm">
                <th className="p-4">Nome</th>
                <th className="p-4">Descrição</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Nenhum serviço encontrado.
                  </td>
                </tr>
              ) : (
                paginated.map((servico) => (
                  <tr key={servico.id} className="border-t border-border hover:bg-secondary/50 transition-colors">
                    <td className="p-4 font-medium">{servico.nome}</td>
                    <td className="p-4 text-sm text-muted-foreground">{servico.descricao ?? '—'}</td>
                    <td className="p-4">R$ {servico.preco.toFixed(2)}</td>
                    <td className="p-4">
                      <Badge variant={servico.ativo ? 'success' : 'error'}>
                        {servico.ativo ? 'ativo' : 'inativo'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(servico)}
                          className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(servico.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filtered.length === 0 ? 0 : startIndex + 1} a {Math.min(startIndex + itemsPerPage, filtered.length)} de {filtered.length} serviços
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
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}
        title={editingServico ? 'Editar Serviço' : 'Novo Serviço'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome" value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
          <div className="flex flex-col gap-2">
            <label className="text-sm">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="bg-input-background border border-border rounded px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>
          <Input label="Preço (R$)" type="number" step="0.01" value={formData.preco}
            onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })} required />
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingServico ? 'Salvar' : 'Criar'}
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