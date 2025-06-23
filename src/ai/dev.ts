import { config } from 'dotenv';
config();

import '@/ai/flows/extract-content-from-document.ts';
import '@/ai/flows/qa-on-document.ts';
import '@/ai/flows/extract-text-from-document';
import '@/ai/flows/extract-tables-from-document';
import '@/ai/flows/extract-formulas-from-document';
