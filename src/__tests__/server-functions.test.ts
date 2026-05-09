import { describe, it, expect } from 'vitest';
import { getUserByEmail } from '@/features/server/get-user-by-email';
import { getClients } from '@/features/server/get-clients';
import { getOrders } from '@/features/server/get-orders';
import { getTasks } from '@/features/server/get-tasks';

describe('getUserByEmail', () => {
  it('находит админа', async () => {
    const user = await getUserByEmail('admin@orbis.com');
    expect(user).not.toBeNull();
    expect(user?.email).toBe('admin@orbis.com');
    expect(user?.role).toBe('admin');
    expect(user?.status).toBe('active');
  });

  it('возвращает null для несуществующего', async () => {
    const user = await getUserByEmail('fake@fake.com');
    expect(user).toBeNull();
  });
});

describe('getClients', () => {
  it('возвращает всех клиентов', async () => {
    const clients = await getClients();
    expect(clients.length).toBeGreaterThanOrEqual(3);
    expect(clients[0]).toHaveProperty('clientId');
    expect(clients[0]).toHaveProperty('companyName');
  });

  it('фильтрует по статусу active', async () => {
    const clients = await getClients({ status: 'active' });
    clients.forEach((c) => {
      expect(c.isActive).toBe(true);
    });
  });
});

describe('getOrders', () => {
  it('возвращает заказы', async () => {
    const orders = await getOrders();
    expect(orders.length).toBeGreaterThanOrEqual(2);
    expect(orders[0]).toHaveProperty('orderId');
    expect(orders[0]).toHaveProperty('orderNumber');
  });
});

describe('getTasks', () => {
  it('возвращает задачи', async () => {
    const tasks = await getTasks();
    expect(tasks.length).toBeGreaterThanOrEqual(3);
    expect(tasks[0]).toHaveProperty('taskId');
    expect(tasks[0]).toHaveProperty('title');
  });
});
