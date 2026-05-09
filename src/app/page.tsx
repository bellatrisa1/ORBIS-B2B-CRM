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
