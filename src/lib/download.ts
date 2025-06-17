import type { ExtractedTableData } from '@/types';

export const downloadFile = (filename: string, content: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const formatTableToString = (table: ExtractedTableData): string => {
  let tableString = "";
  // Add header
  tableString += table.header.join("\t") + "\n";
  // Add separator
  tableString += table.header.map(() => "---").join("\t") + "\n";
  // Add rows
  table.rows.forEach(row => {
    tableString += row.join("\t") + "\n";
  });
  return tableString;
};

export const prepareCombinedContent = (
  text: string | null,
  tables: ExtractedTableData[] | null,
  formulas: string[] | null
): string => {
  let combined = "";

  if (text) {
    combined += "Extracted Text:\n";
    combined += "------------------------------------\n";
    combined += text + "\n\n";
  }

  if (tables && tables.length > 0) {
    combined += "Extracted Tables:\n";
    combined += "------------------------------------\n";
    tables.forEach((table, index) => {
      combined += `Table ${index + 1}:\n`;
      combined += formatTableToString(table) + "\n";
    });
    combined += "\n";
  }

  if (formulas && formulas.length > 0) {
    combined += "Extracted Formulas:\n";
    combined += "------------------------------------\n";
    formulas.forEach((formula, index) => {
      combined += `Formula ${index + 1}: ${formula}\n`;
    });
    combined += "\n";
  }

  if (!combined) {
    return "No content extracted.";
  }

  return combined;
};
