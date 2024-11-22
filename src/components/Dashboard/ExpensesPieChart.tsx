import { Category } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ExpensesPieChartProps {
  categories: Category[];
}

export const ExpensesPieChart = ({ categories }: ExpensesPieChartProps) => {
  const data = categories.map(cat => ({
    name: cat.name,
    value: cat.spent,
    color: cat.color
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Répartition des Dépenses</h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}€`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};