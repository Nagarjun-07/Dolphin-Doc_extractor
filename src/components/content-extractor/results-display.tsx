'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, FunctionSquare, Table2 as TableIcon } from 'lucide-react';
import type { ExtractedTableData } from '@/types';

interface ResultsDisplayProps {
  text: string | null;
  tables: ExtractedTableData[] | null;
  formulas: string[] | null;
  onDownload: (format: 'txt' | 'docx') => void;
}

function SectionCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full p-1 pr-3 border rounded-md">
          {children}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function ResultsDisplay({ text, tables, formulas, onDownload }: ResultsDisplayProps) {
  const hasContent = text || (tables && tables.length > 0) || (formulas && formulas.length > 0);

  if (!hasContent) {
    return null; 
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline">Extracted Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="text" aria-label="View extracted text">
              <FileText className="mr-2 h-4 w-4" aria-hidden="true" /> Text
            </TabsTrigger>
            <TabsTrigger value="tables" aria-label="View extracted tables" disabled={!tables || tables.length === 0}>
              <TableIcon className="mr-2 h-4 w-4" aria-hidden="true" /> Tables
            </TabsTrigger>
            <TabsTrigger value="formulas" aria-label="View extracted formulas" disabled={!formulas || formulas.length === 0}>
              <FunctionSquare className="mr-2 h-4 w-4" aria-hidden="true" /> Formulas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <SectionCard title="Extracted Text" icon={<FileText size={20} aria-hidden="true" />}>
              {text ? (
                <pre className="whitespace-pre-wrap break-words text-sm p-2 font-body">{text}</pre>
              ) : (
                <p className="text-muted-foreground p-2">No text extracted.</p>
              )}
            </SectionCard>
          </TabsContent>

          <TabsContent value="tables">
            <SectionCard title="Extracted Tables" icon={<TableIcon size={20} aria-hidden="true" />}>
              {tables && tables.length > 0 ? (
                tables.map((table, index) => (
                  <div key={index} className="mb-6 p-2">
                    <h4 className="text-md font-semibold mb-2 font-headline">Table {index + 1}</h4>
                    <Table className="border">
                      <TableHeader>
                        <TableRow>
                          {table.header.map((headerCell, cellIndex) => (
                            <TableHead key={cellIndex} className="bg-muted/50">{headerCell}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {table.rows.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground p-2">No tables extracted.</p>
              )}
            </SectionCard>
          </TabsContent>

          <TabsContent value="formulas">
            <SectionCard title="Extracted Formulas" icon={<FunctionSquare size={20} aria-hidden="true" />}>
              {formulas && formulas.length > 0 ? (
                <ul className="space-y-2 p-2">
                  {formulas.map((formula, index) => (
                    <li key={index} className="p-2 border rounded-md bg-muted/30">
                      <pre><code className="font-code text-sm">{formula}</code></pre>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground p-2">No formulas extracted.</p>
              )}
            </SectionCard>
          </TabsContent>
        </Tabs>

        {hasContent && (
          <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-end">
            <Button variant="outline" onClick={() => onDownload('txt')} aria-label="Download extracted content as TXT file">
              <Download className="mr-2 h-4 w-4" aria-hidden="true" /> Download as .txt
            </Button>
            <Button variant="outline" onClick={() => onDownload('docx')} aria-label="Download extracted content as DOCX file">
              <Download className="mr-2 h-4 w-4" aria-hidden="true" /> Download as .docx
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
