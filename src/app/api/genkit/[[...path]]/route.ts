
import { createNextApiHandler } from '@genkit-ai/next/app';
import '@/ai/flows/extract-content-from-document';
import '@/ai/flows/qa-on-document';
import '@/ai/flows/extract-text-from-document';
import '@/ai/flows/extract-tables-from-document';
import '@/ai/flows/extract-formulas-from-document';

export const { GET, POST } = createNextApiHandler();
