import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getUncategorizedExpenses } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExpenseCategorizer } from "./ExpenseCategorizer";

export const UncategorizedExpenses = () => {
  const { data: expenses = [] } = useQuery({
    queryKey: ['uncategorizedExpenses'],
    queryFn: getUncategorizedExpenses,
  });

  if (expenses.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-sm">
            {expenses.length}
          </span>
          Dépenses à catégoriser
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Catégoriser les dépenses</DialogTitle>
        </DialogHeader>
        <ExpenseCategorizer expenses={expenses} />
      </DialogContent>
    </Dialog>
  );
};