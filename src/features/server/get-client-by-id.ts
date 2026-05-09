import 'server-only';
import { db } from '@/shared/lib/db';
import type { OrderComment, OrderDetails, OrderItem } from '@/types/types';

export async function getOrderById(
  orderId: string
): Promise<OrderDetails | null> {
  const order = await db.getOrderById(orderId);
  if (!order) return null;

  const status = db.getOrderStatus(order.order_status_id);
  const priority = db.getPriority(order.priority_id);
  const clientName = db.getClientName(order.client_id);

  const [items, commentsWithAuthors] = await Promise.all([
    db.getOrderItems(orderId),
    db.getOrderComments(orderId, 5),
  ]);

  const mappedItems: OrderItem[] = items.map((i) => ({
    orderItemId: i.order_item_id,
    productName: i.product_name,
    description: i.description,
    quantity: String(i.quantity),
    unitPrice: String(i.unit_price),
    totalPrice: String(i.total_price),
  }));

  const mappedComments: OrderComment[] = commentsWithAuthors.map(
    ({ comment, authorName }) => ({
      orderCommentId: comment.order_comment_id,
      content: comment.content,
      isInternal: comment.is_internal,
      createdAt: comment.created_at,
      authorFullName: authorName,
    })
  );

  return {
    orderId: order.order_id,
    orderNumber: order.order_number,
    clientId: order.client_id,
    clientName: clientName ?? 'Unknown',
    statusCode: status?.status_code ?? 'unknown',
    statusName: status?.status_name ?? 'Unknown',
    priorityCode: priority?.priority_code ?? null,
    priorityName: priority?.priority_name ?? null,
    title: order.title,
    description: order.description,
    totalAmount: String(order.total_amount),
    currencyCode: order.currency_code,
    dueDate: order.due_date,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    assignedManagerId: order.assigned_manager_id,
    items: mappedItems,
    comments: mappedComments,
  };
}
