
'use server';
/**
 * @fileOverview Orchestrates the extraction of text, tables, and formulas from a document by running specialized flows in parallel.
 *
 * - extractContentFromDocument - A function that handles the content extraction process.
 * - ExtractContentFromDocumentInput - The input type for the function.
 * - ExtractContentFromDocumentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

import { extractTextFromDocument } from './extract-text-from-document';
import { extractTablesFromDocument } from './extract-tables-from-document';
import { extractFormulasFromDocument } from './extract-formulas-from-document';

// Input Schema
export const ExtractContentFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (PDF, JPG, PNG, etc.) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractContentFromDocumentInput = z.infer<typeof ExtractContentFromDocumentInputSchema>;

// Output Schema
const TableSchema = z.object({
  header: z.array(z.string()).describe('The header row of the table.'),
  rows: z.array(z.array(z.string())).describe('The data rows of the table.'),
});

export const ExtractContentFromDocumentOutputSchema = z.object({
  extractedText: z.string().describe('The full extracted text from the document.'),
  tables: z.array(TableSchema).describe('An array of tables extracted from the document.'),
  formulas: z.array(z.string()).describe('An array of mathematical formulas extracted from the document.'),
});
export type ExtractContentFromDocumentOutput = z.infer<typeof ExtractContentFromDocumentOutputSchema>;


// The main exported function to be called from the app.
// It orchestrates the individual extraction flows.
export async function extractContentFromDocument(input: ExtractContentFromDocumentInput): Promise<ExtractContentFromDocumentOutput> {
    // Using Promise.all to run extractions concurrently for better performance
    const [textResult, tablesResult, formulasResult] = await Promise.all([
      extractTextFromDocument({ documentDataUri: input.documentDataUri }),
      extractTablesFromDocument({ documentDataUri: input.documentDataUri }),
      extractFormulasFromDocument({ documentDataUri: input.documentDataUri }),
    ]);

    return {
      extractedText: textResult.extractedText,
      tables: tablesResult.tables,
      formulas: formulasResult.formulas,
    };
}
