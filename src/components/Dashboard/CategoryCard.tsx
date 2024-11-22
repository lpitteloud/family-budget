import { Category } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const percentage = Math.round((category.spent / category.budget) * 100);
  const isOverBudget = category.spent > category.budget;

  return (
    <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{category.name}</h3>
        <span className={`text-sm font-medium ${isOverBudget ? "text-red-500" : "text-green-500"}`}>
          {percentage}%
        </span>
      </div>
      
      <Progress 
        value={percentage} 
        className={`h-2 ${isOverBudget ? "bg-red-500" : "bg-green-500"}`}
      />
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>{category.spent}€ dépensés</span>
        <span>sur {category.budget}€</span>
      </div>
    </Card>
  );
};