import { useState } from "react";
import { Overview } from "@/components/Dashboard/Overview";
import { ExpensesPieChart } from "@/components/Dashboard/ExpensesPieChart";
import { CategoryCard } from "@/components/Dashboard/CategoryCard";
import { AddCategoryForm } from "@/components/Dashboard/AddCategoryForm";
import { mockCategories, mockOverview } from "@/lib/mockData";
import { Category } from "@/lib/types";

const Index = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [overview, setOverview] = useState(mockOverview);

  const handleAddCategory = (name: string, budget: number) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      budget,
      spent: 0,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      user_id: "mock-user-id",
      created_at: new Date().toISOString()
    };
    
    setCategories([...categories, newCategory]);
    setOverview({
      ...overview,
      totalBudget: overview.totalBudget + budget,
      remaining: overview.remaining + budget,
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Mon Budget</h1>
      
      <Overview data={overview} />
      
      <div className="grid md:grid-cols-2 gap-8">
        <ExpensesPieChart categories={categories} />
        <AddCategoryForm onAdd={handleAddCategory} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Index;