
//src/app/api/auth/login/route.ts

import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/features/server/get-user-by-email';
import { createSessionCookie } from '@/shared/lib/auth';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim() ?? '';
    const password = body.password?.trim() ?? '';

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email и пароль обязательны.' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { message: 'Неверный email или пароль.' },
        { status: 401 }
      );
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { message: 'Пользователь недоступен.' },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Неверный email или пароль.' },
        { status: 401 }
      );
    }

    await createSessionCookie({
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('LOGIN ROUTE ERROR:', error);

    return NextResponse.json(
      { message: 'Ошибка авторизации.' },
      { status: 500 }
    );
  }
}

// src/app/api/auth/route.ts

import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/shared/lib/auth';

export async function POST() {
  await clearSessionCookie();

  return NextResponse.json({ ok: true });
}


// src/app/clients/[id]/page.tsx

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/shared/ui/app-shell';
import { getClientById } from '@/features/server/get-client-by-id';
import { ClientDetailsCard } from '@/features/clients/client-details';

type ClientPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  return (
    <AppShell>
      <section className="page-section">
        <div className="page-section__header">
          <div>
            <p className="page-section__eyebrow">CRM Module</p>
            <h1 className="page-section__title">{client.companyName}</h1>
          </div>

          <div className="page-actions">
            <Link href="/clients" className="secondary-link">
              ← Назад к клиентам
            </Link>
          </div>
        </div>

        <ClientDetailsCard client={client} />
      </section>
    </AppShell>
  );
}

// src/app/clients/page.tsx

import { AppShell } from '@/shared/ui/app-shell';
import { getClients } from '@/features/server/get-clients';
import { ClientsTable } from '@/features/clients/clients-table';

type ClientsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: 'all' | 'active' | 'inactive';
  }>;
};

export const dynamic = 'force-dynamic';

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams.search ?? '';
  const status = resolvedSearchParams.status ?? 'all';

  const clients = await getClients({
    search,
    status,
  });

  return (
    <AppShell>
      <section className="page-section">
        <div className="page-section__header">
          <div>
            <p className="page-section__eyebrow">CRM Module</p>
            <h1 className="page-section__title">Clients</h1>
          </div>

          <p className="page-section__description">
            Список клиентов из PostgreSQL с поиском и фильтрацией.
          </p>
        </div>

        <ClientsTable clients={clients} search={search} status={status} />
      </section>
    </AppShell>
  );
}

// src/app/login/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="auth-layout">
      <header className="auth-layout__header">
        <Link href="/" className="landing-brand">
          <Image
            src="/OrbisCRM.png"
            alt="Orbis CRM"
            width={180}
            height={44}
            className="landing-brand__image"
            priority
          />
        </Link>

        <div className="landing-header__actions">
          <Link href="/" className="landing-button landing-button--secondary">
            На главную
          </Link>
          <Link
            href="/login"
            className="landing-button landing-button--primary"
          >
            Зарегистрироваться
          </Link>
        </div>
      </header>

      <main className="auth-layout__main">
        <section className="auth-page">
          <div className="auth-card">
            <div className="auth-card__header">
              <p className="section-eyebrow">Authentication</p>
              <h1 className="section-title">Вход в Orbis CRM</h1>
              <p className="auth-card__description">
                Введите email и пароль, чтобы перейти в рабочее пространство.
              </p>
            </div>

            <form
              className="auth-form"
              onSubmit={async (event) => {
                event.preventDefault();

                const form = event.currentTarget;
                const formData = new FormData(form);

                const email = String(formData.get('email') ?? '');
                const password = String(formData.get('password') ?? '');

                const response = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email, password }),
                });

                const data = (await response.json()) as { message?: string };

                if (!response.ok) {
                  window.alert(data.message ?? 'Ошибка входа.');
                  return;
                }

                window.location.href = '/clients';
              }}
            >
              <div className="auth-form__field">
                <label htmlFor="email" className="clients-filters__label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="clients-filters__input"
                  placeholder="admin@orbis.com"
                  required
                />
              </div>

              <div className="auth-form__field">
                <label htmlFor="password" className="clients-filters__label">
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="clients-filters__input"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button auth-form__submit"
              >
                Войти
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

// src/app/orders/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/shared/ui/app-shell';
import { getOrderById } from '@/features/server/get-order-by-id';
import { OrderDetailsCard } from '@/features/orders/order-details';

type OrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <AppShell>
      <section className="page-section">
        <div className="page-section__header">
          <div>
            <p className="page-section__eyebrow">CRM Module</p>
            <h1 className="page-section__title">{order.orderNumber}</h1>
          </div>

          <div className="page-actions">
            <Link href="/orders" className="secondary-link">
              ← Назад к заказам
            </Link>
          </div>
        </div>

        <OrderDetailsCard order={order} />
      </section>
    </AppShell>
  );
}

// src/app/orders/page.tsx
import { AppShell } from '@/shared/ui/app-shell';
import { getOrders } from '@/features/server/get-orders';
import { OrdersTable } from '@/features/orders/orders-table';

type OrdersPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams.search ?? '';
  const status = resolvedSearchParams.status ?? 'all';

  const orders = await getOrders({
    search,
    status,
  });

  return (
    <AppShell>
      <section className="page-section">
        <div className="page-section__header">
          <div>
            <p className="page-section__eyebrow">CRM Module</p>
            <h1 className="page-section__title">Orders</h1>
          </div>

          <p className="page-section__description">
            Список заказов из PostgreSQL с поиском и фильтрацией по статусу.
          </p>
        </div>

        <OrdersTable orders={orders} search={search} status={status} />
      </section>
    </AppShell>
  );
}

// src/app/tasks/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTaskById } from '@/features/server/get-task-by-id';
import { TaskDetailsCard } from '@/features/tasks/task-details';

type TaskPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;
  const task = await getTaskById(id);

  if (!task) {
    notFound();
  }

  return (
    <section className="page-section">
      <div className="page-section__header">
        <div>
          <p className="page-section__eyebrow">CRM Module</p>
          <h1 className="page-section__title">{task.title}</h1>
        </div>

        <div className="page-actions">
          <Link href="/tasks" className="secondary-link">
            ← Назад к задачам
          </Link>
        </div>
      </div>

      <TaskDetailsCard task={task} />
    </section>
  );
}

// src/app/tasks/page.tsx
import { getTasks } from '@/features/server/get-tasks';
import { TasksTable } from '@/features/tasks/tasks-table';

type TasksPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams.search ?? '';
  const status = resolvedSearchParams.status ?? 'all';

  const tasks = await getTasks({
    search,
    status,
  });

  return (
    <section className="page-section">
      <div className="page-section__header">
        <div>
          <p className="page-section__eyebrow">CRM Module</p>
          <h1 className="page-section__title">Tasks</h1>
        </div>

        <p className="page-section__description">
          Список задач из PostgreSQL с поиском и фильтрацией по статусу.
        </p>
      </div>

      <TasksTable tasks={tasks} search={search} status={status} />
    </section>
  );
}

// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Orbis CRM',
  description: 'B2B admin system for clients, orders and tasks',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

// src/app/page.tsx
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: 'Клиенты',
    description:
      'Храните всю информацию о клиентах, контактах и адресах в одном месте.',
  },
  {
    title: 'Заказы',
    description:
      'Контролируйте статусы, суммы, дедлайны и весь цикл работы по заказам.',
  },
  {
    title: 'Задачи',
    description:
      'Отслеживайте операционные задачи, исполнителей и приоритеты команды.',
  },
  {
    title: 'Аудит',
    description:
      'Сохраняйте прозрачность процессов и историю ключевых действий в системе.',
  },
];

