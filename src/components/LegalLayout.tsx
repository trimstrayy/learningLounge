import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

interface LegalLayoutProps {
  title: string;
  children: ReactNode;
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-card shadow-lg rounded-lg p-8 border border-border">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-8">{title}</h1>
        <div className="prose prose-lg max-w-none text-foreground dark:prose-invert">
          {children}
        </div>
      </div>
    </div>
  );
}