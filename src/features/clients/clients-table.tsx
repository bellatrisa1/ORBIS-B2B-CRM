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

export function ClientsTable({ clients, search, status }: ClientsTableProps) {
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
