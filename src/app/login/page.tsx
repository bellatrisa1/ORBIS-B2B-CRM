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
            href="/register"
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
