import 'server-only';
import { db } from '@/shared/lib/db';
import type { OrderListItem } from '@/types/types';

type GetOrdersParams = {
  search?: string;
  status?: string;
};

export async function getOrders(
  params?: GetOrdersParams
): Promise<OrderListItem[]> {
  const orders = await db.getOrders(params);

  return orders.map((o) => {
    const status = db.getOrderStatus(o.order_status_id);
    const priority = db.getPriority(o.priority_id);
    const clientName = db.getClientName(o.client_id);

    return {
      orderId: o.order_id,
      orderNumber: o.order_number,
      clientId: o.client_id,
      clientName: clientName ?? 'Unknown',
      statusCode: status?.status_code ?? 'unknown',
      statusName: status?.status_name ?? 'Unknown',
      priorityCode: priority?.priority_code ?? null,
      priorityName: priority?.priority_name ?? null,
      title: o.title,
      totalAmount: String(o.total_amount),
      currencyCode: o.currency_code,
      dueDate: o.due_date,
      createdAt: o.created_at,
      assignedManagerId: o.assigned_manager_id,
    };
  });
}
