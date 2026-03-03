import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });

    const user = await db.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });

    const [salt, hash] = user.password.split(':');
    if (!salt || !hash) return NextResponse.json({ error: 'Ошибка формата пароля' }, { status: 500 });

    const isValid = await verifyPassword(password, hash, salt);
    if (!isValid) return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });

    await createSession(user.id);

    return NextResponse.json({ message: 'Вход выполнен успешно', user: { id: user.id, email: user.email, nickname: user.nickname, avatar: user.avatar, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
