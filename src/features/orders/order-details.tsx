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
