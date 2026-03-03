// ============================================================================
// ГЛАВНАЯ СТРАНИЦА (ХАБ) - Home Page
// ============================================================================
// Это первая страница, которую видит пользователь.
// Содержит:
// - Приветствие и краткое описание
// - Плитки-ссылки на трекеры (книги, фильмы)
// - Статистику из БД
//
// МАРШРУТ: /
// ============================================================================

import Link from 'next/link';
import { BookOpen, Film, TrendingUp, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';

// Функция загрузки статистики из БД
async function getStats() {
  const [totalBooks, totalMovies, totalUsers, totalReviews] = await Promise.all([
    db.book.count({ where: { status: 'APPROVED' } }),
    db.movie.count({ where: { status: 'APPROVED' } }),
    db.user.count(),
    db.review.count(),
  ]);

  return {
    totalBooks,
    totalMovies,
    totalUsers,
    totalReviews,
  };
}

/**
 * Главная страница приложения
 * Серверный компонент (async) - загружает данные с БД
 */
export default async function HomePage() {
  // Загрузка статистики из БД
  const stats = await getStats();

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* ===== HERO СЕКЦИЯ ===== */}
      <section className="text-center space-y-6 py-12">
        {/* Заголовок */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          Мультитрекер
        </h1>
        
        {/* Подзаголовок */}
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Отслеживайте прочитанные книги и просмотренные фильмы. 
          Ставьте оценки, пишите отзывы и делитесь впечатлениями.
        </p>

        {/* CTA кнопки */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button asChild size="lg">
            <Link href="/books">
              <BookOpen className="mr-2 h-5 w-5" />
              Книги
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/movies">
              <Film className="mr-2 h-5 w-5" />
              Фильмы
            </Link>
          </Button>
        </div>
      </section>

      {/* ===== ПЛИТКИ ТРЕКЕРОВ ===== */}
      <section className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Плитка книг */}
        <Link href="/books" className="group">
          <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    Книги
                  </CardTitle>
                  <CardDescription>
                    Дневник чтения
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Отмечайте прочитанные книги, ставьте оценки, пишите отзывы. 
                Следите за своим прогрессом в чтении.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Оценки
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Статистика
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Плитка фильмов */}
        <Link href="/movies" className="group">
          <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Film className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    Фильмы
                  </CardTitle>
                  <CardDescription>
                    Дневник просмотра
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Отмечайте просмотренные фильмы, ставьте оценки, пишите рецензии. 
                Находите новые фильмы для просмотра.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Оценки
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Статистика
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* ===== СТАТИСТИКА ===== */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-center mb-8">
          Статистика проекта
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-3xl font-bold">{stats.totalBooks}</div>
              <div className="text-sm text-muted-foreground">Книг в базе</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Film className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-3xl font-bold">{stats.totalMovies}</div>
              <div className="text-sm text-muted-foreground">Фильмов в базе</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Пользователей</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <div className="text-3xl font-bold">{stats.totalReviews}</div>
              <div className="text-sm text-muted-foreground">Отзывов</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== ФУНКЦИИ ===== */}
      <section className="py-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          Возможности
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📚 Отслеживание</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Отмечайте статус прочтения: &quot;Читаю&quot;, &quot;Прочитано&quot;, 
                &quot;На паузе&quot;, &quot;Не дочитал&quot;. Ведите персональный список.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⭐ Оценки</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ставьте оценки от 1 до 5 звёзд. Формируйте свой рейтинг 
                и смотрите среднюю оценку сообщества.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✍️ Отзывы</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Делитесь впечатлениями в отзывах. Читайте мнения других 
                пользователей и находите новые книги и фильмы.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}