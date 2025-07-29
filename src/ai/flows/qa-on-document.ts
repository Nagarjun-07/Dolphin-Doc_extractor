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
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert AI assistant tasked with answering questions about a specific document. Your primary goal is to be clear, informative, and helpful.

Your instructions are as follows:

1.  **Analyze the User's Question:** Understand what the user is asking.
2.  **Search the Document First:** Carefully examine the document content provided below inside the <document> tags to find the answer.
3.  **Formulate Your Response:**
    *   **If the answer is found in the document:** Respond with the relevant information. Start your answer by stating that you found the information in the document (e.g., "According to the document..."). Then, provide the answer along with a brief explanation or clarification to ensure it's easy to understand.
    *   **If the answer is NOT found in the document:** Clearly inform the user that the information is not available in the uploaded document. Then, use your general knowledge to provide a relevant background explanation or an educated answer to their question.

Always be polite and helpful.

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
