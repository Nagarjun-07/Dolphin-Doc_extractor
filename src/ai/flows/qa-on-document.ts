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
  answer: z.string().describe('The answer to the question, based on the document content.'),
});
export type QaOnDocumentOutput = z.infer<typeof QaOnDocumentOutputSchema>;

export async function qaOnDocument(input: QaOnDocumentInput): Promise<QaOnDocumentOutput> {
  return qaOnDocumentFlow(input);
}

const qaPrompt = ai.definePrompt({
  name: 'qaPrompt',
  input: {schema: QaOnDocumentInputSchema},
  output: {schema: QaOnDocumentOutputSchema},
  prompt: `You are a helpful AI assistant that answers questions based on the content of a specific document.

Your knowledge is strictly limited to the document content provided below inside the <document> tags.
Your task is to carefully analyze this content and provide accurate, concise answers to the user's questions.

If the answer to a question cannot be found within the provided document content, you MUST state that you cannot find the answer in the document. Do not use any external knowledge.

When answering, if the information comes from a specific table or formula, please mention it.

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
