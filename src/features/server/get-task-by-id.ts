import 'server-only';
import { db } from '@/shared/lib/db';
import type { TaskComment, TaskDetails } from '@/types/types';

export async function getTaskById(taskId: string): Promise<TaskDetails | null> {
  const task = await db.getTaskById(taskId);
  if (!task) return null;

  const taskStatus = db.getTaskStatus(task.task_status_id);
  const priority = db.getPriority(task.priority_id);
  const clientName = task.client_id ? db.getClientName(task.client_id) : null;

  const commentsWithAuthors = await db.getTaskComments(taskId, 5);

  const mappedComments: TaskComment[] = commentsWithAuthors.map(
    ({ comment, authorName }) => ({
      taskCommentId: comment.task_comment_id,
      content: comment.content,
      isInternal: comment.is_internal,
      createdAt: comment.created_at,
      authorFullName: authorName,
    })
  );

  // Создатель задачи
  let createdByFullName = 'Unknown';
  const creator = await db.getUserById(task.created_by);
  if (creator) {
    createdByFullName = `${creator.first_name} ${creator.last_name}`;
  }

  // Исполнитель
  let assigneeFullName: string | null = null;
  if (task.assignee_id) {
    const assignee = await db.getUserById(task.assignee_id);
    if (assignee) {
      assigneeFullName = `${assignee.first_name} ${assignee.last_name}`;
    }
  }

  return {
    taskId: task.task_id,
    title: task.title,
    description: task.description,
    clientId: task.client_id,
    clientName,
    orderId: task.order_id,
    orderNumber: null,
    statusCode: taskStatus?.status_code ?? 'unknown',
    statusName: taskStatus?.status_name ?? 'Unknown',
    priorityCode: priority?.priority_code ?? null,
    priorityName: priority?.priority_name ?? null,
    assigneeId: task.assignee_id,
    assigneeFullName,
    createdBy: task.created_by,
    createdByFullName,
    dueDate: task.due_date,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
    comments: mappedComments,
  };
}
