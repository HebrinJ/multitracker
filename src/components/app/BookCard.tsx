'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from './RatingStars';
import { BOOK_STATUS_LABELS, type BookWithEntry, type BookStatus } from '@/types';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: BookWithEntry;
  showStatus?: boolean;
  className?: string;
}

const STATUS_COLORS: Record<BookStatus, string> = { NOT_READ: 'bg-gray-500', READING: 'bg-blue-500', COMPLETED: 'bg-green-500', ON_HOLD: 'bg-yellow-500', DROPPED: 'bg-red-500' };

export function BookCard({ book, showStatus = true, className }: BookCardProps) {
  const entry = book.entry;
  const hasUserEntry = !!entry;

  return (
    <Card className={cn('group overflow-hidden transition-all duration-300 hover:shadow-lg', className)}>
      <Link href={`/books/${book.id}`} className="block">
        <div className="flex gap-4 p-4">
          <div className="relative flex-shrink-0 w-24 h-36 overflow-hidden rounded-md bg-muted">
            {book.cover ? (
              <img src={book.cover} alt={`Обложка книги "${book.title}"`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                <BookOpen className="h-10 w-10 text-blue-400" />
              </div>
            )}
            {showStatus && hasUserEntry && (
              <Badge className={cn('absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5', STATUS_COLORS[entry.status], 'text-white')}>{BOOK_STATUS_LABELS[entry.status]}</Badge>
            )}
          </div>
          <CardContent className="flex-1 p-0 space-y-2">
            <h3 className="font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">{book.title}</h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="line-clamp-1">{book.author}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {book.year && (<div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{book.year}</span></div>)}
              {book.genre && <Badge variant="secondary" className="text-[10px] px-1.5">{book.genre}</Badge>}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <RatingStars rating={entry?.rating ?? book.avgRating ?? null} size="sm" />
              <span className="text-xs text-muted-foreground">({book.ratingsCount ?? 0})</span>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
