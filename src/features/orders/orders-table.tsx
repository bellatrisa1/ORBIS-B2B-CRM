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
