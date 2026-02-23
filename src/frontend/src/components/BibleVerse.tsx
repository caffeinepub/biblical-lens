import { Quote } from 'lucide-react';

interface BibleVerseProps {
  reference: string;
  text: string;
}

export default function BibleVerse({ reference, text }: BibleVerseProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
        <blockquote className="text-lg leading-relaxed pl-6 italic">
          "{text}"
        </blockquote>
      </div>
      <div className="flex justify-end">
        <p className="text-base font-semibold text-primary">
          — {reference} (NIV)
        </p>
      </div>
    </div>
  );
}
