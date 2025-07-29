
'use server';
/**
 * @fileOverview Extracts text, tables, and formulas from a document in a single pass.
 *
 * - extractContentFromDocument - A function that handles the content extraction process.
 */

import {ai} from '@/ai/genkit';
import {
  ExtractContentFromDocumentInput,
  ExtractContentFromDocumentInputSchema,
  ExtractContentFromDocumentOutput,
  ExtractContentFromDocumentOutputSchema
} from '@/types/document';


// The main exported function to be called from the app.
export async function extractContentFromDocument(input: ExtractContentFromDocumentInput): Promise<ExtractContentFromDocumentOutput> {
  return extractContentFromDocumentFlow(input);
}


// The prompt definition
const extractContentPrompt = ai.definePrompt({
  name: 'extractContentPrompt',
  input: {schema: ExtractContentFromDocumentInputSchema},
  output: {schema: ExtractContentFromDocumentOutputSchema},
  model: 'googleai/gemini-1.5-flash',
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
