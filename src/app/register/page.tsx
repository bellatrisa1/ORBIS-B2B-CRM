'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
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
            Войти
          </Link>
        </div>
      </header>

      <main className="auth-layout__main">
        <section className="auth-page">
          <div className="auth-card">
            <div className="auth-card__header">
              <p className="section-eyebrow">Authentication</p>
              <h1 className="section-title">Регистрация в Orbis CRM</h1>
              <p className="auth-card__description">
                Создайте аккаунт, чтобы перейти в рабочее пространство.
              </p>
            </div>

            <form
              className="auth-form"
              onSubmit={async (event) => {
                event.preventDefault();

                const form = event.currentTarget;
                const formData = new FormData(form);

                const firstName = String(formData.get('firstName') ?? '');
                const lastName = String(formData.get('lastName') ?? '');
                const email = String(formData.get('email') ?? '');
                const password = String(formData.get('password') ?? '');

                const response = await fetch('/api/auth/register', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                  }),
                });

                const data = (await response.json()) as { message?: string };

                if (!response.ok) {
                  window.alert(data.message ?? 'Ошибка регистрации.');
                  return;
                }

                window.location.href = '/clients';
              }}
            >
              <div className="auth-form__field">
                <label htmlFor="firstName" className="clients-filters__label">
                  Имя
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="clients-filters__input"
                  placeholder="Bella"
                  required
                />
              </div>

              <div className="auth-form__field">
                <label htmlFor="lastName" className="clients-filters__label">
                  Фамилия
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="clients-filters__input"
                  placeholder="Black"
                  required
                />
              </div>

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
                  placeholder="Минимум 6 символов"
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button auth-form__submit"
              >
                Зарегистрироваться
              </button>

              <p className="auth-form__footer">
                Уже есть аккаунт?{' '}
                <Link href="/login" className="text-link">
                  Войти
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
