import { config } from 'dotenv';
config();

import '@/ai/flows/extract-formulas-from-document.ts';
import '@/ai/flows/extract-text-from-document.ts';
import '@/ai/flows/extract-tables-from-document.ts';