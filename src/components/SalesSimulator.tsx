import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Calculator } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useStore } from '../store/useStore';

export default function SalesSimulator() {
  const { recipes, getRecipeCostPerUnit, getRecipeProfitMargin } = useStore();
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [monthlyFixedCosts, setMonthlyFixedCosts] = useState(0);
  const [desiredProfit, setDesiredProfit] = useState(0);

  const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId);

  const analysis = useMemo(() => {
    if (!selectedRecipe) return null;

    const costPerUnit = getRecipeCostPerUnit(selectedRecipe);
    const pricePerUnit = selectedRecipe.yields > 0
      ? selectedRecipe.sellingPrice / selectedRecipe.yields
      : selectedRecipe.sellingPrice;
    const contributionMargin = pricePerUnit - costPerUnit;
    const margin = getRecipeProfitMargin(selectedRecipe);

    // Break-even point
    const breakEvenUnits = contributionMargin > 0
      ? Math.ceil(monthlyFixedCosts / contributionMargin)
      : Infinity;

    const breakEvenRevenue = breakEvenUnits * pricePerUnit;

    // Units needed for desired profit
    const unitsForProfit = contributionMargin > 0
      ? Math.ceil((monthlyFixedCosts + desiredProfit) / contributionMargin)
      : Infinity;

    // Chart data
    const chartData = [];
    const maxUnits = Math.max(breakEvenUnits * 2, unitsForProfit * 1.5, 20);
    for (let i = 0; i <= maxUnits; i += Math.max(1, Math.floor(maxUnits / 20))) {
      const revenue = i * pricePerUnit;
      const totalCost = monthlyFixedCosts + (i * costPerUnit);
      const profit = revenue - totalCost;
      chartData.push({
        units: i,
        revenue: Math.round(revenue * 100) / 100,
        cost: Math.round(totalCost * 100) / 100,
        profit: Math.round(profit * 100) / 100,
      });
    }

    return {
      costPerUnit,
      pricePerUnit,
      contributionMargin,
      margin,
      breakEvenUnits,
      breakEvenRevenue,
      unitsForProfit,
      chartData,
    };
  }, [selectedRecipe, monthlyFixedCosts, desiredProfit, getRecipeCostPerUnit, getRecipeProfitMargin]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Simulador de Vendas</h2>
        <p className="text-gray-500 text-sm mt-1">
          Calcule o ponto de equilíbrio e simule quantos bolos precisa vender para atingir suas metas
        </p>
      </div>

      {/* Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-orange-500" />
          Configuração da Simulação
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
            <select
              value={selectedRecipeId}
              onChange={(e) => setSelectedRecipeId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
            >
              <option value="">Selecione um produto</option>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custos Fixos Mensais (R$)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={monthlyFixedCosts || ''}
              onChange={(e) => setMonthlyFixedCosts(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
              placeholder="Ex: 2000.00"
            />
            <p className="text-xs text-gray-400 mt-1">Aluguel, luz, gás, transporte, etc.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lucro Desejado (R$)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={desiredProfit || ''}
              onChange={(e) => setDesiredProfit(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
              placeholder="Ex: 3000.00"
            />
            <p className="text-xs text-gray-400 mt-1">Quanto deseja lucrar por mês</p>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      {analysis && selectedRecipe && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white"
            >
              <p className="text-blue-100 text-sm">Custo por Unidade</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(analysis.costPerUnit)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white"
            >
              <p className="text-green-100 text-sm">Margem de Contribuição</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(analysis.contributionMargin)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white"
            >
              <p className="text-orange-100 text-sm">Ponto de Equilíbrio</p>
              <p className="text-2xl font-bold mt-1">
                {analysis.breakEvenUnits === Infinity ? '∞' : `${analysis.breakEvenUnits} un.`}
              </p>
              <p className="text-orange-200 text-xs mt-1">
                {analysis.breakEvenRevenue !== Infinity ? formatCurrency(analysis.breakEvenRevenue) : 'Impossível'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white"
            >
              <p className="text-purple-100 text-sm">Unidades p/ Meta</p>
              <p className="text-2xl font-bold mt-1">
                {analysis.unitsForProfit === Infinity ? '∞' : `${analysis.unitsForProfit} un.`}
              </p>
              <p className="text-purple-200 text-xs mt-1">para lucrar {formatCurrency(desiredProfit)}</p>
            </motion.div>
          </div>

          {/* Break-even Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              Gráfico do Ponto de Equilíbrio
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={analysis.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="units"
                  label={{ value: 'Unidades Vendidas', position: 'bottom', offset: -5 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${v}`} />
                <Tooltip
                  formatter={(value: number, name: string) => [formatCurrency(value), name]}
                  labelFormatter={(label) => `${label} unidades`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="Receita" dot={false} />
                <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} name="Custo Total" dot={false} />
                <Line type="monotone" dataKey="profit" stroke="#f97316" strokeWidth={2} name="Lucro" dot={false} />
                {analysis.breakEvenUnits !== Infinity && (
                  <ReferenceLine
                    x={analysis.breakEvenUnits}
                    stroke="#6b7280"
                    strokeDasharray="5 5"
                    label={{ value: 'Ponto de Equilíbrio', position: 'top', fill: '#6b7280', fontSize: 12 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Recomendações
            </h3>

            <div className="space-y-3">
              {analysis.margin >= 30 && (
                <div className="flex items-start gap-3 bg-green-50 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Margem de lucro saudável!</p>
                    <p className="text-sm text-green-600">
                      Sua margem de {analysis.margin.toFixed(1)}% está acima de 30%. Continue assim!
                    </p>
                  </div>
                </div>
              )}

              {analysis.margin < 15 && analysis.margin > 0 && (
                <div className="flex items-start gap-3 bg-red-50 rounded-xl p-4">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Margem de lucro muito baixa!</p>
                    <p className="text-sm text-red-600">
                      Com apenas {analysis.margin.toFixed(1)}% de margem, considere aumentar o preço de venda
                      ou reduzir custos de produção.
                    </p>
                  </div>
                </div>
              )}

              {analysis.contributionMargin <= 0 && (
                <div className="flex items-start gap-3 bg-red-50 rounded-xl p-4">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Preço abaixo do custo!</p>
                    <p className="text-sm text-red-600">
                      Você está vendendo abaixo do custo de produção. Aumente urgentemente o preço de venda.
                    </p>
                  </div>
                </div>
              )}

              {analysis.breakEvenUnits !== Infinity && analysis.breakEvenUnits > 0 && (
                <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
                  <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Ponto de equilíbrio</p>
                    <p className="text-sm text-blue-600">
                      Você precisa vender pelo menos <strong>{analysis.breakEvenUnits} unidades</strong> por mês
                      para cobrir os custos fixos de {formatCurrency(monthlyFixedCosts)}.
                      Isso representa {formatCurrency(analysis.breakEvenRevenue)} em vendas.
                    </p>
                  </div>
                </div>
              )}

              {analysis.unitsForProfit !== Infinity && desiredProfit > 0 && (
                <div className="flex items-start gap-3 bg-purple-50 rounded-xl p-4">
                  <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-800">Meta de lucro</p>
                    <p className="text-sm text-purple-600">
                      Para lucrar {formatCurrency(desiredProfit)} por mês, você precisa vender
                      <strong> {analysis.unitsForProfit} unidades</strong> deste produto.
                      Isso equivale a aproximadamente{' '}
                      <strong>{Math.ceil(analysis.unitsForProfit / 30)} unidades por dia</strong>.
                    </p>
                  </div>
                </div>
              )}

              {analysis.breakEvenUnits !== Infinity && analysis.breakEvenUnits > 100 && (
                <div className="flex items-start gap-3 bg-yellow-50 rounded-xl p-4">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Volume de vendas elevado</p>
                    <p className="text-sm text-yellow-600">
                      O ponto de equilíbrio requer muitas unidades. Considere reduzir custos fixos
                      ou aumentar significativamente o preço para tornar o negócio mais viável.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}

      {!selectedRecipe && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl border border-gray-100"
        >
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500">Selecione um produto</h3>
          <p className="text-gray-400 mt-2">
            Escolha um produto acima para simular vendas e calcular o ponto de equilíbrio.
          </p>
        </motion.div>
      )}

      {recipes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl border border-gray-100"
        >
          <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500">Nenhuma receita disponível</h3>
          <p className="text-gray-400 mt-2">
            Cadastre insumos e receitas primeiro para usar o simulador.
          </p>
        </motion.div>
      )}
    </div>
  );
}
