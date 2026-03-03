import * as React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear} Мультитрекер.</span>
            <span className="hidden sm:inline">Все права защищены.</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Сделано с</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>для любителей книг и фильмов</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
