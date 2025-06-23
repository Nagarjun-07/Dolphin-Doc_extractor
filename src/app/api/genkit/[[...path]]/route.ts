// src/app/api/genkit/[[...path]]/route.ts
import { createNextApiHandler } from '@genkit-ai/next';
import '@/ai/flows/extract-formulas-from-document';
import '@/ai/flows/extract-tables-from-document';
import '@/ai/flows/extract-text-from-document';
import '@/ai/flows/qa-on-document';

export const { GET, POST } = createNextApiHandler();
