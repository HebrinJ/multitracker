'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
      <LogOut className="mr-2 h-4 w-4" />
      <span>Выйти</span>
    </DropdownMenuItem>
  );
}