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
