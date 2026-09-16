import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Cake, Search, Calculator } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Recipe, RecipeIngredient } from '../types';

export default function Recipes() {
  const {
    recipes,
    ingredients,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeCost,
    getRecipeCostPerUnit,
    getRecipeProfit,
    getRecipeProfitMargin,
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<Recipe, 'id'>>({
    name: '',
    description: '',
    category: '',
    yields: 1,
    yieldUnit: 'unidades',
    ingredients: [],
    laborCost: 0,
    overheadCost: 0,
    sellingPrice: 0,
  });

  const [newIngredient, setNewIngredient] = useState<RecipeIngredient>({
    ingredientId: '',
    quantity: 0,
  });

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      category: '',
      yields: 1,
      yieldUnit: 'unidades',
      ingredients: [],
      laborCost: 0,
      overheadCost: 0,
      sellingPrice: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateRecipe(editingId, form);
    } else {
      addRecipe(form);
    }
    resetForm();
  };

  const handleEdit = (recipe: Recipe) => {
    setForm({
      name: recipe.name,
      description: recipe.description,
      category: recipe.category,
      yields: recipe.yields,
      yieldUnit: recipe.yieldUnit,
      ingredients: [...recipe.ingredients],
      laborCost: recipe.laborCost,
      overheadCost: recipe.overheadCost,
      sellingPrice: recipe.sellingPrice,
    });
    setEditingId(recipe.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
      deleteRecipe(id);
    }
  };

  const addIngredientToRecipe = () => {
    if (newIngredient.ingredientId && newIngredient.quantity > 0) {
      setForm({
        ...form,
        ingredients: [...form.ingredients, { ...newIngredient }],
      });
      setNewIngredient({ ingredientId: '', quantity: 0 });
    }
  };

  const removeIngredientFromRecipe = (index: number) => {
    setForm({
      ...form,
      ingredients: form.ingredients.filter((_, i) => i !== index),
    });
  };

  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getIngredientName = (id: string) => {
    const ing = ingredients.find((i) => i.id === id);
    return ing ? ing.name : 'Insumo removido';
  };

  const getIngredientUnit = (id: string) => {
    const ing = ingredients.find((i) => i.id === id);
    return ing ? ing.unit : '';
  };

  const detailRecipe = showDetail ? recipes.find((r) => r.id === showDetail) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Receitas</h2>
          <p className="text-gray-500 text-sm mt-1">Cadastre suas receitas e calcule custos automaticamente</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-orange-200 transition-colors"
          disabled={ingredients.length === 0}
        >
          <Plus className="w-5 h-5" />
          Nova Receita
        </motion.button>
      </div>

      {ingredients.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-yellow-700 text-sm">
            ⚠️ Você precisa cadastrar pelo menos um insumo antes de criar receitas.
          </p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar receita..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
        />
      </div>

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
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingId ? 'Editar Receita' : 'Nova Receita'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
                    placeholder="Ex: Bolo de Chocolate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none resize-none"
                    rows={2}
                    placeholder="Descrição breve do produto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
                      placeholder="Ex: Bolos tradicionais"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rendimento</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        value={form.yields || ''}
                        onChange={(e) => setForm({ ...form, yields: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Rendimento</label>
                  <input
                    type="text"
                    value={form.yieldUnit}
                    onChange={(e) => setForm({ ...form, yieldUnit: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
                    placeholder="Ex: bolos, fatias, unidades"
                  />
                </div>

                {/* Ingredients Section */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Ingredientes da Receita</h4>

                  {form.ingredients.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {form.ingredients.map((ri, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-sm text-gray-700">
                            {getIngredientName(ri.ingredientId)} - <strong>{ri.quantity} {getIngredientUnit(ri.ingredientId)}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeIngredientFromRecipe(index)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <select
                      value={newIngredient.ingredientId}
                      onChange={(e) => setNewIngredient({ ...newIngredient, ingredientId: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-400 outline-none"
                    >
                      <option value="">Selecione um insumo</option>
                      {ingredients.map((ing) => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name} ({ing.unit})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={newIngredient.quantity || ''}
                      onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) || 0 })}
                      className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-orange-400 outline-none"
                      placeholder="Qtd"
                    />
                    <button
                      type="button"
                      onClick={addIngredientToRecipe}
                      className="px-3 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Costs */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mão de Obra (R$)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.laborCost || ''}
                      onChange={(e) => setForm({ ...form, laborCost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custos Fixos (R$)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.overheadCost || ''}
                      onChange={(e) => setForm({ ...form, overheadCost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.sellingPrice || ''}
                      onChange={(e) => setForm({ ...form, sellingPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

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
                    {editingId ? 'Salvar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">{detailRecipe.name}</h3>
                <button onClick={() => setShowDetail(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Detalhamento de Custos</h4>
                  <div className="space-y-2">
                    {detailRecipe.ingredients.map((ri, i) => {
                      const ing = ingredients.find((ing) => ing.id === ri.ingredientId);
                      const cost = ing ? (ing.purchasePrice / ing.purchaseQuantity) * ri.quantity : 0;
                      return (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600">{ing?.name} ({ri.quantity} {ing?.unit})</span>
                          <span className="font-medium text-gray-800">{formatCurrency(cost)}</span>
                        </div>
                      );
                    })}
                    {detailRecipe.laborCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Mão de obra</span>
                        <span className="font-medium text-gray-800">{formatCurrency(detailRecipe.laborCost)}</span>
                      </div>
                    )}
                    {detailRecipe.overheadCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Custos fixos</span>
                        <span className="font-medium text-gray-800">{formatCurrency(detailRecipe.overheadCost)}</span>
                      </div>
                    )}
                    <div className="border-t border-orange-200 pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span className="text-gray-800">Custo Total</span>
                        <span className="text-red-600">{formatCurrency(getRecipeCost(detailRecipe))}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-red-600">Custo/Unidade</p>
                    <p className="text-lg font-bold text-red-700">{formatCurrency(getRecipeCostPerUnit(detailRecipe))}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-green-600">Lucro Total</p>
                    <p className="text-lg font-bold text-green-700">{formatCurrency(getRecipeProfit(detailRecipe))}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-blue-600">Preço de Venda</p>
                    <p className="text-lg font-bold text-blue-700">{formatCurrency(detailRecipe.sellingPrice)}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-purple-600">Margem</p>
                    <p className="text-lg font-bold text-purple-700">{getRecipeProfitMargin(detailRecipe).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipes Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe, index) => {
            const cost = getRecipeCost(recipe);
            const margin = getRecipeProfitMargin(recipe);
            const costPerUnit = getRecipeCostPerUnit(recipe);
            const pricePerUnit = recipe.yields > 0 ? recipe.sellingPrice / recipe.yields : recipe.sellingPrice;

            return (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                      <Cake className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{recipe.name}</h4>
                      {recipe.category && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {recipe.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowDetail(recipe.id)}
                      className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <Calculator className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(recipe)}
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rendimento:</span>
                    <span className="font-medium text-gray-800">{recipe.yields} {recipe.yieldUnit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Custo total:</span>
                    <span className="font-medium text-red-600">{formatCurrency(cost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Custo/unidade:</span>
                    <span className="font-medium text-gray-800">{formatCurrency(costPerUnit)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Preço/unidade:</span>
                    <span className="font-medium text-gray-800">{formatCurrency(pricePerUnit)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="text-gray-500">Preço de venda:</span>
                    <span className="font-bold text-orange-600">{formatCurrency(recipe.sellingPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-500 text-sm">Margem:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      margin >= 30 ? 'bg-green-100 text-green-700' :
                      margin >= 15 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {margin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl border border-gray-100"
        >
          <Cake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500">
            {search ? 'Nenhuma receita encontrada' : 'Nenhuma receita cadastrada'}
          </h3>
          <p className="text-gray-400 mt-2">
            {search ? 'Tente ajustar a busca.' : 'Clique em "Nova Receita" para começar.'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
