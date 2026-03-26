import { Package, Wrench, DollarSign, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '../components/Badge';

const statsData = [
  { icon: Package, label: 'Total de Produtos', value: '248', color: 'text-blue-500' },
  { icon: Wrench, label: 'Total de Serviços', value: '87', color: 'text-cyan-500' },
  { icon: DollarSign, label: 'Valor Total do Estoque', value: 'R$ 487.320', color: 'text-green-500' },
  { icon: AlertTriangle, label: 'Alertas de Estoque Baixo', value: '12', color: 'text-yellow-500' },
];

const movementData = [
  { date: '20/03', entradas: 45, saidas: 32 },
  { date: '21/03', entradas: 52, saidas: 41 },
  { date: '22/03', entradas: 38, saidas: 35 },
  { date: '23/03', entradas: 61, saidas: 48 },
  { date: '24/03', entradas: 55, saidas: 52 },
  { date: '25/03', entradas: 67, saidas: 45 },
  { date: '26/03', entradas: 58, saidas: 39 },
];

const topProductsData = [
  { name: 'iPhone 15 Pro', quantidade: 145 },
  { name: 'MacBook Air M3', quantidade: 128 },
  { name: 'AirPods Pro', quantidade: 112 },
  { name: 'iPad Air', quantidade: 98 },
  { name: 'Apple Watch', quantidade: 87 },
];

const recentMovements = [
  { id: 1, date: '26/03/2026 14:32', produto: 'iPhone 15 Pro Max', tipo: 'entrada', quantidade: 25 },
  { id: 2, date: '26/03/2026 13:15', produto: 'MacBook Pro 16"', tipo: 'saida', quantidade: 8 },
  { id: 3, date: '26/03/2026 11:48', produto: 'Magic Mouse', tipo: 'entrada', quantidade: 50 },
  { id: 4, date: '26/03/2026 10:22', produto: 'USB-C Cable', tipo: 'saida', quantidade: 15 },
  { id: 5, date: '25/03/2026 16:55', produto: 'AirTag 4-pack', tipo: 'entrada', quantidade: 30 },
];

const lowStockAlerts = [
  { id: 1, produto: 'Lightning Cable', estoque: 8, minimo: 20 },
  { id: 2, produto: 'MagSafe Charger', estoque: 12, minimo: 25 },
  { id: 3, produto: 'iPhone Case', estoque: 15, minimo: 30 },
  { id: 4, produto: 'Screen Protector', estoque: 18, minimo: 40 },
];

export function Dashboard() {
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
        {/* Line Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Entradas vs Saídas (7 dias)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={movementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1D2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="entradas" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="saidas" stroke="#06B6D4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Top 5 Produtos Mais Movimentados</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1D2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Bar dataKey="quantidade" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Movements */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Últimas Movimentações</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3">Data</th>
                  <th className="pb-3">Produto</th>
                  <th className="pb-3">Tipo</th>
                  <th className="pb-3 text-right">Qtd</th>
                </tr>
              </thead>
              <tbody>
                {recentMovements.map((movement) => (
                  <tr key={movement.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-muted-foreground">{movement.date}</td>
                    <td className="py-3 text-sm">{movement.produto}</td>
                    <td className="py-3">
                      <Badge variant={movement.tipo === 'entrada' ? 'success' : 'error'}>
                        {movement.tipo}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-right">{movement.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Alertas de Estoque Baixo</h2>
          <div className="space-y-3">
            {lowStockAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">{alert.produto}</p>
                    <p className="text-sm text-muted-foreground">
                      Estoque: {alert.estoque} / Mínimo: {alert.minimo}
                    </p>
                  </div>
                </div>
                <Badge variant="warning">Baixo</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
