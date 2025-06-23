// src/app/api/extractFormulas/route.ts
import { appRoute } from '@genkit-ai/next';
import { extractFormulasFromDocumentFlow } from '@/ai/flows/extract-formulas-from-document';

export const POST = appRoute(extractFormulasFromDocumentFlow);
