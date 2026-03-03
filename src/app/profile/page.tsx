import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BookOpen, Film, Star, Settings, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const bookEntries = await db.bookEntry.findMany({ where: { userId: user.id }, include: { book: true } });
  const movieEntries = await db.movieEntry.findMany({ where: { userId: user.id }, include: { movie: true } });
  const reviews = await db.review.findMany({ where: { userId: user.id } });

  const stats = {
    booksRead: bookEntries.filter(e => e.status === 'COMPLETED').length,
    moviesWatched: movieEntries.filter(e => e.status === 'COMPLETED').length,
    currentlyReading: bookEntries.filter(e => e.status === 'READING').length,
    currentlyWatching: movieEntries.filter(e => e.status === 'WATCHING').length,
    totalRatings: [...bookEntries, ...movieEntries].filter(e => e.rating !== null).length,
    totalReviews: reviews.length,
  };

  const recentBooks = bookEntries.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 5);
  const recentMovies = movieEntries.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24"><AvatarImage src={user.avatar || ''} alt={user.nickname} /><AvatarFallback className="text-2xl">{user.nickname.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2"><h1 className="text-2xl font-bold">{user.nickname}</h1><Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}</Badge></div>
              <p className="text-muted-foreground">На сайте с {user.createdAt.toLocaleDateString('ru-RU')}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild><Link href="/profile/settings"><Settings className="mr-2 h-4 w-4" />Настройки</Link></Button>
              <Button variant="outline"><Edit className="mr-2 h-4 w-4" />Редактировать</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6 text-center"><BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" /><div className="text-3xl font-bold">{stats.booksRead}</div><div className="text-sm text-muted-foreground">Книг прочитано</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><Film className="h-8 w-8 mx-auto mb-2 text-purple-500" /><div className="text-3xl font-bold">{stats.moviesWatched}</div><div className="text-sm text-muted-foreground">Фильмов просмотрено</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" /><div className="text-3xl font-bold">{stats.totalRatings}</div><div className="text-sm text-muted-foreground">Оценок</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><Edit className="h-8 w-8 mx-auto mb-2 text-green-500" /><div className="text-3xl font-bold">{stats.totalReviews}</div><div className="text-sm text-muted-foreground">Отзывов</div></CardContent></Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-500" />Читаю сейчас</CardTitle><CardDescription>{stats.currentlyReading} книг в процессе чтения</CardDescription></CardHeader>
          <CardContent>{recentBooks.filter(e => e.status === 'READING').length > 0 ? (<ul className="space-y-2">{recentBooks.filter(e => e.status === 'READING').map(entry => (<li key={entry.id}><Link href={`/books/${entry.bookId}`} className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors"><span>{entry.book.title}</span>{entry.rating && <span className="text-sm text-muted-foreground">★ {entry.rating}</span>}</Link></li>))}</ul>) : (<p className="text-muted-foreground text-center py-4">Нет книг в процессе чтения</p>)}</CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Film className="h-5 w-5 text-purple-500" />Смотрю сейчас</CardTitle><CardDescription>{stats.currentlyWatching} фильмов в процессе просмотра</CardDescription></CardHeader>
          <CardContent>{recentMovies.filter(e => e.status === 'WATCHING').length > 0 ? (<ul className="space-y-2">{recentMovies.filter(e => e.status === 'WATCHING').map(entry => (<li key={entry.id}><Link href={`/movies/${entry.movieId}`} className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors"><span>{entry.movie.title}</span>{entry.rating && <span className="text-sm text-muted-foreground">★ {entry.rating}</span>}</Link></li>))}</ul>) : (<p className="text-muted-foreground text-center py-4">Нет фильмов в процессе просмотра</p>)}</CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Последние книги</CardTitle></CardHeader>
          <CardContent>{recentBooks.length > 0 ? (<ul className="space-y-2">{recentBooks.map(entry => (<li key={entry.id}><Link href={`/books/${entry.bookId}`} className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors"><div><span className="font-medium">{entry.book.title}</span><span className="text-sm text-muted-foreground ml-2">{entry.book.author}</span></div><Badge variant="outline">{entry.status === 'COMPLETED' ? 'Прочитано' : entry.status === 'READING' ? 'Читаю' : entry.status === 'ON_HOLD' ? 'На паузе' : entry.status === 'DROPPED' ? 'Не дочитал' : 'Не читал'}</Badge></Link></li>))}</ul>) : (<p className="text-muted-foreground text-center py-4">Ваш список книг пуст</p>)}</CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Последние фильмы</CardTitle></CardHeader>
          <CardContent>{recentMovies.length > 0 ? (<ul className="space-y-2">{recentMovies.map(entry => (<li key={entry.id}><Link href={`/movies/${entry.movieId}`} className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors"><div><span className="font-medium">{entry.movie.title}</span><span className="text-sm text-muted-foreground ml-2">{entry.movie.director}</span></div><Badge variant="outline">{entry.status === 'COMPLETED' ? 'Просмотрено' : entry.status === 'WATCHING' ? 'Смотрю' : entry.status === 'ON_HOLD' ? 'На паузе' : entry.status === 'DROPPED' ? 'Не досмотрел' : 'Не смотрел'}</Badge></Link></li>))}</ul>) : (<p className="text-muted-foreground text-center py-4">Ваш список фильмов пуст</p>)}</CardContent>
        </Card>
      </div>
    </div>
  );
}
