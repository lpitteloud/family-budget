import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface AddCategoryFormProps {
  onAdd: (name: string, budget: number) => void;
}

export const AddCategoryForm = ({ onAdd }: AddCategoryFormProps) => {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !budget) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    onAdd(name, Number(budget));
    setName("");
    setBudget("");
    
    toast({
      title: "Catégorie ajoutée",
      description: "La nouvelle catégorie a été créée avec succès",
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Nouvelle Catégorie</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nom de la catégorie
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Alimentation"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="budget" className="text-sm font-medium">
            Budget mensuel (€)
          </label>
          <Input
            id="budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Ex: 400"
            min="0"
          />
        </div>
        
        <Button type="submit" className="w-full">
          Ajouter la catégorie
        </Button>
      </form>
    </Card>
  );
};