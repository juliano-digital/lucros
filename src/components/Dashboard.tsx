import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Cake,
  Target,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useStore } from '../store/useStore';

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#ea580c'];

export default function Dashboard() {
  const { recipes, sales, getRecipeCost, getRecipeProfit, getRecipeProfitMargin } = useStore();

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((acc, s) => acc + s.totalRevenue, 0);
    const totalCost = sales.reduce((acc, s) => acc + s.totalCost, 0);
    const totalProfit = sales.reduce((acc, s) => acc + s.profit, 0);
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return { totalRevenue, totalCost, totalProfit, profitMargin };
  }, [sales]);

  const recipeAnalysis = useMemo(() => {
    return recipes.map((recipe) => {
      const cost = getRecipeCost(recipe);
      const profit = getRecipeProfit(recipe);
      const margin = getRecipeProfitMargin(recipe);
      const costPerUnit = recipe.yields > 0 ? cost / recipe.yields : cost;
      const pricePerUnit = recipe.yields > 0 ? recipe.sellingPrice / recipe.yields : recipe.sellingPrice;

      return {
        name: recipe.name,
        cost: Math.round(cost * 100) / 100,
        revenue: recipe.sellingPrice,
        profit: Math.round(profit * 100) / 100,
        margin: Math.round(margin * 100) / 100,
        costPerUnit: Math.round(costPerUnit * 100) / 100,
        pricePerUnit: Math.round(pricePerUnit * 100) / 100,
        profitPerUnit: Math.round((pricePerUnit - costPerUnit) * 100) / 100,
      };
    });
  }, [recipes, getRecipeCost, getRecipeProfit, getRecipeProfitMargin]);

  const pieData = useMemo(() => {
    return recipes.map((recipe) => ({
      name: recipe.name,
      value: getRecipeCost(recipe),
    }));
  }, [recipes, getRecipeCost]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Receita Total</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-orange-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Custo Total</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalCost)}</p>
            </div>
            <TrendingDown className="w-10 h-10 text-red-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Lucro Total</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalProfit)}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Margem de Lucro</p>
              <p className="text-2xl font-bold mt-1">{stats.profitMargin.toFixed(1)}%</p>
            </div>
            <Target className="w-10 h-10 text-purple-200" />
          </div>
        </motion.div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Insumos Cadastrados</p>
              <p className="text-2xl font-bold text-gray-800">{useStore.getState().ingredients.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Cake className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Receitas Cadastradas</p>
              <p className="text-2xl font-bold text-gray-800">{recipes.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Vendas Registradas</p>
              <p className="text-2xl font-bold text-gray-800">{sales.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      {recipeAnalysis.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Custo vs Receita por Produto</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recipeAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="cost" fill="#ef4444" name="Custo" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#f97316" name="Receita" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição de Custos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {pieData.map((entry, index) => (
                <span key={entry.name} className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Recipe Analysis Table */}
      {recipeAnalysis.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Análise de Lucratividade por Produto</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Produto</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Custo/Un</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Preço/Un</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Lucro/Un</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Margem</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recipeAnalysis.map((recipe) => (
                  <tr key={recipe.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-800">{recipe.name}</td>
                    <td className="py-3 px-4 text-right text-red-600">{formatCurrency(recipe.costPerUnit)}</td>
                    <td className="py-3 px-4 text-right text-gray-800">{formatCurrency(recipe.pricePerUnit)}</td>
                    <td className="py-3 px-4 text-right text-green-600 font-medium">{formatCurrency(recipe.profitPerUnit)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        recipe.margin >= 30 ? 'bg-green-100 text-green-700' :
                        recipe.margin >= 15 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {recipe.margin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {recipe.margin >= 30 ? (
                        <span className="text-green-600">🟢 Excelente</span>
                      ) : recipe.margin >= 15 ? (
                        <span className="text-yellow-600">🟡 Bom</span>
                      ) : (
                        <span className="text-red-600">🔴 Revisar</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {recipes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Cake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500">Nenhuma receita cadastrada</h3>
          <p className="text-gray-400 mt-2">Comece cadastrando seus insumos e receitas para ver as análises aqui.</p>
        </motion.div>
      )}
    </div>
  );
}
