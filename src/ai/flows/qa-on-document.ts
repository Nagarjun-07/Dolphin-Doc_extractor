'use server';
/**
 * @fileOverview A Q&A agent for answering questions about a document.
 *
 * - qaOnDocument - A function that handles the question answering process.
 * - QaOnDocumentInput - The input type for the qaOnDocument function.
 * - QaOnDocumentOutput - The return type for the qaOnDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QaOnDocumentInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The full text content of the document, including any extracted text, tables, and formulas.'),
  question: z.string().describe("The user's question about the document."),
});
export type QaOnDocumentInput = z.infer<typeof QaOnDocumentInputSchema>;

const QaOnDocumentOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, based on the document content and general knowledge.'),
});
export type QaOnDocumentOutput = z.infer<typeof QaOnDocumentOutputSchema>;

export async function qaOnDocument(input: QaOnDocumentInput): Promise<QaOnDocumentOutput> {
  return qaOnDocumentFlow(input);
}

const qaPrompt = ai.definePrompt({
  name: 'qaPrompt',
  input: {schema: QaOnDocumentInputSchema},
  output: {schema: QaOnDocumentOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are a friendly and humble AI assistant. Your primary goal is to help users understand the content of a specific document.

First, try to answer the user's question using only the document content provided below inside the <document> tags. When you use information from the document, please say so. For example, "According to the document...". If you reference a specific table or formula, please mention it.

If the answer cannot be found in the document, or if the user seems to be asking for broader context or related information, you are encouraged to use your general knowledge to provide a helpful response. If you are using external knowledge, you can say something like, "While the document doesn't cover that, I can tell you that...".

Your tone should always be helpful and polite.

<document>
{{documentContent}}
</document>

User's Question: {{{question}}}`,
});

const qaOnDocumentFlow = ai.defineFlow(
  {
    name: 'qaOnDocumentFlow',
    inputSchema: QaOnDocumentInputSchema,
    outputSchema: QaOnDocumentOutputSchema,
  },
  async (input) => {
    const {output} = await qaPrompt(input);
    return output!;
  }
);
