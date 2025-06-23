// src/ai/flows/extract-formulas-from-document.ts
'use server';
/**
 * @fileOverview Extracts mathematical formulas from a document.
 *
 * - extractFormulasFromDocument - A function that handles the formula extraction process.
 * - ExtractFormulasFromDocumentInput - The input type for the extractFormulasFromDocument function.
 * - ExtractFormulasFromDocumentOutput - The return type for the extractFormulasFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractFormulasFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (PDF, JPG, PNG, etc.) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractFormulasFromDocumentInput = z.infer<typeof ExtractFormulasFromDocumentInputSchema>;

const ExtractFormulasFromDocumentOutputSchema = z.object({
  formulas: z.array(z.string()).describe('The extracted mathematical formulas.'),
});
export type ExtractFormulasFromDocumentOutput = z.infer<typeof ExtractFormulasFromDocumentOutputSchema>;

export async function extractFormulasFromDocument(input: ExtractFormulasFromDocumentInput): Promise<ExtractFormulasFromDocumentOutput> {
  return extractFormulasFromDocumentFlow(input);
}

const extractFormulasFromDocumentPrompt = ai.definePrompt({
  name: 'extractFormulasFromDocumentPrompt',
  input: {schema: ExtractFormulasFromDocumentInputSchema},
  output: {schema: ExtractFormulasFromDocumentOutputSchema},
  prompt: `You are an expert in identifying and extracting mathematical formulas from documents.

  Analyze the document provided and extract all mathematical formulas.

  Document: {{media url=documentDataUri}}`,
});

export const extractFormulasFromDocumentFlow = ai.defineFlow(
  {
    name: 'extractFormulasFromDocumentFlow',
    inputSchema: ExtractFormulasFromDocumentInputSchema,
    outputSchema: ExtractFormulasFromDocumentOutputSchema,
  },
  async input => {
    const {output} = await extractFormulasFromDocumentPrompt(input);
    return output!;
  }
);
