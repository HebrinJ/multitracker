'use client';

import * as React from 'react';
import Link from 'next/link';
import { Film, Calendar, Clapperboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from './RatingStars';
import { MOVIE_STATUS_LABELS, type MovieStatus } from '@/types';
import { cn } from '@/lib/utils';

// Интерфейс для жанра
interface Genre {
  id: string;
  name: string;
}

// Интерфейс для фильма с жанрами
interface MovieWithGenres {
  id: string;
  title: string;
  director: string;
  year: number | null;
  description: string | null;
  poster: string | null;
  genre?: string | null;        // Старое поле
  genres?: Genre[];             // Новое поле
  avgRating?: number | null;
  ratingsCount?: number;
  entry?: {
    status: MovieStatus;
    rating: number | null;
  } | null;
}

interface MovieCardProps {
  movie: MovieWithGenres;
  showStatus?: boolean;
  className?: string;
}

const STATUS_COLORS: Record<MovieStatus, string> = {
  NOT_WATCHED: 'bg-gray-500',
  WATCHING: 'bg-blue-500',
  COMPLETED: 'bg-green-500',
  ON_HOLD: 'bg-yellow-500',
  DROPPED: 'bg-red-500',
};

export function MovieCard({ movie, showStatus = true, className }: MovieCardProps) {
  const entry = movie.entry;
  const hasUserEntry = !!entry;

  // Получаем жанры
  const genres = movie.genres || (movie.genre ? [{ id: 'old', name: movie.genre }] : []);

  return (
    <Card className={cn('group overflow-hidden transition-all duration-300 hover:shadow-lg', className)}>
      <Link href={`/movies/${movie.id}`} className="block">
        <div className="flex gap-4 p-4">
          {/* Постер */}
          <div className="relative flex-shrink-0 w-24 h-36 overflow-hidden rounded-md bg-muted">
            {movie.poster ? (
              <img 
                src={movie.poster} 
                alt={`Постер фильма "${movie.title}"`} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800">
                <Film className="h-10 w-10 text-purple-400" />
              </div>
            )}

            {showStatus && hasUserEntry && (
              <Badge className={cn('absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5', STATUS_COLORS[entry.status], 'text-white')}>
                {MOVIE_STATUS_LABELS[entry.status]}
              </Badge>
            )}
          </div>

          {/* Информация */}
          <CardContent className="flex-1 p-0 space-y-2">
            <h3 className="font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {movie.title}
            </h3>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clapperboard className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="line-clamp-1">{movie.director}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              {movie.year && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{movie.year}</span>
                </div>
              )}
              
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

            <div className="flex items-center gap-2 pt-1">
              <RatingStars rating={entry?.rating ?? movie.avgRating ?? null} size="sm" />
              <span className="text-xs text-muted-foreground">
                ({movie.ratingsCount ?? 0})
              </span>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}