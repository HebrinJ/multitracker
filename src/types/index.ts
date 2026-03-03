// Status types
export type BookStatus = 'NOT_READ' | 'READING' | 'COMPLETED' | 'ON_HOLD' | 'DROPPED';
export type MovieStatus = 'NOT_WATCHED' | 'WATCHING' | 'COMPLETED' | 'ON_HOLD' | 'DROPPED';
export type ContentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type UserRole = 'USER' | 'ADMIN';

// Labels
export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  NOT_READ: 'Не читал',
  READING: 'Читаю',
  COMPLETED: 'Прочитано',
  ON_HOLD: 'На паузе',
  DROPPED: 'Не дочитал',
};

export const MOVIE_STATUS_LABELS: Record<MovieStatus, string> = {
  NOT_WATCHED: 'Не смотрел',
  WATCHING: 'Смотрю',
  COMPLETED: 'Просмотрено',
  ON_HOLD: 'На паузе',
  DROPPED: 'Не досмотрел',
};

export const CAN_HAVE_RATING: Record<string, boolean> = {
  NOT_READ: false,
  READING: false,
  COMPLETED: true,
  ON_HOLD: false,
  DROPPED: true,
  NOT_WATCHED: false,
  WATCHING: false,
};

// Models
export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar: string | null;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number | null;
  genre: string | null;
  description: string | null;
  cover: string | null;
  addedById: string | null;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  avgRating?: number;
  ratingsCount?: number;
  reviewsCount?: number;
}

export interface BookEntry {
  id: string;
  userId: string;
  bookId: string;
  status: BookStatus;
  rating: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  book?: Book;
  user?: User;
}

export interface BookWithEntry extends Book {
  entry?: BookEntry | null;
}

export interface Movie {
  id: string;
  title: string;
  director: string;
  year: number | null;
  genre: string | null;
  description: string | null;
  poster: string | null;
  addedById: string | null;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  avgRating?: number;
  ratingsCount?: number;
  reviewsCount?: number;
}

export interface MovieEntry {
  id: string;
  userId: string;
  movieId: string;
  status: MovieStatus;
  rating: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  movie?: Movie;
  user?: User;
}

export interface MovieWithEntry extends Movie {
  entry?: MovieEntry | null;
}

export interface Review {
  id: string;
  userId: string;
  bookId: string | null;
  movieId: string | null;
  rating: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  book?: Book;
  movie?: Movie;
}
