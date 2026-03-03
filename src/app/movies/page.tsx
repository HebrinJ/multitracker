import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MovieCard } from '@/components/app/MovieCard';
import { db } from '@/lib/db';

const MOVIES_PER_PAGE = 20;

// Получаем жанры для фильмов
async function getGenres() {
  return db.genre.findMany({
    where: { type: 'MOVIE' },
    orderBy: { name: 'asc' },
  });
}

export default async function MoviesPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string; genre?: string; sort?: string }> }) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const searchQuery = params.search || '';
  const selectedGenre = params.genre || 'Все жанры';
  const sortBy = params.sort || 'title';

  // Получаем жанры для фильтра
  const genres = await getGenres();

  // Загружаем фильмы с жанрами
  const movies = await db.movie.findMany({
    where: {
      status: 'APPROVED',
      ...(searchQuery && {
        OR: [
          { title: { contains: searchQuery } },
          { director: { contains: searchQuery } },
        ],
      }),
      ...(selectedGenre !== 'Все жанры' && {
        genres: {
          some: { genre: { name: selectedGenre } },
        },
      }),
    },
    include: {
      genres: {
        include: { genre: true },
      },
    },
    orderBy: {
      ...(sortBy === 'title' && { title: 'asc' }),
      ...(sortBy === 'year' && { year: 'desc' }),
      ...(sortBy === 'createdAt' && { createdAt: 'desc' }),
    } as any,
    skip: (currentPage - 1) * MOVIES_PER_PAGE,
    take: MOVIES_PER_PAGE,
  });

  // Общее количество фильмов
  const totalMovies = await db.movie.count({
    where: {
      status: 'APPROVED',
      ...(searchQuery && {
        OR: [
          { title: { contains: searchQuery } },
          { director: { contains: searchQuery } },
        ],
      }),
      ...(selectedGenre !== 'Все жанры' && {
        genres: {
          some: { genre: { name: selectedGenre } },
        },
      }),
    },
  });

  const totalPages = Math.ceil(totalMovies / MOVIES_PER_PAGE);

  // Преобразуем данные для карточек
  const moviesWithStats = movies.map((movie) => ({
    ...movie,
    genres: movie.genres.map((g) => ({ id: g.genre.id, name: g.genre.name })),
    avgRating: null,
    ratingsCount: 0,
    reviewsCount: 0,
    entry: null,
  }));

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Фильмы</h1>
          <p className="text-muted-foreground mt-1">{totalMovies} фильмов в каталоге</p>
        </div>
        <Button asChild>
          <Link href="/movies/add">
            <Plus className="mr-2 h-4 w-4" />
            Добавить фильм
          </Link>
        </Button>
      </div>

      {/* Поиск и фильтры */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Поиск */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск по названию или режиссёру..."
                className="pl-9"
                defaultValue={searchQuery}
                name="search"
              />
            </div>

            {/* Фильтр по жанру */}
            <Select name="genre" defaultValue={selectedGenre}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Жанр" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Все жанры">Все жанры</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.name}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Сортировка */}
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

      {/* Список фильмов */}
      {moviesWithStats.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {moviesWithStats.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery || selectedGenre !== 'Все жанры'
                ? 'Фильмы не найдены. Попробуйте изменить параметры поиска.'
                : 'Каталог фильмов пуст. Будьте первым, кто добавит фильм!'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {currentPage > 1 && (
            <Button variant="outline" asChild>
              <Link href={`/movies?page=${currentPage - 1}&search=${searchQuery}&genre=${selectedGenre}&sort=${sortBy}`}>
                Назад
              </Link>
            </Button>
          )}
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm text-muted-foreground">
              Страница {currentPage} из {totalPages}
            </span>
          </div>
          {currentPage < totalPages && (
            <Button variant="outline" asChild>
              <Link href={`/movies?page=${currentPage + 1}&search=${searchQuery}&genre=${selectedGenre}&sort=${sortBy}`}>
                Вперёд
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
