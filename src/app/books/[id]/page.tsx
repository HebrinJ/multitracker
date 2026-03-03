import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Calendar, User, Star, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RatingStars } from '@/components/app/RatingStars';
import { db } from '@/lib/db';

interface BookPageProps { params: Promise<{ id: string }> }

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;

  const book = await db.book.findUnique({
    where: { id },
    include: { reviews: { include: { user: { select: { id: true, nickname: true, avatar: true } } } }, orderBy: { createdAt: 'desc' } },
  });

  if (!book) notFound();

  const reviewsWithRating = book.reviews.filter(r => r.rating > 0);
  const avgRating = reviewsWithRating.length > 0 ? reviewsWithRating.reduce((sum, r) => sum + r.rating, 0) / reviewsWithRating.length : null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Button variant="ghost" asChild><Link href="/books"><ArrowLeft className="mr-2 h-4 w-4" />К списку книг</Link></Button>

      <div className="grid md:grid-cols-[200px_1fr] gap-8">
        <div className="relative aspect-[2/3] w-full max-w-[200px] mx-auto md:mx-0">
          {book.cover ? (
            <img src={book.cover} alt={`Обложка книги "${book.title}"`} className="w-full h-full object-cover rounded-lg shadow-lg" />
          ) : (
            <div className="w-full h-full rounded-lg shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-blue-400" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">{book.title}</h1>
          <div className="flex items-center gap-2 text-lg text-muted-foreground"><User className="h-5 w-5" /><span>{book.author}</span></div>
          <div className="flex items-center gap-4">
            {book.year && (<div className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-4 w-4" /><span>{book.year}</span></div>)}
            {book.genre && <Badge variant="secondary">{book.genre}</Badge>}
          </div>
          <div className="flex items-center gap-3">
            <RatingStars rating={avgRating} size="lg" showValue />
            <span className="text-sm text-muted-foreground">({reviewsWithRating.length} оценок)</span>
          </div>
          {book.description && (<div className="pt-4"><h2 className="text-lg font-semibold mb-2">Описание</h2><p className="text-muted-foreground leading-relaxed">{book.description}</p></div>)}
          <div className="flex gap-3 pt-4">
            <Button><Star className="mr-2 h-4 w-4" />Добавить в список</Button>
            <Button variant="outline"><Edit className="mr-2 h-4 w-4" />Написать отзыв</Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Отзывы ({book.reviews.length})</h2>
        {book.reviews.length > 0 ? (
          <div className="space-y-4">
            {book.reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar><AvatarImage src={review.user.avatar || ''} /><AvatarFallback>{review.user.nickname.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                      <div><div className="font-medium">{review.user.nickname}</div><div className="text-sm text-muted-foreground">{review.createdAt.toLocaleDateString('ru-RU')}</div></div>
                    </div>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>
                </CardHeader>
                <CardContent><p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{review.text}</p></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">Отзывов пока нет. Будьте первым!</p></CardContent></Card>
        )}
      </div>
    </div>
  );
}
