'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { FileUploadCard } from '@/components/content-extractor/file-upload-card';
import { ResultsDisplay } from '@/components/content-extractor/results-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { extractTextFromDocument } from '@/ai/flows/extract-text-from-document';
import { extractTablesFromDocument } from '@/ai/flows/extract-tables-from-document';
import { extractFormulasFromDocument } from '@/ai/flows/extract-formulas-from-document';
import type { ExtractedTableData } from '@/types';
import { downloadFile, prepareCombinedContent } from '@/lib/download';


const readFileAsDataURI = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export default function HomePage() {
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [extractedTables, setExtractedTables] = useState<ExtractedTableData[] | null>(null);
  const [extractedFormulas, setExtractedFormulas] = useState<string[] | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // This state is used to ensure that client-only components render after hydration
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleExtractContent = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setExtractedText(null);
    setExtractedTables(null);
    setExtractedFormulas(null);

    try {
      const documentDataUri = await readFileAsDataURI(file);
      
      // Perform extractions in parallel
      const [textResult, tablesResult, formulasResult] = await Promise.allSettled([
        extractTextFromDocument({ documentDataUri }),
        extractTablesFromDocument({ documentDataUri }),
        extractFormulasFromDocument({ documentDataUri }),
      ]);

      if (textResult.status === 'fulfilled') {
        setExtractedText(textResult.value.extractedText);
      } else {
        console.error('Text extraction failed:', textResult.reason);
        toast({ variant: "destructive", title: "Text Extraction Error", description: "Failed to extract text." });
      }

      if (tablesResult.status === 'fulfilled') {
        setExtractedTables(tablesResult.value.tables);
      } else {
        console.error('Table extraction failed:', tablesResult.reason);
        toast({ variant: "destructive", title: "Table Extraction Error", description: "Failed to extract tables." });
      }

      if (formulasResult.status === 'fulfilled') {
        setExtractedFormulas(formulasResult.value.formulas);
      } else {
        console.error('Formula extraction failed:', formulasResult.reason);
        toast({ variant: "destructive", title: "Formula Extraction Error", description: "Failed to extract formulas." });
      }
      
      // Set a general error if all fail, or rely on toasts for individual errors
      if (textResult.status === 'rejected' && tablesResult.status === 'rejected' && formulasResult.status === 'rejected') {
         setError('Failed to extract any content from the document. Please try a different file or check the console for details.');
      } else if (textResult.status === 'fulfilled' || tablesResult.status === 'fulfilled' || formulasResult.status === 'fulfilled') {
        // Content was extracted, even if some parts failed
        toast({ title: "Extraction Complete", description: "Content has been processed." });
      }


    } catch (e: any) {
      console.error('Extraction process failed:', e);
      const errorMessage = e.message || 'An unexpected error occurred during extraction.';
      setError(errorMessage);
      toast({ variant: "destructive", title: "Extraction Process Error", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleDownload = useCallback((format: 'txt' | 'docx') => {
    const combinedContent = prepareCombinedContent(extractedText, extractedTables, extractedFormulas);
    const filename = `extracted_content.${format}`;
    const mimeType = format === 'txt' ? 'text/plain;charset=utf-8' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    downloadFile(filename, combinedContent, mimeType);
    toast({ title: "Download Started", description: `Downloading ${filename}` });
  }, [extractedText, extractedTables, extractedFormulas, toast]);

  if (!isClient) {
    // Render a loading state or null during SSR and initial client render
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto p-4 md:p-6 lg:p-8 flex-grow w-full flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 flex-grow w-full">
        <div className="space-y-6 max-w-4xl mx-auto">
          <FileUploadCard onExtract={handleExtractContent} isLoading={isLoading} />

          {isLoading && (
            <div className="flex flex-col items-center justify-center p-10 bg-card rounded-lg shadow-md border">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg text-foreground font-medium">Processing document, please wait...</p>
              <p className="text-sm text-muted-foreground">This may take a few moments.</p>
            </div>
          )}

          {error && !isLoading && (
            <Alert variant="destructive" className="shadow-md">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              <AlertTitle className="font-headline">Extraction Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!isLoading && !error && (extractedText || (extractedTables && extractedTables.length > 0) || (extractedFormulas && extractedFormulas.length > 0)) && (
            <ResultsDisplay
              text={extractedText}
              tables={extractedTables}
              formulas={extractedFormulas}
              onDownload={handleDownload}
            />
          )}
        </div>
      </main>
    </div>
  );
}