export default function HomePage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <Link href="/" className="landing-brand">
          <Image
            src="/OrbisCRM.png"
            alt="Orbis CRM"
            width={180}
            height={44}
            className="landing-brand__image"
            priority
          />
        </Link>

        <div className="landing-header__actions">
          <Link
            href="/login"
            className="landing-button landing-button--secondary"
          >
            Войти
          </Link>
          <Link
            href="/login"
            className="landing-button landing-button--primary"
          >
            Зарегистрироваться
          </Link>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-section__content">
            <div className="hero-badge">B2B CRM ПЛАТФОРМА</div>

            <h1 className="hero-title">
              Управляйте бизнесом
              <br />
              <span>в одном пространстве</span>
            </h1>

            <p className="hero-description">
              Orbis CRM — современная система для управления клиентами,
              заказами, задачами и внутренними процессами компании.
            </p>

            <div className="hero-actions">
              <Link
                href="/login"
                className="landing-button landing-button--primary landing-button--large"
              >
                Начать работу
              </Link>
              <a
                href="#features"
                className="landing-button landing-button--secondary landing-button--large"
              >
                Узнать больше
              </a>
            </div>
          </div>

          <div className="hero-section__visual">
            <div className="hero-orbit">
              <Image
                src="/OrbisCRM.png"
                alt="Orbis CRM visual"
                width={520}
                height={520}
                className="hero-orbit__image"
                priority
              />
            </div>
          </div>
        </section>

        <section id="features" className="landing-section">
          <div className="landing-section__header">
            <p className="section-eyebrow">Возможности</p>
            <h2 className="section-title landing-section__title">
              Всё, что нужно для ежедневной работы CRM
            </h2>
          </div>

          <div className="landing-features-grid">
            {features.map((feature) => (
              <article key={feature.title} className="landing-feature-card">
                <h3 className="landing-feature-card__title">{feature.title}</h3>
                <p className="landing-feature-card__text">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-stats">
          <div className="landing-stats__card">
            <div>
              <p className="landing-stats__label">Безопасность и надёжность</p>
              <p className="landing-stats__text">
                Архитектура системы спроектирована так, чтобы бизнес-данные были
                централизованы, прозрачны и удобны в ежедневной работе.
              </p>
            </div>

            <div className="landing-stats__metrics">
              <div className="landing-metric">
                <strong>Clients</strong>
                <span>единая база клиентов и контактов</span>
              </div>
              <div className="landing-metric">
                <strong>Orders</strong>
                <span>контроль заказов и статусов</span>
              </div>
              <div className="landing-metric">
                <strong>Tasks</strong>
                <span>управление задачами команды</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// src/features/clients/client-details.tsx
import type { ClientDetails } from '@/types/types';

type ClientDetailsProps = {
  client: ClientDetails;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

function getAddressTypeLabel(type: 'legal' | 'billing' | 'shipping' | 'office') {
  switch (type) {
    case 'legal':
      return 'Юридический';
    case 'billing':
      return 'Платёжный';
    case 'shipping':
      return 'Доставка';
    case 'office':
      return 'Офис';
    default:
      return type;
  }
}

export function ClientDetailsCard({ client }: ClientDetailsProps) {
  return (
    <div className="client-details">
      <div className="details-grid">
        <section className="details-card">
          <p className="section-eyebrow">Client overview</p>
          <h2 className="section-title">{client.companyName}</h2>

          <div className="details-list">
            <div className="details-list__item">
              <span className="details-list__label">ID</span>
              <span className="details-list__value">{client.clientId}</span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Юридическое имя</span>
              <span className="details-list__value">{client.legalName ?? '—'}</span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Tax ID</span>
              <span className="details-list__value">{client.taxId ?? '—'}</span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Индустрия</span>
              <span className="details-list__value">{client.industry ?? '—'}</span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Website</span>
              <span className="details-list__value">
                {client.website ? (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    {client.website}
                  </a>
                ) : (
                  '—'
                )}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Статус</span>
              <span className="details-list__value">
                {client.isActive ? 'active' : 'inactive'}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Создан</span>
              <span className="details-list__value">{formatDate(client.createdAt)}</span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Обновлён</span>
              <span className="details-list__value">{formatDate(client.updatedAt)}</span>
            </div>
          </div>

          <div className="details-description">
            <h3 className="details-subtitle">Описание</h3>
            <p>{client.description ?? 'Описание отсутствует.'}</p>
          </div>
        </section>

        <section className="details-card">
          <p className="section-eyebrow">Primary contact</p>
          <h2 className="section-title">Основной контакт</h2>

          <div className="details-list">
            <div className="details-list__item">
              <span className="details-list__label">Имя</span>
              <span className="details-list__value">
                {client.primaryContactName ?? '—'}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Email</span>
              <span className="details-list__value">
                {client.primaryContactEmail ?? '—'}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Телефон</span>
              <span className="details-list__value">
                {client.primaryContactPhone ?? '—'}
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className="details-card">
        <p className="section-eyebrow">Addresses</p>
        <h2 className="section-title">Адреса</h2>

        {client.addresses.length === 0 ? (
          <p className="empty-inline">Адреса не найдены.</p>
        ) : (
          <div className="details-blocks">
            {client.addresses.map((address) => (
              <div key={address.addressId} className="details-block">
                <div className="details-block__header">
                  <strong>{getAddressTypeLabel(address.addressType)}</strong>
                </div>

                <div className="details-block__content">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 ? <p>{address.addressLine2}</p> : null}
                  <p>
                    {address.city ?? '—'}
                    {address.stateRegion ? `, ${address.stateRegion}` : ''}
                  </p>
                  <p>
                    {address.country ?? '—'}
                    {address.postalCode ? `, ${address.postalCode}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="details-card">
        <p className="section-eyebrow">Recent notes</p>
        <h2 className="section-title">Последние заметки</h2>

        {client.notes.length === 0 ? (
          <p className="empty-inline">Заметки отсутствуют.</p>
        ) : (
          <div className="notes-list">
            {client.notes.map((note) => (
              <article key={note.noteId} className="note-card">
                <div className="note-card__meta">
                  <span>{note.authorFullName}</span>
                  <span>{formatDate(note.createdAt)}</span>
                  <span>{note.isInternal ? 'internal' : 'public'}</span>
                </div>

                <p className="note-card__content">{note.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// src/features/clients/clients-table.tsx
import Link from 'next/link';
import type { Client } from '@/types/types';

type ClientsTableProps = {
  clients: Client[];
  search: string;
  status: 'all' | 'active' | 'inactive';
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function ClientsTable({
  clients,
  search,
  status,
}: ClientsTableProps) {
  return (
    <div className="data-card">
      <div className="data-card__header">
        <div>
          <p className="section-eyebrow">Clients</p>
          <h2 className="section-title">Список клиентов</h2>
        </div>

        <div className="section-meta">
          Всего: <strong>{clients.length}</strong>
        </div>
      </div>

      <div className="clients-filters">
        <form action="/clients" method="get" className="clients-filters__form">
          <div className="clients-filters__field">
            <label htmlFor="search" className="clients-filters__label">
              Поиск по компании
            </label>
            <input
              id="search"
              name="search"
              type="text"
              defaultValue={search}
              placeholder="Например: Acme"
              className="clients-filters__input"
            />
          </div>

          <div className="clients-filters__field">
            <label htmlFor="status" className="clients-filters__label">
              Активность
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className="clients-filters__select"
            >
              <option value="all">Все</option>
              <option value="active">Только active</option>
              <option value="inactive">Только inactive</option>
            </select>
          </div>

          <div className="clients-filters__actions">
            <button type="submit" className="primary-button">
              Применить
            </button>

            <Link href="/clients" className="secondary-link">
              Сбросить
            </Link>
          </div>
        </form>
      </div>

      {clients.length === 0 ? (
        <div className="empty-state empty-state--inside-card">
          <h2 className="empty-state__title">Клиенты не найдены</h2>
          <p className="empty-state__text">
            По текущим параметрам поиска и фильтрации записи отсутствуют.
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Компания</th>
                <th>Контакт</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Индустрия</th>
                <th>Активность</th>
                <th>Создан</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr key={client.clientId}>
                  <td>{client.clientId}</td>
                  <td>
                    <Link
                      href={`/clients/${client.clientId}`}
                      className="table-link"
                    >
                      {client.companyName}
                    </Link>
                  </td>
                  <td>{client.primaryContactName ?? '—'}</td>
                  <td>{client.primaryContactEmail ?? '—'}</td>
                  <td>{client.primaryContactPhone ?? '—'}</td>
                  <td>{client.industry ?? '—'}</td>
                  <td>{client.isActive ? 'active' : 'inactive'}</td>
                  <td>{formatDate(client.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// src/features/orders/order-details.tsx
import Link from 'next/link';
import type { OrderDetails } from '@/types/types';

type OrderDetailsProps = {
  order: OrderDetails;
};

function formatDate(date: string | null) {
  if (!date) {
    return '—';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

function formatAmount(value: string, currencyCode: string) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return `${value} ${currencyCode}`;
  }

  return (
    new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ` ${currencyCode}`
  );
}

function getStatusClass(statusCode: string) {
  switch (statusCode) {
    case 'new':
      return 'status-badge status-badge--lead';
    case 'in_progress':
      return 'status-badge status-badge--active';
    case 'waiting_for_client':
      return 'status-badge status-badge--inactive';
    case 'completed':
      return 'status-badge status-badge--active';
    case 'cancelled':
      return 'status-badge status-badge--archived';
    default:
      return 'status-badge status-badge--inactive';
  }
}

function getPriorityClass(priorityCode: string | null) {
  switch (priorityCode) {
    case 'urgent':
      return 'priority-badge priority-badge--urgent';
    case 'high':
      return 'priority-badge priority-badge--high';
    case 'medium':
      return 'priority-badge priority-badge--medium';
    case 'low':
      return 'priority-badge priority-badge--low';
    default:
      return 'priority-badge priority-badge--default';
  }
}

export function OrderDetailsCard({ order }: OrderDetailsProps) {
  return (
    <div className="client-details">
      <div className="details-grid">
        <section className="details-card">
          <p className="section-eyebrow">Order overview</p>
          <h2 className="section-title">{order.title}</h2>

          <div className="details-list">
            <div className="details-list__item">
              <span className="details-list__label">ID</span>
              <span className="details-list__value">{order.orderId}</span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Номер заказа</span>
              <span className="details-list__value">{order.orderNumber}</span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Клиент</span>
              <span className="details-list__value">
                <Link href={`/clients/${order.clientId}`} className="text-link">
                  {order.clientName}
                </Link>
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Статус</span>
              <span className="details-list__value">
                <span className={getStatusClass(order.statusCode)}>
                  {order.statusName}
                </span>
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Приоритет</span>
              <span className="details-list__value">
                <span className={getPriorityClass(order.priorityCode)}>
                  {order.priorityName ?? '—'}
                </span>
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Сумма</span>
              <span className="details-list__value">
                {formatAmount(order.totalAmount, order.currencyCode)}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Дедлайн</span>
              <span className="details-list__value">
                {formatDate(order.dueDate)}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Создан</span>
              <span className="details-list__value">
                {formatDate(order.createdAt)}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Обновлён</span>
              <span className="details-list__value">
                {formatDate(order.updatedAt)}
              </span>
            </div>
          </div>

          <div className="details-description">
            <h3 className="details-subtitle">Описание</h3>
            <p>{order.description ?? 'Описание отсутствует.'}</p>
          </div>
        </section>

        <section className="details-card">
          <p className="section-eyebrow">Order summary</p>
          <h2 className="section-title">Сводка</h2>

          <div className="details-list">
            <div className="details-list__item">
              <span className="details-list__label">Количество позиций</span>
              <span className="details-list__value">{order.items.length}</span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Комментариев</span>
              <span className="details-list__value">
                {order.comments.length}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Валюта</span>
              <span className="details-list__value">{order.currencyCode}</span>
            </div>
          </div>
        </section>
      </div>

      <section className="details-card">
        <p className="section-eyebrow">Order items</p>
        <h2 className="section-title">Позиции заказа</h2>

        {order.items.length === 0 ? (
          <p className="empty-inline">Позиции заказа отсутствуют.</p>
        ) : (
          <div className="table-wrap order-items-table">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Товар / услуга</th>
                  <th>Описание</th>
                  <th>Количество</th>
                  <th>Цена</th>
                  <th>Сумма</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item) => (
                  <tr key={item.orderItemId}>
                    <td>{item.productName}</td>
                    <td>{item.description ?? '—'}</td>
                    <td>{item.quantity}</td>
                    <td>{formatAmount(item.unitPrice, order.currencyCode)}</td>
                    <td>{formatAmount(item.totalPrice, order.currencyCode)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="details-card">
        <p className="section-eyebrow">Recent comments</p>
        <h2 className="section-title">Последние комментарии</h2>

        {order.comments.length === 0 ? (
          <p className="empty-inline">Комментарии отсутствуют.</p>
        ) : (
          <div className="notes-list">
            {order.comments.map((comment) => (
              <article key={comment.orderCommentId} className="note-card">
                <div className="note-card__meta">
                  <span>{comment.authorFullName}</span>
                  <span>{formatDate(comment.createdAt)}</span>
                  <span>{comment.isInternal ? 'internal' : 'public'}</span>
                </div>

                <p className="note-card__content">{comment.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// src/features/orders/orders-table.tsx
/* eslint-disable @next/next/no-html-link-for-pages */
import type { OrderListItem } from '@/types/types';

type OrdersTableProps = {
  orders: OrderListItem[];
  search: string;
  status: string;
};

function formatDate(date: string | null) {
  if (!date) {
    return '—';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

function formatAmount(value: string, currencyCode: string) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return `${value} ${currencyCode}`;
  }

  return (
    new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ` ${currencyCode}`
  );
}

function getStatusClass(statusCode: string) {
  switch (statusCode) {
    case 'new':
      return 'status-badge status-badge--lead';
    case 'in_progress':
      return 'status-badge status-badge--active';
    case 'waiting_for_client':
      return 'status-badge status-badge--inactive';
    case 'completed':
      return 'status-badge status-badge--active';
    case 'cancelled':
      return 'status-badge status-badge--archived';
    default:
      return 'status-badge status-badge--inactive';
  }
}

function getPriorityClass(priorityCode: string | null) {
  switch (priorityCode) {
    case 'urgent':
      return 'priority-badge priority-badge--urgent';
    case 'high':
      return 'priority-badge priority-badge--high';
    case 'medium':
      return 'priority-badge priority-badge--medium';
    case 'low':
      return 'priority-badge priority-badge--low';
    default:
      return 'priority-badge priority-badge--default';
  }
}

export function OrdersTable({ orders, search, status }: OrdersTableProps) {
  return (
    <div className="data-card">
      <div className="data-card__header">
        <div>
          <p className="section-eyebrow">Orders</p>
          <h2 className="section-title">Список заказов</h2>
        </div>

        <div className="section-meta">
          Всего: <strong>{orders.length}</strong>
        </div>
      </div>

      <div className="clients-filters">
        <form action="/orders" method="get" className="clients-filters__form">
          <div className="clients-filters__field">
            <label htmlFor="search" className="clients-filters__label">
              Поиск по номеру или названию
            </label>
            <input
              id="search"
              name="search"
              type="text"
              defaultValue={search}
              placeholder="Например: ORD-1001 или Website redesign"
              className="clients-filters__input"
            />
          </div>

          <div className="clients-filters__field">
            <label htmlFor="status" className="clients-filters__label">
              Статус
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className="clients-filters__select"
            >
              <option value="all">Все</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_for_client">Waiting for Client</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="clients-filters__actions">
            <button type="submit" className="primary-button">
              Применить
            </button>
            <a href="/orders" className="secondary-link">
              Сбросить
            </a>
          </div>
        </form>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state empty-state--inside-card">
          <h2 className="empty-state__title">Заказы не найдены</h2>
          <p className="empty-state__text">
            По текущим параметрам поиска и фильтрации записи отсутствуют.
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Номер</th>
                <th>Название</th>
                <th>Клиент</th>
                <th>Статус</th>
                <th>Приоритет</th>
                <th>Сумма</th>
                <th>Дедлайн</th>
                <th>Создан</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderNumber}</td>
                  <td>{order.title}</td>
                  <td>{order.clientName}</td>
                  <td>
                    <span className={getStatusClass(order.statusCode)}>
                      {order.statusName}
                    </span>
                  </td>
                  <td>
                    <span className={getPriorityClass(order.priorityCode)}>
                      {order.priorityName ?? '—'}
                    </span>
                  </td>
                  <td>{formatAmount(order.totalAmount, order.currencyCode)}</td>
                  <td>{formatDate(order.dueDate)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// src/features/orders/page.tsx
import { getOrders } from '@/features/server/get-orders';
import { OrdersTable } from '@/features/orders/orders-table';

type OrdersPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams.search ?? '';
  const status = resolvedSearchParams.status ?? 'all';

  const orders = await getOrders({
    search,
    status,
  });

  return (
    <section className="page-section">
      <div className="page-section__header">
        <div>
          <p className="page-section__eyebrow">CRM Module</p>
          <h1 className="page-section__title">Orders</h1>
        </div>

        <p className="page-section__description">
          Список заказов из PostgreSQL с поиском и фильтрацией по статусу.
        </p>
      </div>

      <OrdersTable orders={orders} search={search} status={status} />
    </section>
  );
}

// src/features/server/get-client-by-id.ts
import 'server-only';
import { pool } from '@/shared/lib/db';
import type { ClientAddress, ClientDetails, ClientNote } from '@/types/types';

type ClientBaseRow = {
  client_id: string;
  company_name: string;
  legal_name: string | null;
  tax_id: string | null;
  website: string | null;
  industry: string | null;
  description: string | null;
  is_active: boolean;
  archived_at: Date | null;
  created_at: Date;
  updated_at: Date;
  manager_id: string | null;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
};

type ClientAddressRow = {
  address_id: string;
  address_type: 'legal' | 'billing' | 'shipping' | 'office';
  country: string | null;
  city: string | null;
  state_region: string | null;
  postal_code: string | null;
  address_line_1: string;
  address_line_2: string | null;
};

type ClientNoteRow = {
  note_id: string;
  content: string;
  is_internal: boolean;
  created_at: Date;
  author_full_name: string;
};

export async function getClientById(clientId: string): Promise<ClientDetails | null> {
  const clientQuery = `
    SELECT
      c.client_id,
      c.company_name,
      c.legal_name,
      c.tax_id,
      c.website,
      c.industry,
      c.description,
      c.is_active,
      c.archived_at,
      c.created_at,
      c.updated_at,
      c.manager_id,
      CASE
        WHEN cc.contact_id IS NOT NULL
        THEN CONCAT(
          cc.first_name,
          CASE
            WHEN cc.last_name IS NOT NULL AND length(trim(cc.last_name)) > 0
            THEN ' ' || cc.last_name
            ELSE ''
          END
        )
        ELSE NULL
      END AS primary_contact_name,
      cc.email AS primary_contact_email,
      cc.phone AS primary_contact_phone
    FROM clients c
    LEFT JOIN client_contacts cc
      ON cc.client_id = c.client_id
      AND cc.is_primary = TRUE
      AND cc.deleted_at IS NULL
    WHERE c.client_id = $1
      AND c.deleted_at IS NULL
    LIMIT 1
  `;

  const clientResult = await pool.query<ClientBaseRow>(clientQuery, [clientId]);

  if (clientResult.rows.length === 0) {
    return null;
  }

  const clientRow = clientResult.rows[0];

  const addressesQuery = `
    SELECT
      address_id,
      address_type,
      country,
      city,
      state_region,
      postal_code,
      address_line_1,
      address_line_2
    FROM client_addresses
    WHERE client_id = $1
      AND deleted_at IS NULL
    ORDER BY created_at DESC
  `;

  const notesQuery = `
    SELECT
      cn.note_id,
      cn.content,
      cn.is_internal,
      cn.created_at,
      CONCAT(u.first_name, ' ', u.last_name) AS author_full_name
    FROM client_notes cn
    INNER JOIN users u
      ON u.user_id = cn.author_id
    WHERE cn.client_id = $1
      AND cn.deleted_at IS NULL
    ORDER BY cn.created_at DESC
    LIMIT 5
  `;

  const [addressesResult, notesResult] = await Promise.all([
    pool.query<ClientAddressRow>(addressesQuery, [clientId]),
    pool.query<ClientNoteRow>(notesQuery, [clientId]),
  ]);

  const addresses: ClientAddress[] = addressesResult.rows.map((row) => ({
    addressId: row.address_id,
    addressType: row.address_type,
    country: row.country,
    city: row.city,
    stateRegion: row.state_region,
    postalCode: row.postal_code,
    addressLine1: row.address_line_1,
    addressLine2: row.address_line_2,
  }));

  const notes: ClientNote[] = notesResult.rows.map((row) => ({
    noteId: row.note_id,
    content: row.content,
    isInternal: row.is_internal,
    createdAt: row.created_at.toISOString(),
    authorFullName: row.author_full_name,
  }));

  return {
    clientId: clientRow.client_id,
    companyName: clientRow.company_name,
    legalName: clientRow.legal_name,
    taxId: clientRow.tax_id,
    website: clientRow.website,
    industry: clientRow.industry,
    description: clientRow.description,
    isActive: clientRow.is_active,
    archivedAt: clientRow.archived_at ? clientRow.archived_at.toISOString() : null,
    createdAt: clientRow.created_at.toISOString(),
    updatedAt: clientRow.updated_at.toISOString(),
    managerId: clientRow.manager_id,
    primaryContactName: clientRow.primary_contact_name,
    primaryContactEmail: clientRow.primary_contact_email,
    primaryContactPhone: clientRow.primary_contact_phone,
    addresses,
    notes,
  };
}


// src/features/server/get-clients.ts
import 'server-only';
import { pool } from '@/shared/lib/db';
import type { Client } from '@/types/types';

type GetClientsParams = {
  search?: string;
  status?: 'all' | 'active' | 'inactive';
};

type DbClientRow = {
  client_id: string;
  company_name: string;
  legal_name: string | null;
  tax_id: string | null;
  website: string | null;
  industry: string | null;
  is_active: boolean;
  archived_at: Date | null;
  created_at: Date;
  updated_at: Date;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
};

export async function getClients(params?: GetClientsParams): Promise<Client[]> {
  const search = params?.search?.trim() ?? '';
  const status = params?.status ?? 'all';

  const values: Array<string | boolean> = [];
  const conditions: string[] = ['c.deleted_at IS NULL'];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`c.company_name ILIKE $${values.length}`);
  }

  if (status === 'active') {
    values.push(true);
    conditions.push(`c.is_active = $${values.length}`);
  }

  if (status === 'inactive') {
    values.push(false);
    conditions.push(`c.is_active = $${values.length}`);
  }

  const query = `
    SELECT
      c.client_id,
      c.company_name,
      c.legal_name,
      c.tax_id,
      c.website,
      c.industry,
      c.is_active,
      c.archived_at,
      c.created_at,
      c.updated_at,
      CASE
        WHEN cc.contact_id IS NOT NULL
        THEN CONCAT(
          cc.first_name,
          CASE
            WHEN cc.last_name IS NOT NULL AND length(trim(cc.last_name)) > 0
            THEN ' ' || cc.last_name
            ELSE ''
          END
        )
        ELSE NULL
      END AS primary_contact_name,
      cc.email AS primary_contact_email,
      cc.phone AS primary_contact_phone
    FROM clients c
    LEFT JOIN client_contacts cc
      ON cc.client_id = c.client_id
      AND cc.is_primary = TRUE
      AND cc.deleted_at IS NULL
    WHERE ${conditions.join(' AND ')}
    ORDER BY c.created_at DESC
  `;

  const result = await pool.query<DbClientRow>(query, values);

  return result.rows.map((row: DbClientRow) => ({
    clientId: row.client_id,
    companyName: row.company_name,
    legalName: row.legal_name,
    taxId: row.tax_id,
    website: row.website,
    industry: row.industry,
    isActive: row.is_active,
    archivedAt: row.archived_at ? row.archived_at.toISOString() : null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    primaryContactName: row.primary_contact_name,
    primaryContactEmail: row.primary_contact_email,
    primaryContactPhone: row.primary_contact_phone,
  }));
}

// src/features/server/get-order-by-id.ts
import 'server-only';
import { pool } from '@/shared/lib/db';
import type { OrderComment, OrderDetails, OrderItem } from '@/types/types';

type OrderBaseRow = {
  order_id: string;
  order_number: string;
  client_id: string;
  client_name: string;
  status_code: string;
  status_name: string;
  priority_code: string | null;
  priority_name: string | null;
  title: string;
  description: string | null;
  total_amount: string;
  currency_code: string;
  due_date: Date | null;
  created_at: Date;
  updated_at: Date;
  assigned_manager_id: string | null;
};

type OrderItemRow = {
  order_item_id: string;
  product_name: string;
  description: string | null;
  quantity: string;
  unit_price: string;
  total_price: string;
};

type OrderCommentRow = {
  order_comment_id: string;
  content: string;
  is_internal: boolean;
  created_at: Date;
  author_full_name: string;
};

export async function getOrderById(orderId: string): Promise<OrderDetails | null> {
  const orderQuery = `
    SELECT
      o.order_id,
      o.order_number,
      o.client_id,
      c.company_name AS client_name,
      os.status_code,
      os.status_name,
      p.priority_code,
      p.priority_name,
      o.title,
      o.description,
      o.total_amount::text,
      o.currency_code,
      o.due_date,
      o.created_at,
      o.updated_at,
      o.assigned_manager_id
    FROM orders o
    INNER JOIN clients c
      ON c.client_id = o.client_id
    INNER JOIN order_statuses os
      ON os.order_status_id = o.order_status_id
    LEFT JOIN priorities p
      ON p.priority_id = o.priority_id
    WHERE o.order_id = $1
      AND o.deleted_at IS NULL
    LIMIT 1
  `;

  const orderResult = await pool.query<OrderBaseRow>(orderQuery, [orderId]);

  if (orderResult.rows.length === 0) {
    return null;
  }

  const orderRow = orderResult.rows[0];

  const itemsQuery = `
    SELECT
      order_item_id,
      product_name,
      description,
      quantity::text,
      unit_price::text,
      total_price::text
    FROM order_items
    WHERE order_id = $1
    ORDER BY created_at ASC
  `;

  const commentsQuery = `
    SELECT
      oc.order_comment_id,
      oc.content,
      oc.is_internal,
      oc.created_at,
      CONCAT(u.first_name, ' ', u.last_name) AS author_full_name
    FROM order_comments oc
    INNER JOIN users u
      ON u.user_id = oc.author_id
    WHERE oc.order_id = $1
      AND oc.deleted_at IS NULL
    ORDER BY oc.created_at DESC
    LIMIT 5
  `;

  const [itemsResult, commentsResult] = await Promise.all([
    pool.query<OrderItemRow>(itemsQuery, [orderId]),
    pool.query<OrderCommentRow>(commentsQuery, [orderId]),
  ]);

  const items: OrderItem[] = itemsResult.rows.map((row) => ({
    orderItemId: row.order_item_id,
    productName: row.product_name,
    description: row.description,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    totalPrice: row.total_price,
  }));

  const comments: OrderComment[] = commentsResult.rows.map((row) => ({
    orderCommentId: row.order_comment_id,
    content: row.content,
    isInternal: row.is_internal,
    createdAt: row.created_at.toISOString(),
    authorFullName: row.author_full_name,
  }));

  return {
    orderId: orderRow.order_id,
    orderNumber: orderRow.order_number,
    clientId: orderRow.client_id,
    clientName: orderRow.client_name,
    statusCode: orderRow.status_code,
    statusName: orderRow.status_name,
    priorityCode: orderRow.priority_code,
    priorityName: orderRow.priority_name,
    title: orderRow.title,
    description: orderRow.description,
    totalAmount: orderRow.total_amount,
    currencyCode: orderRow.currency_code,
    dueDate: orderRow.due_date ? orderRow.due_date.toISOString() : null,
    createdAt: orderRow.created_at.toISOString(),
    updatedAt: orderRow.updated_at.toISOString(),
    assignedManagerId: orderRow.assigned_manager_id,
    items,
    comments,
  };
}

// src/features/server/get-orders.ts
import 'server-only';
import { pool } from '@/shared/lib/db';
import type { OrderListItem } from '@/types/types';

type GetOrdersParams = {
  search?: string;
  status?: string;
};

type DbOrderRow = {
  order_id: string;
  order_number: string;
  client_id: string;
  client_name: string;
  status_code: string;
  status_name: string;
  priority_code: string | null;
  priority_name: string | null;
  title: string;
  total_amount: string;
  currency_code: string;
  due_date: Date | null;
  created_at: Date;
  assigned_manager_id: string | null;
};

export async function getOrders(
  params?: GetOrdersParams
): Promise<OrderListItem[]> {
  const search = params?.search?.trim() ?? '';
  const status = params?.status?.trim() ?? 'all';

  const values: string[] = [];
  const conditions: string[] = ['o.deleted_at IS NULL'];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`
      (
        o.order_number ILIKE $${values.length}
        OR o.title ILIKE $${values.length}
      )
    `);
  }

  if (status !== 'all') {
    values.push(status);
    conditions.push(`os.status_code = $${values.length}`);
  }

  const query = `
    SELECT
      o.order_id,
      o.order_number,
      o.client_id,
      c.company_name AS client_name,
      os.status_code,
      os.status_name,
      p.priority_code,
      p.priority_name,
      o.title,
      o.total_amount::text,
      o.currency_code,
      o.due_date,
      o.created_at,
      o.assigned_manager_id
    FROM orders o
    INNER JOIN clients c
      ON c.client_id = o.client_id
    INNER JOIN order_statuses os
      ON os.order_status_id = o.order_status_id
    LEFT JOIN priorities p
      ON p.priority_id = o.priority_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY o.created_at DESC
  `;

  const result = await pool.query<DbOrderRow>(query, values);

  return result.rows.map((row) => ({
    orderId: row.order_id,
    orderNumber: row.order_number,
    clientId: row.client_id,
    clientName: row.client_name,
    statusCode: row.status_code,
    statusName: row.status_name,
    priorityCode: row.priority_code,
    priorityName: row.priority_name,
    title: row.title,
    totalAmount: row.total_amount,
    currencyCode: row.currency_code,
    dueDate: row.due_date ? row.due_date.toISOString() : null,
    createdAt: row.created_at.toISOString(),
    assignedManagerId: row.assigned_manager_id,
  }));
}

// src/features/server/get-task-by-id.ts
import 'server-only';
import { pool } from '@/shared/lib/db';
import type { TaskComment, TaskDetails } from '@/types/types';

type TaskBaseRow = {
  task_id: string;
  title: string;
  description: string | null;
  client_id: string | null;
  client_name: string | null;
  order_id: string | null;
  order_number: string | null;
  status_code: string;
  status_name: string;
  priority_code: string | null;
  priority_name: string | null;
  assignee_id: string | null;
  assignee_full_name: string | null;
  created_by: string;
  created_by_full_name: string;
  due_date: Date | null;
  created_at: Date;
  updated_at: Date;
};

type TaskCommentRow = {
  task_comment_id: string;
  content: string;
  is_internal: boolean;
  created_at: Date;
  author_full_name: string;
};

export async function getTaskById(taskId: string): Promise<TaskDetails | null> {
  const taskQuery = `
    SELECT
      t.task_id,
      t.title,
      t.description,
      t.client_id,
      c.company_name AS client_name,
      t.order_id,
      o.order_number,
      ts.status_code,
      ts.status_name,
      p.priority_code,
      p.priority_name,
      t.assignee_id,
      CASE
        WHEN assignee.user_id IS NOT NULL
        THEN CONCAT(assignee.first_name, ' ', assignee.last_name)
        ELSE NULL
      END AS assignee_full_name,
      t.created_by,
      CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_full_name,
      t.due_date,
      t.created_at,
      t.updated_at
    FROM tasks t
    INNER JOIN task_statuses ts
      ON ts.task_status_id = t.task_status_id
    LEFT JOIN priorities p
      ON p.priority_id = t.priority_id
    LEFT JOIN clients c
      ON c.client_id = t.client_id
    LEFT JOIN orders o
      ON o.order_id = t.order_id
    LEFT JOIN users assignee
      ON assignee.user_id = t.assignee_id
    INNER JOIN users creator
      ON creator.user_id = t.created_by
    WHERE t.task_id = $1
      AND t.deleted_at IS NULL
    LIMIT 1
  `;

  const taskResult = await pool.query<TaskBaseRow>(taskQuery, [taskId]);

  if (taskResult.rows.length === 0) {
    return null;
  }

  const taskRow = taskResult.rows[0];

  const commentsQuery = `
    SELECT
      tc.task_comment_id,
      tc.content,
      tc.is_internal,
      tc.created_at,
      CONCAT(u.first_name, ' ', u.last_name) AS author_full_name
    FROM task_comments tc
    INNER JOIN users u
      ON u.user_id = tc.author_id
    WHERE tc.task_id = $1
      AND tc.deleted_at IS NULL
    ORDER BY tc.created_at DESC
    LIMIT 5
  `;

  const commentsResult = await pool.query<TaskCommentRow>(commentsQuery, [
    taskId,
  ]);

  const comments: TaskComment[] = commentsResult.rows.map((row) => ({
    taskCommentId: row.task_comment_id,
    content: row.content,
    isInternal: row.is_internal,
    createdAt: row.created_at.toISOString(),
    authorFullName: row.author_full_name,
  }));

  return {
    taskId: taskRow.task_id,
    title: taskRow.title,
    description: taskRow.description,
    clientId: taskRow.client_id,
    clientName: taskRow.client_name,
    orderId: taskRow.order_id,
    orderNumber: taskRow.order_number,
    statusCode: taskRow.status_code,
    statusName: taskRow.status_name,
    priorityCode: taskRow.priority_code,
    priorityName: taskRow.priority_name,
    assigneeId: taskRow.assignee_id,
    assigneeFullName: taskRow.assignee_full_name,
    createdBy: taskRow.created_by,
    createdByFullName: taskRow.created_by_full_name,
    dueDate: taskRow.due_date ? taskRow.due_date.toISOString() : null,
    createdAt: taskRow.created_at.toISOString(),
    updatedAt: taskRow.updated_at.toISOString(),
    comments,
  };
}

// src/features/server/get-tasks.ts
import 'server-only';
import { pool } from '@/shared/lib/db';
import type { TaskListItem } from '@/types/types';

type GetTasksParams = {
  search?: string;
  status?: string;
};

type DbTaskRow = {
  task_id: string;
  title: string;
  description: string | null;
  client_id: string | null;
  client_name: string | null;
  order_id: string | null;
  order_number: string | null;
  status_code: string;
  status_name: string;
  priority_code: string | null;
  priority_name: string | null;
  assignee_id: string | null;
  assignee_full_name: string | null;
  due_date: Date | null;
  created_at: Date;
};

export async function getTasks(
  params?: GetTasksParams
): Promise<TaskListItem[]> {
  const search = params?.search?.trim() ?? '';
  const status = params?.status?.trim() ?? 'all';

  const values: string[] = [];
  const conditions: string[] = ['t.deleted_at IS NULL'];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`
      (
        t.title ILIKE $${values.length}
        OR COALESCE(t.description, '') ILIKE $${values.length}
      )
    `);
  }

  if (status !== 'all') {
    values.push(status);
    conditions.push(`ts.status_code = $${values.length}`);
  }

  const query = `
    SELECT
      t.task_id,
      t.title,
      t.description,
      t.client_id,
      c.company_name AS client_name,
      t.order_id,
      o.order_number,
      ts.status_code,
      ts.status_name,
      p.priority_code,
      p.priority_name,
      t.assignee_id,
      CASE
        WHEN u.user_id IS NOT NULL
        THEN CONCAT(u.first_name, ' ', u.last_name)
        ELSE NULL
      END AS assignee_full_name,
      t.due_date,
      t.created_at
    FROM tasks t
    INNER JOIN task_statuses ts
      ON ts.task_status_id = t.task_status_id
    LEFT JOIN priorities p
      ON p.priority_id = t.priority_id
    LEFT JOIN clients c
      ON c.client_id = t.client_id
    LEFT JOIN orders o
      ON o.order_id = t.order_id
    LEFT JOIN users u
      ON u.user_id = t.assignee_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY t.created_at DESC
  `;

  const result = await pool.query<DbTaskRow>(query, values);

  return result.rows.map((row) => ({
    taskId: row.task_id,
    title: row.title,
    description: row.description,
    clientId: row.client_id,
    clientName: row.client_name,
    orderId: row.order_id,
    orderNumber: row.order_number,
    statusCode: row.status_code,
    statusName: row.status_name,
    priorityCode: row.priority_code,
    priorityName: row.priority_name,
    assigneeId: row.assignee_id,
    assigneeFullName: row.assignee_full_name,
    dueDate: row.due_date ? row.due_date.toISOString() : null,
    createdAt: row.created_at.toISOString(),
  }));
}


// src/features/server/get-user-by-email.ts
import { pool } from '@/shared/lib/db';

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
};

type DbUserRow = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
};

export async function getUserByEmail(
  email: string
): Promise<UserRecord | null> {
  const result = await pool.query<DbUserRow>(
    `
      SELECT
        id,
        email,
        "passwordHash",
        "firstName",
        "lastName",
        role,
        status
      FROM "User"
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    passwordHash: user.passwordHash,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    status: user.status,
  };
}

// src/features/server/logout.ts
'use server';

import { redirect } from 'next/navigation';
import { clearSessionCookie } from '@/shared/lib/auth';

export async function logout() {
  await clearSessionCookie();
  redirect('/login');
}

//src/features/tasks/task-details.tsx
import Link from 'next/link';
import type { TaskDetails } from '@/types/types';

type TaskDetailsProps = {
  task: TaskDetails;
};

function formatDate(date: string | null) {
  if (!date) {
    return '—';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

function getStatusClass(statusCode: string) {
  switch (statusCode) {
    case 'open':
      return 'status-badge status-badge--lead';
    case 'in_progress':
      return 'status-badge status-badge--active';
    case 'review':
      return 'status-badge status-badge--inactive';
    case 'done':
      return 'status-badge status-badge--active';
    case 'cancelled':
      return 'status-badge status-badge--archived';
    default:
      return 'status-badge status-badge--inactive';
  }
}

function getPriorityClass(priorityCode: string | null) {
  switch (priorityCode) {
    case 'urgent':
      return 'priority-badge priority-badge--urgent';
    case 'high':
      return 'priority-badge priority-badge--high';
    case 'medium':
      return 'priority-badge priority-badge--medium';
    case 'low':
      return 'priority-badge priority-badge--low';
    default:
      return 'priority-badge priority-badge--default';
  }
}

export function TaskDetailsCard({ task }: TaskDetailsProps) {
  return (
    <div className="client-details">
      <div className="details-grid">
        <section className="details-card">
          <p className="section-eyebrow">Task overview</p>
          <h2 className="section-title">{task.title}</h2>

          <div className="details-list">
            <div className="details-list__item">
              <span className="details-list__label">ID</span>
              <span className="details-list__value">{task.taskId}</span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Статус</span>
              <span className="details-list__value">
                <span className={getStatusClass(task.statusCode)}>
                  {task.statusName}
                </span>
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Приоритет</span>
              <span className="details-list__value">
                <span className={getPriorityClass(task.priorityCode)}>
                  {task.priorityName ?? '—'}
                </span>
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Клиент</span>
              <span className="details-list__value">
                {task.clientId && task.clientName ? (
                  <Link
                    href={`/clients/${task.clientId}`}
                    className="text-link"
                  >
                    {task.clientName}
                  </Link>
                ) : (
                  '—'
                )}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Заказ</span>
              <span className="details-list__value">
                {task.orderId && task.orderNumber ? (
                  <Link href={`/orders/${task.orderId}`} className="text-link">
                    {task.orderNumber}
                  </Link>
                ) : (
                  '—'
                )}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Исполнитель</span>
              <span className="details-list__value">
                {task.assigneeFullName ?? '—'}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Создал</span>
              <span className="details-list__value">
                {task.createdByFullName}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Дедлайн</span>
              <span className="details-list__value">
                {formatDate(task.dueDate)}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Создана</span>
              <span className="details-list__value">
                {formatDate(task.createdAt)}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Обновлена</span>
              <span className="details-list__value">
                {formatDate(task.updatedAt)}
              </span>
            </div>
          </div>

          <div className="details-description">
            <h3 className="details-subtitle">Описание</h3>
            <p>{task.description ?? 'Описание отсутствует.'}</p>
          </div>
        </section>

        <section className="details-card">
          <p className="section-eyebrow">Task summary</p>
          <h2 className="section-title">Сводка</h2>

          <div className="details-list">
            <div className="details-list__item">
              <span className="details-list__label">Комментариев</span>
              <span className="details-list__value">
                {task.comments.length}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Связана с клиентом</span>
              <span className="details-list__value">
                {task.clientId ? 'yes' : 'no'}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Связана с заказом</span>
              <span className="details-list__value">
                {task.orderId ? 'yes' : 'no'}
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className="details-card">
        <p className="section-eyebrow">Recent comments</p>
        <h2 className="section-title">Последние комментарии</h2>

        {task.comments.length === 0 ? (
          <p className="empty-inline">Комментарии отсутствуют.</p>
        ) : (
          <div className="notes-list">
            {task.comments.map((comment) => (
              <article key={comment.taskCommentId} className="note-card">
                <div className="note-card__meta">
                  <span>{comment.authorFullName}</span>
                  <span>{formatDate(comment.createdAt)}</span>
                  <span>{comment.isInternal ? 'internal' : 'public'}</span>
                </div>

                <p className="note-card__content">{comment.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// src/features/tasks/tasks-table.tsx
import Link from 'next/link';
import type { TaskListItem } from '@/types/types';

type TasksTableProps = {
  tasks: TaskListItem[];
  search: string;
  status: string;
};

function formatDate(date: string | null) {
  if (!date) {
    return '—';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

function getStatusClass(statusCode: string) {
  switch (statusCode) {
    case 'open':
      return 'status-badge status-badge--lead';
    case 'in_progress':
      return 'status-badge status-badge--active';
    case 'review':
      return 'status-badge status-badge--inactive';
    case 'done':
      return 'status-badge status-badge--active';
    case 'cancelled':
      return 'status-badge status-badge--archived';
    default:
      return 'status-badge status-badge--inactive';
  }
}

function getPriorityClass(priorityCode: string | null) {
  switch (priorityCode) {
    case 'urgent':
      return 'priority-badge priority-badge--urgent';
    case 'high':
      return 'priority-badge priority-badge--high';
    case 'medium':
      return 'priority-badge priority-badge--medium';
    case 'low':
      return 'priority-badge priority-badge--low';
    default:
      return 'priority-badge priority-badge--default';
  }
}

export function TasksTable({ tasks, search, status }: TasksTableProps) {
  return (
    <div className="data-card">
      <div className="data-card__header">
        <div>
          <p className="section-eyebrow">Tasks</p>
          <h2 className="section-title">Список задач</h2>
        </div>

        <div className="section-meta">
          Всего: <strong>{tasks.length}</strong>
        </div>
      </div>

      <div className="clients-filters">
        <form action="/tasks" method="get" className="clients-filters__form">
          <div className="clients-filters__field">
            <label htmlFor="search" className="clients-filters__label">
              Поиск по названию или описанию
            </label>
            <input
              id="search"
              name="search"
              type="text"
              defaultValue={search}
              placeholder="Например: Fix invoice flow"
              className="clients-filters__input"
            />
          </div>

          <div className="clients-filters__field">
            <label htmlFor="status" className="clients-filters__label">
              Статус
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className="clients-filters__select"
            >
              <option value="all">Все</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="clients-filters__actions">
            <button type="submit" className="primary-button">
              Применить
            </button>
            <Link href="/tasks" className="secondary-link">
              Сбросить
            </Link>
          </div>
        </form>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state empty-state--inside-card">
          <h2 className="empty-state__title">Задачи не найдены</h2>
          <p className="empty-state__text">
            По текущим параметрам поиска и фильтрации записи отсутствуют.
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Клиент</th>
                <th>Заказ</th>
                <th>Статус</th>
                <th>Приоритет</th>
                <th>Исполнитель</th>
                <th>Дедлайн</th>
                <th>Создана</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.taskId}>
                  <td>
                    <Link href={`/tasks/${task.taskId}`} className="table-link">
                      {task.title}
                    </Link>
                  </td>
                  <td>
                    {task.clientId && task.clientName ? (
                      <Link
                        href={`/clients/${task.clientId}`}
                        className="table-link"
                      >
                        {task.clientName}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    {task.orderId && task.orderNumber ? (
                      <Link
                        href={`/orders/${task.orderId}`}
                        className="table-link"
                      >
                        {task.orderNumber}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <span className={getStatusClass(task.statusCode)}>
                      {task.statusName}
                    </span>
                  </td>
                  <td>
                    <span className={getPriorityClass(task.priorityCode)}>
                      {task.priorityName ?? '—'}
                    </span>
                  </td>
                  <td>{task.assigneeFullName ?? '—'}</td>
                  <td>{formatDate(task.dueDate)}</td>
                  <td>{formatDate(task.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// src/shared/lib/auth.ts
import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'orbis_session';

export type SessionUser = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
};

function encodeSession(session: SessionUser): string {
  return Buffer.from(JSON.stringify(session), 'utf-8').toString('base64');
}

function decodeSession(value: string): SessionUser | null {
  try {
    const json = Buffer.from(value, 'base64').toString('utf-8');
    return JSON.parse(json) as SessionUser;
  } catch {
    return null;
  }
}

export async function createSessionCookie(session: SessionUser) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!cookieValue) {
    return null;
  }

  return decodeSession(cookieValue);
}

// src/shared/lib/db-test.ts
import { db } from './db';

export async function testDatabaseConnection() {
  const result = await db.query('SELECT NOW() as now');
  return result.rows[0];
}

// src/shared/lib/db.ts
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// src/shared/ui/app-header.tsx
import { getSessionUser } from '@/shared/lib/auth';

export async function AppHeader() {
  const user = await getSessionUser();

  return (
    <header className="app-header">
      <div>
        <p className="app-header__eyebrow">Orbis CRM</p>
        <h1 className="app-header__title">Workspace</h1>
      </div>

      <div className="app-header__meta">
        {user ? (
          <div className="app-header__user">
            <span className="app-header__user-name">
              {user.firstName} {user.lastName}
            </span>
            <span className="app-header__user-email">{user.email}</span>
            {user.role ? (
              <span className="app-header__user-role">{user.role}</span>
            ) : null}
          </div>
        ) : (
          <span className="app-header__status">Guest</span>
        )}
      </div>
    </header>
  );
}

// src/shared/ui/app-shell.tsx
import Link from 'next/link';
import { AppHeader } from '@/shared/ui/app-header';
import { AppSidebar } from '@/shared/ui/app-sidebar';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div className="app-shell__logo">
          <Link href="/">Orbis CRM</Link>
        </div>

        <AppSidebar />
      </aside>

      <div className="app-shell__content">
        <AppHeader />
        <main className="app-shell__main">{children}</main>
      </div>
    </div>
  );
}

// src/shared/ui/app-sidebar.tsx
import Link from 'next/link';
import { logout } from '@/features/server/logout';

const navigation = [
  {
    title: 'Dashboard',
    href: '/',
  },
  {
    title: 'Clients',
    href: '/clients',
  },
  {
    title: 'Orders',
    href: '/orders',
  },
  {
    title: 'Tasks',
    href: '/tasks',
  },
  {
    title: 'Audit logs',
    href: '/audit-logs',
  },
];

export function AppSidebar() {
  return (
    <div className="sidebar-layout">
      <nav className="sidebar-nav" aria-label="Основная навигация CRM">
        <ul className="sidebar-nav__list">
          {navigation.map((item) => (
            <li key={item.href} className="sidebar-nav__item">
              <Link href={item.href} className="sidebar-nav__link">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <form action={logout} className="sidebar-logout">
        <button type="submit" className="sidebar-logout__button">
          Logout
        </button>
      </form>
    </div>
  );
}

// src/types/types.ts
// ===== AUTH / SESSION =====

export type UserRole = 'admin' | 'manager' | 'support';

export type Permission =
  | 'clients.read'
  | 'clients.write'
  | 'orders.read'
  | 'orders.write'
  | 'tasks.read'
  | 'tasks.write'
  | 'users.read'
  | 'users.write';

export type SessionUser = {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
};

export type AuthSession = {
  user: SessionUser;
};

// ===== CLIENTS =====

export type Client = {
  clientId: string;
  companyName: string;
  legalName: string | null;
  taxId: string | null;
  website: string | null;
  industry: string | null;
  isActive: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  primaryContactName: string | null;
  primaryContactEmail: string | null;
  primaryContactPhone: string | null;
};

export type ClientAddress = {
  addressId: string;
  addressType: 'legal' | 'billing' | 'shipping' | 'office';
  country: string | null;
  city: string | null;
  stateRegion: string | null;
  postalCode: string | null;
  addressLine1: string;
  addressLine2: string | null;
};

export type ClientNote = {
  noteId: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  authorFullName: string;
};

export type ClientDetails = {
  clientId: string;
  companyName: string;
  legalName: string | null;
  taxId: string | null;
  website: string | null;
  industry: string | null;
  description: string | null;
  isActive: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  managerId: string | null;
  primaryContactName: string | null;
  primaryContactEmail: string | null;
  primaryContactPhone: string | null;
  addresses: ClientAddress[];
  notes: ClientNote[];
};

// ===== ORDERS =====

export type OrderListItem = {
  orderId: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  statusCode: string;
  statusName: string;
  priorityCode: string | null;
  priorityName: string | null;
  title: string;
  totalAmount: string;
  currencyCode: string;
  dueDate: string | null;
  createdAt: string;
  assignedManagerId: string | null;
};

export type OrderFilters = {
  search: string;
  status: string;
};

export type OrderItem = {
  orderItemId: string;
  productName: string;
  description: string | null;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
};

export type OrderComment = {
  orderCommentId: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  authorFullName: string;
};

export type OrderDetails = {
  orderId: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  statusCode: string;
  statusName: string;
  priorityCode: string | null;
  priorityName: string | null;
  title: string;
  description: string | null;
  totalAmount: string;
  currencyCode: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignedManagerId: string | null;
  items: OrderItem[];
  comments: OrderComment[];
};

// ===== TASKS =====

export type TaskListItem = {
  taskId: string;
  title: string;
  description: string | null;
  clientId: string | null;
  clientName: string | null;
  orderId: string | null;
  orderNumber: string | null;
  statusCode: string;
  statusName: string;
  priorityCode: string | null;
  priorityName: string | null;
  assigneeId: string | null;
  assigneeFullName: string | null;
  dueDate: string | null;
  createdAt: string;
};

export type TaskFilters = {
  search: string;
  status: string;
};

export type TaskComment = {
  taskCommentId: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  authorFullName: string;
};

export type TaskDetails = {
  taskId: string;
  title: string;
  description: string | null;
  clientId: string | null;
  clientName: string | null;
  orderId: string | null;
  orderNumber: string | null;
  statusCode: string;
  statusName: string;
  priorityCode: string | null;
  priorityName: string | null;
  assigneeId: string | null;
  assigneeFullName: string | null;
  createdBy: string;
  createdByFullName: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  comments: TaskComment[];
};

// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/register'];
const PUBLIC_API_PATHS = ['/api/auth/login', '/api/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('orbis_session')?.value;

  const isPublicPage = PUBLIC_PATHS.includes(pathname);
  const isPublicApi = PUBLIC_API_PATHS.includes(pathname);
  const isStaticAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.');

  if (isStaticAsset || isPublicApi) {
    return NextResponse.next();
  }

  if (!sessionCookie && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (sessionCookie && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/clients', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};


src/app/globals.scss
*,
*::before,
*::after {
  box-sizing: border-box;
}

:root {
  --bg-app: #f5f7fb;
  --bg-surface: #ffffff;
  --bg-surface-muted: #f8fafc;
  --bg-sidebar: #0f172a;
  --bg-hover: #f9fbff;

  --border-primary: #e4e7ec;
  --border-secondary: #eef2f6;
  --border-field: #d0d5dd;

  --text-primary: #101828;
  --text-secondary: #475467;
  --text-muted: #667085;
  --text-inverse: #ffffff;

  --success-bg: #ecfdf3;
  --success-text: #027a48;

  --shadow-card: 0 10px 30px rgba(15, 23, 42, 0.04);

  --radius-card: 18px;
  --radius-md: 14px;
  --radius-sm: 10px;

  --sidebar-width: 260px;
  --container-padding: 24px;
}

html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  font-family: Inter, Arial, Helvetica, sans-serif;
  background: var(--bg-app);
  color: var(--text-primary);
}

body {
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  padding: 0;
}

img,
svg {
  display: block;
  max-width: 100%;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
}

.app-shell__sidebar {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px 18px;
  background: var(--bg-sidebar);
  color: var(--text-inverse);
  border-right: 1px solid rgba(221, 228, 240, 0.16);
}

.app-shell__logo {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.app-shell__content {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.app-shell__main {
  padding: var(--container-padding);
}

.sidebar-layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  min-height: 100%;
}

.sidebar-nav__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-nav__item {
  width: 100%;
}

.sidebar-nav__link {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  color: #cbd5e1;
  font-size: 15px;
  font-weight: 500;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.sidebar-nav__link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-inverse);
}

.sidebar-logout {
  margin-top: auto;
}

.sidebar-logout__button {
  width: 100%;
  min-height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  background: transparent;
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.sidebar-logout__button:hover {
  background: rgba(255, 255, 255, 0.08);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 76px;
  padding: 18px 24px;
  background: var(--bg-surface);
  border-bottom: 1px solid #dde4f0;
}

.app-header__eyebrow,
.page-section__eyebrow,
.section-eyebrow,
.dashboard-card__label {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.app-header__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.app-header__meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-header__status {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--success-bg);
  color: var(--success-text);
  font-size: 14px;
  font-weight: 600;
}

.page-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-section__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.page-section__title {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  color: var(--text-primary);
}

.page-section__description {
  margin: 0;
  max-width: 520px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(280px, 420px);
  gap: 20px;
}

.dashboard-card,
.data-card,
.details-card,
.empty-state {
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.dashboard-card {
  padding: 20px;
}

.dashboard-card__title,
.section-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.dashboard-card__text {
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.dashboard-card__link {
  min-height: 40px;
  padding: 0 14px;
  background: #111827;
  color: #ffffff;
}

.data-card {
  overflow: hidden;
}

.data-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border-secondary);
}

.section-meta {
  font-size: 14px;
  color: var(--text-secondary);
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

.crm-table {
  width: 100%;
  border-collapse: collapse;
}

.crm-table thead th {
  padding: 14px 20px;
  text-align: left;
  white-space: nowrap;
  background: var(--bg-surface-muted);
  border-bottom: 1px solid var(--border-secondary);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
}

.crm-table tbody td {
  padding: 16px 20px;
  vertical-align: middle;
  border-bottom: 1px solid #f2f4f7;
  font-size: 14px;
  color: var(--text-primary);
}

.crm-table tbody tr:last-child td {
  border-bottom: none;
}

.crm-table tbody tr:hover {
  background: var(--bg-hover);
}

.order-items-table .crm-table tbody td {
  white-space: normal;
}

.table-link {
  color: var(--text-primary);
  font-weight: 600;
}

.table-link:hover {
  text-decoration: underline;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}

.status-badge--active {
  background: #ecfdf3;
  color: #027a48;
}

.status-badge--lead {
  background: #eff8ff;
  color: #175cd3;
}

.status-badge--inactive {
  background: #f2f4f7;
  color: #344054;
}

.status-badge--archived {
  background: #fff1f3;
  color: #c01048;
}

.priority-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.priority-badge--urgent {
  background: #fff1f3;
  color: #c01048;
}

.priority-badge--high {
  background: #fff4ed;
  color: #c4320a;
}

.priority-badge--medium {
  background: #fffaeb;
  color: #b54708;
}

.priority-badge--low {
  background: #ecfdf3;
  color: #027a48;
}

.priority-badge--default {
  background: #f2f4f7;
  color: #344054;
}

.empty-state {
  padding: 32px 24px;
}

.empty-state--inside-card {
  border: none;
  border-radius: 0;
  box-shadow: none;
  padding: 24px 20px 28px;
}

.empty-state__title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.empty-state__text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
}

.clients-filters {
  padding: 20px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-secondary);
}

.clients-filters__form {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) 220px auto;
  gap: 16px;
  align-items: end;
}

.clients-filters__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.clients-filters__label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
}

.clients-filters__input,
.clients-filters__select {
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid var(--border-field);
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  color: var(--text-primary);
  outline: none;
}

.clients-filters__input:focus,
.clients-filters__select:focus {
  border-color: #98a2b3;
}

.clients-filters__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.primary-button,
.secondary-link,
.dashboard-card__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.primary-button {
  border: none;
  background: #111827;
  color: #ffffff;
  cursor: pointer;
}

.primary-button:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}

.secondary-link {
  border: 1px solid var(--border-field);
  background: var(--bg-surface);
  color: #344054;
}

.secondary-link:hover {
  background: #f8fafc;
}

.client-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.details-grid {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(280px, 420px);
  gap: 20px;
}

.details-card {
  padding: 20px;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
}

.details-list__item {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.details-list__label {
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
}

.details-list__value {
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.details-description {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-secondary);
}

.details-subtitle {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.details-description p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.details-blocks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.details-block {
  padding: 16px;
  background: var(--bg-surface-muted);
  border: 1px solid #eaecf0;
  border-radius: var(--radius-md);
}

.details-block__header {
  margin-bottom: 12px;
  color: var(--text-primary);
}

.details-block__content p {
  margin: 0 0 8px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 18px;
}

.note-card {
  padding: 16px;
  background: var(--bg-surface);
  border: 1px solid #eaecf0;
  border-radius: var(--radius-md);
}

.note-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
}

.note-card__content {
  margin: 0;
  color: #344054;
  line-height: 1.6;
}

.empty-inline {
  margin: 18px 0 0;
  color: var(--text-muted);
  font-size: 14px;
}

.text-link {
  color: #175cd3;
}

.text-link:hover {
  text-decoration: underline;
}

.landing-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(99, 102, 241, 0.18), transparent 26%),
    radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.1), transparent 18%),
    linear-gradient(180deg, #020617 0%, #040b1a 100%);
  color: #ffffff;
}

.landing-header,
.auth-layout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 40px;
}

.landing-brand {
  display: inline-flex;
  align-items: center;
}

.landing-brand__image {
  width: auto;
  height: 140px;
  object-fit: contain;
}

.landing-header__actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.landing-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 22px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.landing-button:hover {
  transform: translateY(-1px);
}

.landing-button--primary {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: #ffffff;
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.28);
}

.landing-button--secondary {
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(15, 23, 42, 0.42);
  color: #ffffff;
  backdrop-filter: blur(8px);
}

.landing-button--large {
  min-height: 54px;
  padding: 0 28px;
  border-radius: 18px;
  font-size: 16px;
}

.landing-main {
  padding: 12px 40px 56px;
}

.hero-section {
  display: grid;
  grid-template-columns: minmax(360px, 1fr) minmax(320px, 560px);
  align-items: center;
  gap: 40px;
  padding: 40px 0 32px;
}

.hero-section__content {
  max-width: 760px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(129, 140, 248, 0.18);
  border-radius: 999px;
  background: rgba(79, 70, 229, 0.14);
  color: #a5b4fc;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.03em;
  margin-bottom: 22px;
}

.hero-title {
  margin: 0 0 22px;
  font-size: clamp(44px, 6vw, 74px);
  line-height: 1.02;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #ffffff;
}

.hero-title span {
  color: #7c78ff;
}

.hero-description {
  margin: 0 0 28px;
  max-width: 620px;
  font-size: 24px;
  line-height: 1.55;
  color: rgba(226, 232, 240, 0.92);
}

.hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.hero-section__visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-orbit {
  position: relative;
  width: min(100%, 560px);
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-orbit::before {
  content: '';
  position: absolute;
  inset: 8% 6%;
  border-radius: 50%;
  border: 1px solid rgba(99, 102, 241, 0.14);
  box-shadow:
    0 0 0 70px rgba(79, 70, 229, 0.03),
    0 0 0 140px rgba(79, 70, 229, 0.018);
}

.hero-orbit__image {
  width: min(100%, 420px);
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 30px 50px rgba(99, 102, 241, 0.3));
}

.landing-section {
  padding: 28px 0;
}

.landing-section__header {
  margin-bottom: 22px;
}

.landing-section__title {
  color: #ffffff;
}

.landing-features-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  gap: 18px;
}

.landing-feature-card {
  min-height: 180px;
  padding: 24px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 24px;
  background: linear-gradient(
    180deg,
    rgba(9, 17, 36, 0.86) 0%,
    rgba(6, 13, 28, 0.96) 100%
  );
  box-shadow: 0 16px 40px rgba(2, 6, 23, 0.35);
}

.landing-feature-card__title {
  margin: 0 0 14px;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
}

.landing-feature-card__text {
  margin: 0;
  font-size: 19px;
  line-height: 1.6;
  color: rgba(203, 213, 225, 0.9);
}

.landing-stats {
  padding: 12px 0 0;
}

.landing-stats__card {
  display: grid;
  grid-template-columns: minmax(280px, 1.2fr) minmax(320px, 1fr);
  gap: 24px;
  padding: 28px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 28px;
  background: linear-gradient(
    180deg,
    rgba(9, 17, 36, 0.92) 0%,
    rgba(5, 12, 26, 0.98) 100%
  );
}

.landing-stats__label {
  margin: 0 0 12px;
  font-size: 30px;
  font-weight: 700;
  color: #ffffff;
}

.landing-stats__text {
  margin: 0;
  font-size: 21px;
  line-height: 1.7;
  color: rgba(203, 213, 225, 0.9);
}

.landing-stats__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 18px;
}

.landing-metric {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  padding: 16px 0 16px 18px;
  border-left: 1px solid rgba(148, 163, 184, 0.14);
}

.landing-metric strong {
  font-size: 24px;
  font-weight: 800;
  color: #7c78ff;
}

.landing-metric span {
  font-size: 17px;
  line-height: 1.5;
  color: rgba(203, 213, 225, 0.88);
}

.auth-layout {
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(99, 102, 241, 0.14), transparent 24%),
    linear-gradient(180deg, #020617 0%, #040b1a 100%);
}

.auth-layout__main {
  padding: 10px 24px 40px;
}

.auth-page {
  min-height: calc(100vh - 110px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  padding: 32px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow:
    0 20px 60px rgba(2, 6, 23, 0.28),
    0 8px 24px rgba(99, 102, 241, 0.08);
}

.auth-card__header {
  margin-bottom: 24px;
}

.auth-card__description {
  margin: 10px 0 0;
  color: #667085;
  font-size: 15px;
  line-height: 1.6;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-form__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-form__submit {
  margin-top: 8px;
}

.auth-form__footer {
  margin: 4px 0 0;
  color: #667085;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
}

@media (max-width: 1200px) {
  .landing-features-grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }

  .landing-stats__card {
    grid-template-columns: 1fr;
  }

  .landing-stats__metrics {
    grid-template-columns: repeat(3, minmax(120px, 1fr));
  }
}

@media (max-width: 1024px) {
  :root {
    --sidebar-width: 220px;
  }

  .app-header,
  .data-card__header,
  .page-section__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .clients-filters__form {
    grid-template-columns: 1fr;
  }

  .clients-filters__actions {
    flex-wrap: wrap;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .details-list__item {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .hero-section {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .hero-section__content {
    max-width: 100%;
  }

  .hero-section__visual {
    order: -1;
  }
}

@media (max-width: 768px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .app-shell__sidebar {
    border-right: none;
    border-bottom: 1px solid #dde4f0;
  }

  .app-shell__main {
    padding: 16px;
  }

  .app-header {
    padding: 16px;
  }

  .page-section__title {
    font-size: 24px;
  }

  .crm-table thead th,
  .crm-table tbody td {
    padding-left: 16px;
    padding-right: 16px;
  }

  .clients-filters,
  .data-card__header,
  .details-card {
    padding-left: 16px;
    padding-right: 16px;
  }

  .landing-header,
  .auth-layout__header,
  .landing-main {
    padding-left: 20px;
    padding-right: 20px;
  }

  .landing-header,
  .auth-layout__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .landing-header__actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .landing-button {
    width: 100%;
  }

  .hero-title {
    font-size: clamp(36px, 10vw, 52px);
  }

  .hero-description {
    font-size: 18px;
  }

  .landing-features-grid,
  .landing-stats__metrics {
    grid-template-columns: 1fr;
  }

  .landing-metric {
    padding-left: 0;
    border-left: none;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
    padding-top: 18px;
  }

  .auth-card {
    padding: 24px 20px;
    border-radius: 24px;
  }
}

.app-header__user {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.app-header__user-name {
  font-size: 14px;
  font-weight: 700;
  color: #101828;
}

.app-header__user-email {
  font-size: 13px;
  color: #667085;
}

.app-header__user-role {
  margin-top: 2px;
  display: inline-flex;
  align-items: center;
  align-self: flex-end;
  min-height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}