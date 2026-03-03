'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number | null;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const SIZE_CLASSES = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-6 w-6' };
const GAP_CLASSES = { sm: 'gap-0.5', md: 'gap-1', lg: 'gap-1.5' };

export function RatingStars({ rating, onRate, size = 'md', showValue = false, className }: RatingStarsProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const displayRating = hoverRating ?? rating ?? 0;
  const isInteractive = !!onRate;

  return (
    <div className={cn('flex items-center', GAP_CLASSES[size], className)} role={isInteractive ? 'slider' : undefined} aria-label={`Рейтинг: ${rating ?? 'не оценено'} из 5`} aria-valuenow={rating ?? 0} aria-valuemin={0} aria-valuemax={5}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;
        return (
          <button key={star} type="button" disabled={!isInteractive} onClick={() => isInteractive && onRate(star)} onMouseEnter={() => isInteractive && setHoverRating(star)} onMouseLeave={() => isInteractive && setHoverRating(null)} className={cn('relative transition-all duration-150', isInteractive && 'cursor-pointer hover:scale-110', !isInteractive && 'cursor-default')} aria-label={`Оценить ${star} звёзд`}>
            <Star className={cn(SIZE_CLASSES[size], 'transition-colors duration-150', isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted')} />
          </button>
        );
      })}
      {showValue && <span className="ml-2 text-sm font-medium text-muted-foreground">{rating ? rating.toFixed(1) : '—'}</span>}
    </div>
  );
}
