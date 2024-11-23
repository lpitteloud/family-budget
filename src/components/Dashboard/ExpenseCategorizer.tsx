import { useState } from "react";
import { Expense, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories, updateExpense, splitExpense } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ExpenseCategorizerProps {
  expenses: Expense[];
}

export const ExpenseCategorizer = ({ expenses }: ExpenseCategorizerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSplitForm, setShowSplitForm] = useState(false);
  const [splitAmount1, setSplitAmount1] = useState("");
  const [splitAmount2, setSplitAmount2] = useState("");
  const [splitCategory1, setSplitCategory1] = useState("");
  const [splitCategory2, setSplitCategory2] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const currentExpense = expenses[currentIndex];

  const handleCategorize = async (categoryId: string) => {
    try {
      await updateExpense(currentExpense.id, { category_id: categoryId });
      await queryClient.invalidateQueries({ queryKey: ['uncategorizedExpenses'] });
      
      if (currentIndex < expenses.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
      
      toast({
        title: "Dépense catégorisée",
        description: "La dépense a été mise à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la catégorisation.",
        variant: "destructive",
      });
    }
  };

  const handleSplit = async () => {
    const amount1 = parseFloat(splitAmount1);
    const amount2 = parseFloat(splitAmount2);

    if (amount1 + amount2 !== currentExpense.amount) {
      toast({
        title: "Erreur",
        description: "La somme des montants doit être égale au montant total.",
        variant: "destructive",
      });
      return;
    }

    try {
      await splitExpense(currentExpense.id, {
        amount1,
        amount2,
        category_id1: splitCategory1,
        category_id2: splitCategory2,
      });
      
      await queryClient.invalidateQueries({ queryKey: ['uncategorizedExpenses'] });
      setShowSplitForm(false);
      
      if (currentIndex < expenses.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
      
      toast({
        title: "Dépense divisée",
        description: "La dépense a été divisée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la division.",
        variant: "destructive",
      });
    }
  };

  if (!currentExpense) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <h3 className="font-medium">Date</h3>
          <p>{format(new Date(currentExpense.date), 'dd MMMM yyyy', { locale: fr })}</p>
        </div>
        <div>
          <h3 className="font-medium">Description</h3>
          <p>{currentExpense.description || "Pas de description"}</p>
        </div>
        <div>
          <h3 className="font-medium">Montant</h3>
          <p>{currentExpense.amount}€</p>
        </div>
      </div>

      {!showSplitForm ? (
        <div className="space-y-4">
          <Select onValueChange={handleCategorize}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category: Category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowSplitForm(true)}
          >
            Diviser la dépense
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Première partie</h4>
              <Input
                type="number"
                placeholder="Montant"
                value={splitAmount1}
                onChange={(e) => {
                  setSplitAmount1(e.target.value);
                  setSplitAmount2(String(currentExpense.amount - parseFloat(e.target.value || "0")));
                }}
              />
              <Select onValueChange={setSplitCategory1}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Deuxième partie</h4>
              <Input
                type="number"
                placeholder="Montant"
                value={splitAmount2}
                onChange={(e) => {
                  setSplitAmount2(e.target.value);
                  setSplitAmount1(String(currentExpense.amount - parseFloat(e.target.value || "0")));
                }}
              />
              <Select onValueChange={setSplitCategory2}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSplitForm(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSplit} className="flex-1">
              Valider
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};