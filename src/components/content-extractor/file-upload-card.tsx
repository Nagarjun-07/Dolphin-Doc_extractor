'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUp, UploadCloud, Loader2 } from 'lucide-react';

interface FileUploadCardProps {
  onExtract: (file: File) => Promise<void>;
  isLoading: boolean;
}

export function FileUploadCard({ onExtract, isLoading }: FileUploadCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
  }, []);

  const handleSubmit = () => {
    if (selectedFile) {
      onExtract(selectedFile);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <FileUp size={24} aria-hidden="true" />
          Upload Document
        </CardTitle>
        <CardDescription>
          Select a PDF, JPG, or PNG file to extract its content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`p-6 border-2 border-dashed rounded-md transition-colors
            ${dragOver ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
            flex flex-col items-center justify-center text-center cursor-pointer`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('file-upload-input')?.click()}
          role="button"
          tabIndex={0}
          aria-label="File upload drop zone"
        >
          <UploadCloud size={48} className={`mb-2 ${dragOver ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            {dragOver ? "Drop the file here" : "Drag 'n' drop a file here, or click to select file"}
          </p>
          <Input
            id="file-upload-input"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="sr-only"
            aria-describedby="file-name-display"
          />
        </div>

        {selectedFile && (
          <p id="file-name-display" className="text-sm text-foreground">Selected file: <span className="font-medium">{selectedFile.name}</span></p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!selectedFile || isLoading}
          className="w-full"
          aria-label="Extract content from selected file"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Extracting...
            </>
          ) : (
            'Extract Content'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
