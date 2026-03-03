import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookCard } from '@/components/app/BookCard';
import { db } from '@/lib/db';

const BOOKS_PER_PAGE = 20;
const GENRES = ['Все жанры', 'Фантастика', 'Фэнтези', 'Детектив', 'Триллер', 'Романтика', 'Классика', 'Научная литература', 'Биография', 'История'];

export default async function BooksPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string; genre?: string; sort?: string }> }) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const searchQuery = params.search || '';
  const selectedGenre = params.genre || 'Все жанры';
  const sortBy = params.sort || 'title';

  const books = await db.book.findMany({
    where: {
      status: 'APPROVED',
      ...(searchQuery && { OR: [{ title: { contains: searchQuery } }, { author: { contains: searchQuery } }] }),
      ...(selectedGenre !== 'Все жанры' && { genre: selectedGenre }),
    },
    orderBy: { ...(sortBy === 'title' && { title: 'asc' }), ...(sortBy === 'year' && { year: 'desc' }), ...(sortBy === 'createdAt' && { createdAt: 'desc' }) } as any,
    skip: (currentPage - 1) * BOOKS_PER_PAGE,
    take: BOOKS_PER_PAGE,
  });

  const totalBooks = await db.book.count({
    where: {
      status: 'APPROVED',
      ...(searchQuery && { OR: [{ title: { contains: searchQuery } }, { author: { contains: searchQuery } }] }),
      ...(selectedGenre !== 'Все жанры' && { genre: selectedGenre }),
    },
  });

  const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);

  const booksWithStats = books.map((book) => ({ ...book, avgRating: null, ratingsCount: 0, reviewsCount: 0, entry: null }));

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Книги</h1><p className="text-muted-foreground mt-1">{totalBooks} книг в каталоге</p></div>
        <Button asChild><Link href="/books/add"><Plus className="mr-2 h-4 w-4" />Добавить книгу</Link></Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Поиск по названию или автору..." className="pl-9" defaultValue={searchQuery} name="search" />
            </div>
            <Select name="genre" defaultValue={selectedGenre}>
              <SelectTrigger className="w-full md:w-[180px]"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Жанр" /></SelectTrigger>
              <SelectContent>{GENRES.map((genre) => (<SelectItem key={genre} value={genre}>{genre}</SelectItem>))}</SelectContent>
            </Select>
            <Select name="sort" defaultValue={sortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">По названию</SelectItem>
                <SelectItem value="year">По году</SelectItem>
                <SelectItem value="createdAt">Сначала новые</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {booksWithStats.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{booksWithStats.map((book) => (<BookCard key={book.id} book={book} />))}</div>
      ) : (
        <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">{searchQuery || selectedGenre !== 'Все жанры' ? 'Книги не найдены. Попробуйте изменить параметры поиска.' : 'Каталог книг пуст. Будьте первым, кто добавит книгу!'}</p></CardContent></Card>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {currentPage > 1 && (<Button variant="outline" asChild><Link href={`/books?page=${currentPage - 1}&search=${searchQuery}&genre=${selectedGenre}&sort=${sortBy}`}>Назад</Link></Button>)}
          <div className="flex items-center gap-2 px-4"><span className="text-sm text-muted-foreground">Страница {currentPage} из {totalPages}</span></div>
          {currentPage < totalPages && (<Button variant="outline" asChild><Link href={`/books?page=${currentPage + 1}&search=${searchQuery}&genre=${selectedGenre}&sort=${sortBy}`}>Вперёд</Link></Button>)}
        </div>
      )}
    </div>
  );
}
