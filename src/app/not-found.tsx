import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="empty-state"
      style={{ padding: '80px 24px', textAlign: 'center' }}
    >
      <h1
        className="empty-state__title"
        style={{ fontSize: '48px', marginBottom: '16px' }}
      >
        404
      </h1>
      <h2 className="empty-state__title">Страница не найдена</h2>
      <p className="empty-state__text">
        Запрошенная страница не существует или была удалена.
      </p>
      <Link
        href="/clients"
        className="primary-button"
        style={{ marginTop: '24px' }}
      >
        Вернуться к клиентам
      </Link>
    </div>
  );
}
