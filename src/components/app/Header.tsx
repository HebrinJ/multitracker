'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Film, Home, Menu, X, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { LogoutButton } from './LogoutButton';

const NAV_LINKS = [
  { href: '/', label: 'Главная', icon: Home },
  { href: '/books', label: 'Книги', icon: BookOpen },
  { href: '/movies', label: 'Фильмы', icon: Film },
] as const;

interface HeaderProps {
  user?: { id: string; nickname: string; avatar: string | null } | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => { setIsMobileMenuOpen(false) }, [pathname]);

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity" aria-label="На главную">
              <Home className="h-6 w-6 text-primary" />
              <span className="hidden sm:inline">Мультитрекер</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Основная навигация">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link key={link.href} href={link.href} className={cn("flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent")} aria-current={active ? 'page' : undefined}>
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="Меню профиля">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar || ''} alt={user.nickname} />
                      <AvatarFallback>{user.nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.nickname}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Профиль</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <LogoutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm">
                <Link href="/auth/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Войти</span>
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={isMobileMenuOpen}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col gap-1" role="navigation" aria-label="Мобильная навигация">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link key={link.href} href={link.href} className={cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent")} aria-current={active ? 'page' : undefined}>
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export { Footer } from './Footer';
export { ThemeToggle } from './ThemeToggle';
export { RatingStars } from './RatingStars';
export { BookCard } from './BookCard';
export { MovieCard } from './MovieCard';
export { LogoutButton } from './LogoutButton';