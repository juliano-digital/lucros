import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, ShoppingBag, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Sales() {
  const { recipes, sales, addSale, deleteSale, getRecipeCost } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    recipeId: '',
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
  });

  const resetForm = () => {
    setForm({ recipeId: '', quantity: 1, date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipe = recipes.find((r) => r.id === form.recipeId);
    if (!recipe) return;

    const totalRevenue = recipe.sellingPrice * form.quantity;
    const costPerRecipe = getRecipeCost(recipe);
    const totalCost = costPerRecipe * form.quantity;
    const profit = totalRevenue - totalCost;

    addSale({
      recipeId: form.recipeId,
      quantity: form.quantity,
      date: form.date,
      totalRevenue,
      totalCost,
      profit,
    });
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      deleteSale(id);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const getRecipeName = (id: string) => {
    const recipe = recipes.find((r) => r.id === id);
    return recipe ? recipe.name : 'Produto removido';
  };

  const totalRevenue = sales.reduce((acc, s) => acc + s.totalRevenue, 0);
  const totalCost = sales.reduce((acc, s) => acc + s.totalCost, 0);
  const totalProfit = sales.reduce((acc, s) => acc + s.profit, 0);

  const sortedSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Registro de Vendas</h2>
          <p className="text-gray-500 text-sm mt-1">Registre suas vendas e acompanhe o faturamento</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-orange-200 transition-colors"
          disabled={recipes.length === 0}
        >
          <Plus className="w-5 h-5" />
          Registrar Venda
        </motion.button>
      </div>

      {/* Summary Cards */}
      {sales.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <p className="text-sm text-gray-500">Faturamento Total</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(totalRevenue)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <p className="text-sm text-gray-500">Custo Total</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalCost)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <p className="text-sm text-gray-500">Lucro Total</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalProfit)}</p>
          </motion.div>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Registrar Venda</h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                  <select
                    required
                    value={form.recipeId}
                    onChange={(e) => setForm({ ...form, recipeId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
                  >
                    <option value="">Selecione o produto vendido</option>
                    {recipes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} - {formatCurrency(r.sellingPrice)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
                    />
                  </div>
                </div>

                {form.recipeId && (
                  <div className="bg-orange-50 rounded-xl p-4 space-y-2">
                    {(() => {
                      const recipe = recipes.find((r) => r.id === form.recipeId);
                      if (!recipe) return null;
                      const revenue = recipe.sellingPrice * form.quantity;
                      const cost = getRecipeCost(recipe) * form.quantity;
                      return (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Receita:</span>
                            <span className="font-medium text-green-700">{formatCurrency(revenue)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Custo:</span>
                            <span className="font-medium text-red-600">{formatCurrency(cost)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold border-t border-orange-200 pt-2">
                            <span className="text-gray-800">Lucro:</span>
                            <span className="text-orange-600">{formatCurrency(revenue - cost)}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-lg shadow-orange-200 transition-colors"
                  >
                    Registrar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sales List */}
      {sortedSales.length > 0 ? (
        <div className="space-y-3">
          {sortedSales.map((sale, index) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{getRecipeName(sale.recipeId)}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(sale.date)}</span>
                      <span>•</span>
                      <span>{sale.quantity} un.</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Receita</p>
                    <p className="font-bold text-gray-800">{formatCurrency(sale.totalRevenue)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Lucro</p>
                    <p className={`font-bold ${sale.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(sale.profit)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(sale.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl border border-gray-100"
        >
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500">Nenhuma venda registrada</h3>
          <p className="text-gray-400 mt-2">
            {recipes.length === 0
              ? 'Cadastre receitas primeiro para registrar vendas.'
              : 'Clique em "Registrar Venda" para começar.'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
