// src/app/api/extractTables/route.ts
import { appRoute } from '@genkit-ai/next';
import { extractTablesFromDocumentFlow } from '@/ai/flows/extract-tables-from-document';

export const POST = appRoute(extractTablesFromDocumentFlow);
