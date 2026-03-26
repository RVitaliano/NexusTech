import { useState } from 'react';
import { Plus, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Select } from '../components/Select';

interface Movement {
  id: number;
  data: string;
  produto: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  observacao: string;
}

const initialMovements: Movement[] = [
  { id: 1, data: '26/03/2026 14:32', produto: 'iPhone 15 Pro Max', tipo: 'entrada', quantidade: 25, observacao: 'Reabastecimento mensal' },
  { id: 2, data: '26/03/2026 13:15', produto: 'MacBook Pro 16"', tipo: 'saida', quantidade: 8, observacao: 'Venda para cliente corporativo' },
  { id: 3, data: '26/03/2026 11:48', produto: 'Magic Mouse', tipo: 'entrada', quantidade: 50, observacao: 'Nova remessa fornecedor' },
  { id: 4, data: '26/03/2026 10:22', produto: 'USB-C Cable', tipo: 'saida', quantidade: 15, observacao: 'Venda avulsa' },
  { id: 5, data: '25/03/2026 16:55', produto: 'AirTag 4-pack', tipo: 'entrada', quantidade: 30, observacao: 'Reposição estoque' },
  { id: 6, data: '25/03/2026 15:30', produto: 'iPad Air', tipo: 'saida', quantidade: 12, observacao: 'Pedido loja parceira' },
  { id: 7, data: '25/03/2026 14:12', produto: 'AirPods Pro', tipo: 'entrada', quantidade: 40, observacao: 'Estoque inicial' },
  { id: 8, data: '25/03/2026 10:05', produto: 'Apple Watch Series 9', tipo: 'saida', quantidade: 6, observacao: 'Venda presencial' },
];

const products = [
  'iPhone 15 Pro Max',
  'MacBook Pro 16"',
  'iPad Air',
  'AirPods Pro',
  'Apple Watch Series 9',
  'Magic Mouse',
  'Magic Keyboard',
  'USB-C Cable',
  'AirTag 4-pack',
];

export function Estoque() {
  const [movements, setMovements] = useState<Movement[]>(initialMovements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [formData, setFormData] = useState({
    produto: products[0],
    tipo: 'entrada' as 'entrada' | 'saida',
    quantidade: 0,
    observacao: '',
  });

  const handleOpenModal = () => {
    setFormData({
      produto: products[0],
      tipo: 'entrada',
      quantidade: 0,
      observacao: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setMovements([
      { ...formData, id: Date.now(), data: formattedDate },
      ...movements,
    ]);
    handleCloseModal();
  };

  // Filtros
  const filteredMovements = movements.filter(movement => {
    const matchSearch = movement.produto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filterTipo === 'todos' || movement.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  // Paginação
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovements = filteredMovements.slice(startIndex, startIndex + itemsPerPage);

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
              {paginatedMovements.map((movement) => (
                <tr key={movement.id} className="border-t border-border hover:bg-secondary/50 transition-colors">
                  <td className="p-4 text-sm text-muted-foreground">{movement.data}</td>
                  <td className="p-4">{movement.produto}</td>
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
                  <td className="p-4 text-sm text-muted-foreground">{movement.observacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredMovements.length)} de {filteredMovements.length} movimentações
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
        title="Registrar Movimentação"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Produto"
            options={products.map(p => ({ value: p, label: p }))}
            value={formData.produto}
            onChange={(e) => setFormData({ ...formData, produto: e.target.value })}
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
              className="bg-input-background border border-border rounded px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Motivo da movimentação..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Registrar
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
