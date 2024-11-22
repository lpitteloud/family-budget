import { BudgetOverview } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Euro } from "lucide-react";

interface OverviewProps {
  data: BudgetOverview;
}

export const Overview = ({ data }: OverviewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6 space-y-2">
        <div className="flex items-center space-x-2">
          <Euro className="text-blue-500" />
          <h3 className="text-sm font-medium">Budget Total</h3>
        </div>
        <p className="text-2xl font-bold">{data.totalBudget}€</p>
      </Card>
      
      <Card className="p-6 space-y-2">
        <div className="flex items-center space-x-2">
          <Euro className="text-gray-500" />
          <h3 className="text-sm font-medium">Dépenses Totales</h3>
        </div>
        <p className="text-2xl font-bold">{data.totalSpent}€</p>
      </Card>
      
      <Card className="p-6 space-y-2">
        <div className="flex items-center space-x-2">
          <Euro className={data.remaining >= 0 ? "text-green-500" : "text-red-500"} />
          <h3 className="text-sm font-medium">Montant Restant</h3>
        </div>
        <p className={`text-2xl font-bold ${data.remaining >= 0 ? "text-green-500" : "text-red-500"}`}>
          {data.remaining}€
        </p>
      </Card>
    </div>
  );
};