
'use server';
/**
 * @fileOverview Extracts text, tables, and formulas from a document in a single pass.
 *
 * - extractContentFromDocument - A function that handles the content extraction process.
 * - ExtractContentFromDocumentInput - The input type for the function.
 * - ExtractContentFromDocumentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  extractedText: z.string().describe('The full extracted text from the document, using OCR if necessary.'),
  tables: z.array(TableSchema).describe('An array of all tables found in the document. If no tables are found, this should be an empty array.'),
  formulas: z.array(z.string()).describe('An array of all mathematical formulas found in the document. If no formulas are found, this should be an empty array.'),
});
export type ExtractContentFromDocumentOutput = z.infer<typeof ExtractContentFromDocumentOutputSchema>;


// The main exported function to be called from the app.
export async function extractContentFromDocument(input: ExtractContentFromDocumentInput): Promise<ExtractContentFromDocumentOutput> {
  return extractContentFromDocumentFlow(input);
}


// The prompt definition
const extractContentPrompt = ai.definePrompt({
  name: 'extractContentPrompt',
  input: {schema: ExtractContentFromDocumentInputSchema},
  output: {schema: ExtractContentFromDocumentOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert at analyzing documents and extracting structured information.
  
  Your task is to process the given document and extract the following three types of content:
  1.  **Full Text**: Extract all text from the document, performing OCR if needed.
  2.  **Tables**: Identify and extract all tables. For each table, provide its header and rows.
  3.  **Formulas**: Identify and extract all mathematical formulas.

  Return the extracted content in the specified JSON format. If a particular content type (e.g., tables or formulas) is not present in the document, return an empty array for that field.

  Document: {{media url=documentDataUri}}`,
});

// The flow definition
const extractContentFromDocumentFlow = ai.defineFlow(
  {
    name: 'extractContentFromDocumentFlow',
    inputSchema: ExtractContentFromDocumentInputSchema,
    outputSchema: ExtractContentFromDocumentOutputSchema,
  },
  async (input) => {
    const {output} = await extractContentPrompt(input);
    
    if (!output) {
      throw new Error("The AI model failed to return structured output for the document.");
    }
    
    return output;
  }
);
