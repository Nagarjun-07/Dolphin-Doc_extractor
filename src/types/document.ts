import {z} from 'genkit';

// Input Schema
export const ExtractContentFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (PDF, JPG, PNG, etc.) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractContentFromDocumentInput = z.infer<typeof ExtractContentFromDocumentInputSchema>;

// Output Schema
const TableSchema = z.object({
  header: z.array(z.string()).describe('The header row of the table.'),
  rows: z.array(z.array(z.string())).describe('The data rows of the table.'),
});

export const ExtractContentFromDocumentOutputSchema = z.object({
  extractedText: z.string().describe('The full extracted text from the document, using OCR if necessary.'),
  tables: z.array(TableSchema).describe('An array of all tables found in the document. If no tables are found, this should be an empty array.'),
  formulas: z.array(z.string()).describe('An array of all mathematical formulas found in the document. If no formulas are found, this should be an empty array.'),
});
export type ExtractContentFromDocumentOutput = z.infer<typeof ExtractContentFromDocumentOutputSchema>;
