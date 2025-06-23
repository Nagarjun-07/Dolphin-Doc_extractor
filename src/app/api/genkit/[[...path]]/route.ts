
import { createNextApiHandler } from '@genkit-ai/next/app';
import '@/ai/flows/qa-on-document';
import '@/ai/flows/extract-content-from-document';


export const { GET, POST } = createNextApiHandler();
