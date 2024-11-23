import { useState, useEffect } from "react";
import { Overview } from "@/components/Dashboard/Overview";
import { ExpensesPieChart } from "@/components/Dashboard/ExpensesPieChart";
import { CategoryCard } from "@/components/Dashboard/CategoryCard";
import { AddCategoryForm } from "@/components/Dashboard/AddCategoryForm";
import { MonthSelector } from "@/components/Dashboard/MonthSelector";
import { CSVImport } from "@/components/Dashboard/CSVImport";
import { Category } from "@/lib/types";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user, signIn, signOut } = useAuth();

  const { data: categories = [], refetch } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: getCategories,
    enabled: !!user,
  });

  const overview = {
    totalBudget: categories.reduce((sum, cat) => sum + cat.budget, 0),
    totalSpent: categories.reduce((sum, cat) => sum + cat.spent, 0),
    remaining: categories.reduce((sum, cat) => sum + (cat.budget - cat.spent), 0),
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Mon Budget</h1>
        <Button onClick={signIn}>Se connecter avec Google</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mon Budget</h1>
        <Button variant="outline" onClick={signOut}>
          Se déconnecter
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <MonthSelector date={selectedDate} onDateChange={setSelectedDate} />
        <CSVImport />
      </div>
      
      <Overview data={overview} />
      
      <div className="grid md:grid-cols-2 gap-8">
        <ExpensesPieChart categories={categories} />
        <AddCategoryForm onAdd={async (name, budget) => {
          await createCategory(name, budget);
          refetch();
        }} />
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