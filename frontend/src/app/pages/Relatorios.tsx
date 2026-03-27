import { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Package, Wrench } from 'lucide-react';
import api from '../services/api';

interface DashboardData {
  total_produtos: number;
  total_servicos: number;
  total_entradas: number;
  total_saidas: number;
}

interface TopProduto {
  nome: string;
  total_movimentado: number;
}

interface MovimentacaoDia {
  data: string;
  total: number;
}

export function Relatorios() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [topProdutos, setTopProdutos] = useState<TopProduto[]>([]);
  const [entradas, setEntradas] = useState<MovimentacaoDia[]>([]);
  const [saidas, setSaidas] = useState<MovimentacaoDia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const [dashRes, topRes, movRes] = await Promise.all([
          api.get('/relatorios/dashboard'),
          api.get('/relatorios/mais-movimentados'),
          api.get('/relatorios/movimentacoes'),
        ]);
        setDashboard(dashRes.data);
        setTopProdutos(topRes.data);
        setEntradas(movRes.data.entradas);
        setSaidas(movRes.data.saidas);
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
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

  // Combina entradas e saídas por data para o gráfico de linha
  const todasAsDatas = [...new Set([
    ...entradas.map(e => e.data),
    ...saidas.map(s => s.data),
  ])].sort();

  const movimentacoesHistorico = todasAsDatas.map(data => ({
    data,
    entradas: entradas.find(e => e.data === data)?.total ?? 0,
    saidas: saidas.find(s => s.data === data)?.total ?? 0,
  }));

  const categoriesData = [
    { name: 'Produtos', value: dashboard?.total_produtos ?? 0, color: '#3B82F6' },
    { name: 'Serviços', value: dashboard?.total_servicos ?? 0, color: '#06B6D4' },
  ];

  const saldo = (dashboard?.total_entradas ?? 0) - (dashboard?.total_saidas ?? 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">Análises e estatísticas do estoque</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Entradas</p>
              <p className="text-2xl font-bold">{dashboard?.total_entradas ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Saídas</p>
              <p className="text-2xl font-bold">{dashboard?.total_saidas ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo Total</p>
              <p className="text-2xl font-bold">{saldo > 0 ? '+' : ''}{saldo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Histórico de Movimentações por Dia</h2>
          {movimentacoesHistorico.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhuma movimentação registrada ainda.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={movimentacoesHistorico}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="data" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1A1D2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="entradas" stroke="#3B82F6" strokeWidth={2} name="Entradas" />
                <Line type="monotone" dataKey="saidas" stroke="#06B6D4" strokeWidth={2} name="Saídas" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Distribuição: Produtos vs Serviços</h2>
          {categoriesData.every(c => c.value === 0) ? (
            <p className="text-muted-foreground text-sm">Nenhum item cadastrado ainda.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoriesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {categoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1A1D2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-4">
                {categoriesData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Produtos Mais Movimentados</h2>
        {topProdutos.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhuma movimentação registrada ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr className="text-left text-sm">
                  <th className="p-4">Produto</th>
                  <th className="p-4 text-right">Total Movimentado</th>
                </tr>
              </thead>
              <tbody>
                {topProdutos.map((produto, index) => (
                  <tr key={index} className="border-t border-border hover:bg-secondary/50 transition-colors">
                    <td className="p-4">{produto.nome}</td>
                    <td className="p-4 text-right font-medium text-blue-500">
                      {produto.total_movimentado}
                    </td>
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