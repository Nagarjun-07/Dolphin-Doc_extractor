import { ScanText } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center gap-3">
        <ScanText size={32} aria-hidden="true" />
        <h1 className="text-2xl font-headline font-semibold">DocuDolphin</h1>
      </div>
    </header>
  );
}
