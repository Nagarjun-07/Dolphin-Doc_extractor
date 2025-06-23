
'use server';
/**
 * @fileOverview Extracts tables from a document.
 *
 * - extractTablesFromDocument - A function that handles the table extraction process.
 * - ExtractTablesFromDocumentInput - The input type for the extractTablesFromDocument function.
 * - ExtractTablesFromDocumentOutput - The return type for the extractTablesFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTablesFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (PDF, JPG, PNG, etc.) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTablesFromDocumentInput = z.infer<typeof ExtractTablesFromDocumentInputSchema>;

const TableSchema = z.object({
  header: z.array(z.string()).describe('The header row of the table.'),
  rows: z.array(z.array(z.string())).describe('The data rows of the table.'),
});

const ExtractTablesFromDocumentOutputSchema = z.object({
  tables: z.array(TableSchema).describe('An array of tables extracted from the document.'),
});
export type ExtractTablesFromDocumentOutput = z.infer<typeof ExtractTablesFromDocumentOutputSchema>;

export async function extractTablesFromDocument(input: ExtractTablesFromDocumentInput): Promise<ExtractTablesFromDocumentOutput> {
  return extractTablesFromDocumentFlow(input);
}

const extractTablesPrompt = ai.definePrompt({
  name: 'extractTablesPrompt',
  input: {schema: ExtractTablesFromDocumentInputSchema},
  output: {schema: ExtractTablesFromDocumentOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert at extracting tables from documents.

  Given the following document, extract all tables. If no tables are found, return an empty array. Return the tables as a JSON array of tables. Each table should have a 'header' field which is an array of strings, and a 'rows' field, which is a 2D array of strings.

  Document: {{media url=documentDataUri}}`,
});

const extractTablesFromDocumentFlow = ai.defineFlow(
  {
    name: 'extractTablesFromDocumentFlow',
    inputSchema: ExtractTablesFromDocumentInputSchema,
    outputSchema: ExtractTablesFromDocumentOutputSchema,
  },
  async input => {
    const {output} = await extractTablesPrompt(input);
    return output!;
  }
);
