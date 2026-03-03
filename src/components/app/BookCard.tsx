'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from './RatingStars';
import { BOOK_STATUS_LABELS, type BookStatus } from '@/types';
import { cn } from '@/lib/utils';

// Интерфейс для жанра
interface Genre {
  id: string;
  name: string;
}

// Интерфейс для книги с жанрами
interface BookWithGenres {
  id: string;
  title: string;
  author: string;
  year: number | null;
  description: string | null;
  cover: string | null;
  genre?: string | null;        // Старое поле (для совместимости)
  genres?: Genre[];             // Новое поле с несколькими жанрами
  avgRating?: number | null;
  ratingsCount?: number;
  entry?: {
    status: BookStatus;
    rating: number | null;
  } | null;
}

interface BookCardProps {
  book: BookWithGenres;
  showStatus?: boolean;
  className?: string;
}

const STATUS_COLORS: Record<BookStatus, string> = {
  NOT_READ: 'bg-gray-500',
  READING: 'bg-blue-500',
  COMPLETED: 'bg-green-500',
  ON_HOLD: 'bg-yellow-500',
  DROPPED: 'bg-red-500',
};

export function BookCard({ book, showStatus = true, className }: BookCardProps) {
  const entry = book.entry;
  const hasUserEntry = !!entry;

  // Получаем жанры из нового или старого поля
  const genres = book.genres || (book.genre ? [{ id: 'old', name: book.genre }] : []);

  return (
    <Card className={cn('group overflow-hidden transition-all duration-300 hover:shadow-lg', className)}>
      <Link href={`/books/${book.id}`} className="block">
        <div className="flex gap-4 p-4">
          {/* Обложка */}
          <div className="relative flex-shrink-0 w-24 h-36 overflow-hidden rounded-md bg-muted">
            {book.cover ? (
              <img 
                src={book.cover} 
                alt={`Обложка книги "${book.title}"`} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                <BookOpen className="h-10 w-10 text-blue-400" />
              </div>
            )}

            {/* Статус пользователя */}
            {showStatus && hasUserEntry && (
              <Badge className={cn('absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5', STATUS_COLORS[entry.status], 'text-white')}>
                {BOOK_STATUS_LABELS[entry.status]}
              </Badge>
            )}
          </div>

          {/* Информация */}
          <CardContent className="flex-1 p-0 space-y-2">
            {/* Название */}
            <h3 className="font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {book.title}
            </h3>

            {/* Автор */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="line-clamp-1">{book.author}</span>
            </div>

            {/* Год и жанры */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              {book.year && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{book.year}</span>
                </div>
              )}
              
              {/* Жанры */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {genres.slice(0, 3).map((genre, index) => (
                    <Badge key={genre.id || index} variant="secondary" className="text-[10px] px-1.5">
                      {genre.name}
                    </Badge>
                  ))}
                  {genres.length > 3 && (
                    <Badge variant="outline" className="text-[10px] px-1.5">
                      +{genres.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Рейтинг */}
            <div className="flex items-center gap-2 pt-1">
              <RatingStars rating={entry?.rating ?? book.avgRating ?? null} size="sm" />
              <span className="text-xs text-muted-foreground">
                ({book.ratingsCount ?? 0})
              </span>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}