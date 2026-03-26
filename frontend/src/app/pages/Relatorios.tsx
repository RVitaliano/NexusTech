import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Package, Wrench } from 'lucide-react';

const movementHistoryData = [
  { mes: 'Jan', entradas: 245, saidas: 198 },
  { mes: 'Fev', entradas: 312, saidas: 267 },
  { mes: 'Mar', entradas: 289, saidas: 234 },
];

const categoriesData = [
  { name: 'Produtos', value: 248, color: '#3B82F6' },
  { name: 'Serviços', value: 87, color: '#06B6D4' },
];

const topMovedProducts = [
  { produto: 'iPhone 15 Pro Max', entradas: 145, saidas: 132, saldo: 13 },
  { produto: 'MacBook Pro 16"', entradas: 89, saidas: 76, saldo: 13 },
  { produto: 'iPad Air', entradas: 112, saidas: 98, saldo: 14 },
  { produto: 'AirPods Pro', entradas: 187, saidas: 165, saldo: 22 },
  { produto: 'Apple Watch Series 9', entradas: 98, saidas: 87, saldo: 11 },
];

export function Relatorios() {
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
              <p className="text-2xl font-bold">846</p>
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
              <p className="text-2xl font-bold">699</p>
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
              <p className="text-2xl font-bold">+147</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Histórico de Movimentações (3 meses)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={movementHistoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="mes" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1D2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="entradas" stroke="#3B82F6" strokeWidth={2} name="Entradas" />
              <Line type="monotone" dataKey="saidas" stroke="#06B6D4" strokeWidth={2} name="Saídas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Distribuição: Produtos vs Serviços</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoriesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoriesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1D2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
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
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Produtos Mais Movimentados</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr className="text-left text-sm">
                <th className="p-4">Produto</th>
                <th className="p-4 text-right">Entradas</th>
                <th className="p-4 text-right">Saídas</th>
                <th className="p-4 text-right">Saldo</th>
                <th className="p-4">Tendência</th>
              </tr>
            </thead>
            <tbody>
              {topMovedProducts.map((product, index) => (
                <tr key={index} className="border-t border-border hover:bg-secondary/50 transition-colors">
                  <td className="p-4">{product.produto}</td>
                  <td className="p-4 text-right text-green-500">{product.entradas}</td>
                  <td className="p-4 text-right text-red-500">{product.saidas}</td>
                  <td className="p-4 text-right font-medium">{product.saldo > 0 ? '+' : ''}{product.saldo}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">Positivo</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
