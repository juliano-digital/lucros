import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Ingredient, Recipe, SalesRecord, RecipeIngredient } from '../types';

interface AppState {
  ingredients: Ingredient[];
  recipes: Recipe[];
  sales: SalesRecord[];

  // Ingredient actions
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
  updateIngredient: (id: string, ingredient: Partial<Ingredient>) => void;
  deleteIngredient: (id: string) => void;

  // Recipe actions
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;

  // Sales actions
  addSale: (sale: Omit<SalesRecord, 'id'>) => void;
  deleteSale: (id: string) => void;

  // Calculations
  getIngredientCostPerUnit: (ingredient: Ingredient) => number;
  getRecipeCost: (recipe: Recipe) => number;
  getRecipeCostPerUnit: (recipe: Recipe) => number;
  getRecipeProfit: (recipe: Recipe) => number;
  getRecipeProfitMargin: (recipe: Recipe) => number;
  getBreakEvenUnits: (recipe: Recipe, monthlyFixedCosts: number) => number;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ingredients: [],
      recipes: [],
      sales: [],

      addIngredient: (ingredient) =>
        set((state) => ({
          ingredients: [...state.ingredients, { ...ingredient, id: uuidv4() }],
        })),

      updateIngredient: (id, updates) =>
        set((state) => ({
          ingredients: state.ingredients.map((ing) =>
            ing.id === id ? { ...ing, ...updates } : ing
          ),
        })),

      deleteIngredient: (id) =>
        set((state) => ({
          ingredients: state.ingredients.filter((ing) => ing.id !== id),
        })),

      addRecipe: (recipe) =>
        set((state) => ({
          recipes: [...state.recipes, { ...recipe, id: uuidv4() }],
        })),

      updateRecipe: (id, updates) =>
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      deleteRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        })),

      addSale: (sale) =>
        set((state) => ({
          sales: [...state.sales, { ...sale, id: uuidv4() }],
        })),

      deleteSale: (id) =>
        set((state) => ({
          sales: state.sales.filter((s) => s.id !== id),
        })),

      getIngredientCostPerUnit: (ingredient) => {
        return ingredient.purchasePrice / ingredient.purchaseQuantity;
      },

      getRecipeCost: (recipe) => {
        const { ingredients } = get();
        let totalCost = 0;

        recipe.ingredients.forEach((ri: RecipeIngredient) => {
          const ingredient = ingredients.find((i) => i.id === ri.ingredientId);
          if (ingredient) {
            const costPerUnit = get().getIngredientCostPerUnit(ingredient);
            totalCost += costPerUnit * ri.quantity;
          }
        });

        totalCost += recipe.laborCost + recipe.overheadCost;
        return totalCost;
      },

      getRecipeCostPerUnit: (recipe) => {
        const totalCost = get().getRecipeCost(recipe);
        return recipe.yields > 0 ? totalCost / recipe.yields : totalCost;
      },

      getRecipeProfit: (recipe) => {
        const costPerUnit = get().getRecipeCostPerUnit(recipe);
        const pricePerUnit = recipe.yields > 0 ? recipe.sellingPrice / recipe.yields : recipe.sellingPrice;
        return (pricePerUnit - costPerUnit) * recipe.yields;
      },

      getRecipeProfitMargin: (recipe) => {
        const cost = get().getRecipeCost(recipe);
        if (cost === 0) return 0;
        const profit = get().getRecipeProfit(recipe);
        return (profit / recipe.sellingPrice) * 100;
      },

      getBreakEvenUnits: (recipe, monthlyFixedCosts) => {
        const costPerUnit = get().getRecipeCostPerUnit(recipe);
        const pricePerUnit = recipe.yields > 0 ? recipe.sellingPrice / recipe.yields : recipe.sellingPrice;
        const contributionMargin = pricePerUnit - costPerUnit;
        if (contributionMargin <= 0) return Infinity;
        return Math.ceil(monthlyFixedCosts / contributionMargin);
      },
    }),
    {
      name: 'confeitaria-storage',
    }
  )
);
