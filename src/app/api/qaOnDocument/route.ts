// src/app/api/qaOnDocument/route.ts
import { appRoute } from '@genkit-ai/next';
import { qaOnDocumentFlow } from '@/ai/flows/qa-on-document';

export const POST = appRoute(qaOnDocumentFlow);
