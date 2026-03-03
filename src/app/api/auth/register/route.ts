import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, nickname } = body;

    if (!email || !password || !nickname) return NextResponse.json({ error: 'Все поля обязательны для заполнения' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Некорректный формат email' }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: 'Пароль должен содержать минимум 6 символов' }, { status: 400 });
    if (nickname.length < 2 || nickname.length > 50) return NextResponse.json({ error: 'Никнейм должен содержать от 2 до 50 символов' }, { status: 400 });

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 409 });

    const { hash, salt } = await hashPassword(password);
    const hashedPassword = `${salt}:${hash}`;

    const user = await db.user.create({ data: { email, password: hashedPassword, nickname, role: 'USER' } });

    await createSession(user.id);

    return NextResponse.json({ message: 'Регистрация успешна', user: { id: user.id, email: user.email, nickname: user.nickname, role: user.role } }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
