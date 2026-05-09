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
