import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Papa from "papaparse";
import { bulkCreateExpenses } from "@/lib/api";
import { parse, format } from "date-fns";

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

  const formatDate = (dateStr: string) => {
    try {
      // Parse la date au format DD/MM/YYYY
      const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
      // Convertit en format ISO YYYY-MM-DD
      return format(parsedDate, 'yyyy-MM-dd');
    } catch (error) {
      throw new Error(`Format de date invalide: ${dateStr}`);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    Papa.parse(file, {
      header: true,
      delimiter: ";",
      encoding: "UTF-8",
      complete: async (results) => {
        try {
          const data = results.data as CSVRow[];
          
          if (data.length === 0) {
            throw new Error("Le fichier est vide");
          }
          
          // Préparer les dépenses sans catégorie
          const expenses = data
            .filter(row => row["Montant"] && row["Date de l'opération"])
            .map(row => ({
              date: formatDate(row["Date de l'opération"]),
              amount: Math.abs(parseFloat(row["Montant"].replace(",", "."))),
              description: row["Détail 1"] || "",
              category_id: undefined // Utilise category_id au lieu de category
            }));
          
          if (expenses.length === 0) {
            throw new Error("Aucune dépense valide trouvée dans le fichier");
          }

          await bulkCreateExpenses(expenses);
          
          toast({
            title: "Import réussi",
            description: `${expenses.length} dépenses ont été importées avec succès.`,
          });
        } catch (error) {
          toast({
            title: "Erreur lors de l'import",
            description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'import du fichier.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
          event.target.value = '';
        }
      },
      error: (error) => {
        toast({
          title: "Erreur de lecture",
          description: "Le fichier n'a pas pu être lu correctement. Vérifiez le format du fichier.",
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