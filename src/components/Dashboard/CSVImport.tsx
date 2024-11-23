import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Papa from "papaparse";
import { createCategory, bulkCreateExpenses } from "@/lib/api";

interface CSVRow {
  "Date de l'opération": string;
  "Référence de l'opération": string;
  "Type de l'opération": string;
  "Catégorie": string;
  "Sous catégorie": string;
  "Montant": string;
  "Commentaire": string;
  "Détail 1": string;
  "Détail 2"?: string;
  "Détail 3"?: string;
  "Détail 4"?: string;
  "Détail 5"?: string;
  "Détail 6"?: string;
}

export const CSVImport = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    Papa.parse(file, {
      header: true,
      encoding: "UTF-8",
      complete: async (results) => {
        try {
          const data = results.data as CSVRow[];
          
          // Extraire les catégories uniques
          const uniqueCategories = [...new Set(data.map(row => row["Catégorie"]))];
          
          // Créer les catégories
          for (const categoryName of uniqueCategories) {
            if (categoryName) {
              await createCategory(categoryName, 0); // Budget initial à 0
            }
          }
          
          // Préparer les dépenses
          const expenses = data.map(row => ({
            date: row["Date de l'opération"],
            amount: Math.abs(parseFloat(row["Montant"].replace(",", "."))),
            description: row["Détail 1"],
            category: row["Catégorie"]
          }));
          
          await bulkCreateExpenses(expenses);
          
          toast({
            title: "Import réussi",
            description: `${expenses.length} dépenses ont été importées.`,
          });
        } catch (error) {
          toast({
            title: "Erreur lors de l'import",
            description: "Une erreur est survenue lors de l'import du fichier.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      },
      error: () => {
        toast({
          title: "Erreur de lecture",
          description: "Le fichier n'a pas pu être lu correctement.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Importer des dépenses</h3>
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={isLoading}
        />
        {isLoading && <div className="animate-spin">⌛</div>}
      </div>
    </div>
  );
};