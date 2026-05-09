import 'server-only';
import { db } from '@/shared/lib/db';
import type { TaskListItem } from '@/types/types';

type GetTasksParams = {
  search?: string;
  status?: string;
};

export async function getTasks(
  params?: GetTasksParams
): Promise<TaskListItem[]> {
  const tasks = await db.getTasks(params);

  return tasks.map((t) => {
    const taskStatus = db.getTaskStatus(t.task_status_id);
    const priority = db.getPriority(t.priority_id);
    const clientName = t.client_id ? db.getClientName(t.client_id) : null;

    return {
      taskId: t.task_id,
      title: t.title,
      description: t.description,
      clientId: t.client_id,
      clientName,
      orderId: t.order_id,
      orderNumber: null,
      statusCode: taskStatus?.status_code ?? 'unknown',
      statusName: taskStatus?.status_name ?? 'Unknown',
      priorityCode: priority?.priority_code ?? null,
      priorityName: priority?.priority_name ?? null,
      assigneeId: t.assignee_id,
      assigneeFullName: null,
      dueDate: t.due_date,
      createdAt: t.created_at,
    };
  });
}
