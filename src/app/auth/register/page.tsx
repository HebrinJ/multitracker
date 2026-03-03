'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [nickname, setNickname] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) { setError('Пароли не совпадают'); return; }
    if (password.length < 6) { setError('Пароль должен содержать минимум 6 символов'); return; }
    if (nickname.length < 2) { setError('Никнейм должен содержать минимум 2 символа'); return; }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, nickname }) });
      const data = await response.json();

      if (!response.ok) { setError(data.error || 'Ошибка регистрации'); return; }

      router.push('/');
      router.refresh();
    } catch { setError('Ошибка соединения с сервером'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><BookOpen className="h-8 w-8 text-primary" /></div></div>
          <CardTitle className="text-2xl">Регистрация</CardTitle>
          <CardDescription>Создайте аккаунт для доступа ко всем функциям</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}
            <div className="space-y-2"><Label htmlFor="nickname">Никнейм</Label><Input id="nickname" type="text" placeholder="Ваше имя" value={nickname} onChange={(e) => setNickname(e.target.value)} required disabled={isLoading} autoComplete="username" /></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} autoComplete="email" /></div>
            <div className="space-y-2"><Label htmlFor="password">Пароль</Label><Input id="password" type="password" placeholder="Минимум 6 символов" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} autoComplete="new-password" /></div>
            <div className="space-y-2"><Label htmlFor="confirmPassword">Подтвердите пароль</Label><Input id="confirmPassword" type="password" placeholder="Повторите пароль" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} autoComplete="new-password" /></div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Регистрация...</>) : 'Зарегистрироваться'}</Button>
            <p className="text-sm text-center text-muted-foreground">Уже есть аккаунт? <Link href="/auth/login" className="text-primary hover:underline">Войти</Link></p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
