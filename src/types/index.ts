export interface Ingredient {
  id: string;
  name: string;
  unit: 'kg' | 'g' | 'L' | 'ml' | 'un' | 'dz';
  purchasePrice: number;
  purchaseQuantity: number;
  category: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  yields: number; // quantidade de unidades que a receita rende
  yieldUnit: string; // ex: "bolos", "fatias", "unidades"
  ingredients: RecipeIngredient[];
  laborCost: number; // custo de mão de obra
  overheadCost: number; // custos fixos (luz, gás, etc.)
  sellingPrice: number;
  image?: string;
}

export interface SalesRecord {
  id: string;
  recipeId: string;
  quantity: number;
  date: string;
  totalRevenue: number;
  totalCost: number;
  profit: number;
}

export interface DashboardStats {
  totalCost: number;
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  breakEvenUnits: number;
}
