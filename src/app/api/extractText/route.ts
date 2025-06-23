// src/app/api/extractText/route.ts
import { appRoute } from '@genkit-ai/next';
import { extractTextFromDocumentFlow } from '@/ai/flows/extract-text-from-document';

export const POST = appRoute(extractTextFromDocumentFlow);
