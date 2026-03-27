import { useEffect, useState } from 'react';
import { Package, Wrench, DollarSign, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '../components/Badge';
import api from '../services/api';

interface DashboardData {
  total_produtos: number;
  total_servicos: number;
  valor_total_estoque: number;
  total_entradas: number;
  total_saidas: number;
  estoque_baixo: { id: number; nome: string; quantidade: number; quantidade_minima: number }[];
}

interface Movimentacao {
  id: number;
  criado_em: string;
  item_id: number;
  tipo: string;
  quantidade: number;
  observacao: string | null;
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const [dashRes, movRes] = await Promise.all([
          api.get('/relatorios/dashboard'),
          api.get('/estoque'),
        ]);
        setData(dashRes.data);
        setMovimentacoes(movRes.data.slice(0, 5)); // últimas 5
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  const statsData = [
    { icon: Package, label: 'Total de Produtos', value: data?.total_produtos ?? 0, color: 'text-blue-500' },
    { icon: Wrench, label: 'Total de Serviços', value: data?.total_servicos ?? 0, color: 'text-cyan-500' },
    { icon: DollarSign, label: 'Valor Total do Estoque', value: `R$ ${data?.valor_total_estoque.toFixed(2) ?? '0'}`, color: 'text-green-500' },
    { icon: AlertTriangle, label: 'Alertas de Estoque Baixo', value: data?.estoque_baixo.length ?? 0, color: 'text-yellow-500' },
  ];

  const movementData = [
    { date: 'Entradas', total: data?.total_entradas ?? 0 },
    { date: 'Saídas', total: data?.total_saidas ?? 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema de estoque</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Entradas vs Saídas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={movementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1A1D2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Bar dataKey="total" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Estoque Baixo */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Alertas de Estoque Baixo</h2>
          {data?.estoque_baixo.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum alerta no momento ✅</p>
          ) : (
            <div className="space-y-3">
              {data?.estoque_baixo.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">{alert.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        Estoque: {alert.quantidade} / Mínimo: {alert.quantidade_minima}
                      </p>
                    </div>
                  </div>
                  <Badge variant="warning">Baixo</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Últimas Movimentações */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Últimas Movimentações</h2>
        {movimentacoes.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhuma movimentação registrada ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3">Data</th>
                  <th className="pb-3">Item ID</th>
                  <th className="pb-3">Tipo</th>
                  <th className="pb-3 text-right">Qtd</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes.map((mov) => (
                  <tr key={mov.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-muted-foreground">
                      {new Date(mov.criado_em).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 text-sm">Item #{mov.item_id}</td>
                    <td className="py-3">
                      <Badge variant={mov.tipo === 'entrada' ? 'success' : 'error'}>
                        {mov.tipo}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-right">{mov.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}