import { v4 as uuidv4 } from 'uuid';
export type JsonUser = {
  user_id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
};

export type JsonClient = {
  client_id: string;
  company_name: string;
  legal_name: string | null;
  tax_id: string | null;
  website: string | null;
  industry: string | null;
  description: string | null;
  is_active: boolean;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  manager_id: string | null;
  deleted_at: string | null;
};

export type JsonContact = {
  contact_id: string;
  client_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  is_primary: boolean;
  deleted_at: string | null;
};

export type JsonAddress = {
  address_id: string;
  client_id: string;
  address_type: 'legal' | 'billing' | 'shipping' | 'office';
  country: string | null;
  city: string | null;
  state_region: string | null;
  postal_code: string | null;
  address_line_1: string;
  address_line_2: string | null;
  deleted_at: string | null;
  created_at: string;
};

export type JsonNote = {
  note_id: string;
  client_id: string;
  author_id: string;
  content: string;
  is_internal: boolean;
  deleted_at: string | null;
  created_at: string;
};

export type JsonOrder = {
  order_id: string;
  order_number: string;
  client_id: string;
  order_status_id: string;
  priority_id: string | null;
  title: string;
  description: string | null;
  total_amount: number;
  currency_code: string;
  due_date: string | null;
  assigned_manager_id: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type JsonOrderStatus = {
  order_status_id: string;
  status_code: string;
  status_name: string;
};

export type JsonPriority = {
  priority_id: string;
  priority_code: string;
  priority_name: string;
};

export type JsonOrderItem = {
  order_item_id: string;
  order_id: string;
  product_name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
};

export type JsonOrderComment = {
  order_comment_id: string;
  order_id: string;
  author_id: string;
  content: string;
  is_internal: boolean;
  deleted_at: string | null;
  created_at: string;
};

export type JsonTask = {
  task_id: string;
  title: string;
  description: string | null;
  client_id: string | null;
  order_id: string | null;
  task_status_id: string;
  priority_id: string | null;
  assignee_id: string | null;
  created_by: string;
  due_date: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type JsonTaskStatus = {
  task_status_id: string;
  status_code: string;
  status_name: string;
};

export type JsonTaskComment = {
  task_comment_id: string;
  task_id: string;
  author_id: string;
  content: string;
  is_internal: boolean;
  deleted_at: string | null;
  created_at: string;
};

// ============ Хранилище в памяти ============
class JsonDatabase {
  private users: Map<string, JsonUser> = new Map();
  private clients: Map<string, JsonClient> = new Map();
  private contacts: Map<string, JsonContact> = new Map();
  private addresses: Map<string, JsonAddress> = new Map();
  private notes: Map<string, JsonNote> = new Map();
  private orders: Map<string, JsonOrder> = new Map();
  private orderStatuses: Map<string, JsonOrderStatus> = new Map();
  private priorities: Map<string, JsonPriority> = new Map();
  private orderItems: Map<string, JsonOrderItem> = new Map();
  private orderComments: Map<string, JsonOrderComment> = new Map();
  private tasks: Map<string, JsonTask> = new Map();
  private taskStatuses: Map<string, JsonTaskStatus> = new Map();
  private taskComments: Map<string, JsonTaskComment> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    // ===== Статусы заказов =====
    const osNew = uuidv4();
    const osProgress = uuidv4();
    const osWaiting = uuidv4();
    const osCompleted = uuidv4();
    const osCancelled = uuidv4();

    this.orderStatuses.set(osNew, {
      order_status_id: osNew,
      status_code: 'new',
      status_name: 'New',
    });
    this.orderStatuses.set(osProgress, {
      order_status_id: osProgress,
      status_code: 'in_progress',
      status_name: 'In Progress',
    });
    this.orderStatuses.set(osWaiting, {
      order_status_id: osWaiting,
      status_code: 'waiting_for_client',
      status_name: 'Waiting for Client',
    });
    this.orderStatuses.set(osCompleted, {
      order_status_id: osCompleted,
      status_code: 'completed',
      status_name: 'Completed',
    });
    this.orderStatuses.set(osCancelled, {
      order_status_id: osCancelled,
      status_code: 'cancelled',
      status_name: 'Cancelled',
    });

    // ===== Статусы задач =====
    const tsOpen = uuidv4();
    const tsProgress = uuidv4();
    const tsReview = uuidv4();
    const tsDone = uuidv4();
    const tsCancelled = uuidv4();

    this.taskStatuses.set(tsOpen, {
      task_status_id: tsOpen,
      status_code: 'open',
      status_name: 'Open',
    });
    this.taskStatuses.set(tsProgress, {
      task_status_id: tsProgress,
      status_code: 'in_progress',
      status_name: 'In Progress',
    });
    this.taskStatuses.set(tsReview, {
      task_status_id: tsReview,
      status_code: 'review',
      status_name: 'Review',
    });
    this.taskStatuses.set(tsDone, {
      task_status_id: tsDone,
      status_code: 'done',
      status_name: 'Done',
    });
    this.taskStatuses.set(tsCancelled, {
      task_status_id: tsCancelled,
      status_code: 'cancelled',
      status_name: 'Cancelled',
    });

    // ===== Приоритеты =====
    const pUrgent = uuidv4();
    const pHigh = uuidv4();
    const pMedium = uuidv4();
    const pLow = uuidv4();

    this.priorities.set(pUrgent, {
      priority_id: pUrgent,
      priority_code: 'urgent',
      priority_name: 'Urgent',
    });
    this.priorities.set(pHigh, {
      priority_id: pHigh,
      priority_code: 'high',
      priority_name: 'High',
    });
    this.priorities.set(pMedium, {
      priority_id: pMedium,
      priority_code: 'medium',
      priority_name: 'Medium',
    });
    this.priorities.set(pLow, {
      priority_id: pLow,
      priority_code: 'low',
      priority_name: 'Low',
    });

    // ===== Пользователи =====
    const adminId = uuidv4();
    this.users.set(adminId, {
      user_id: adminId,
      email: 'admin@orbis.com',
      password_hash: 'admin123',
      first_name: 'Admin',
      last_name: 'User',
      is_active: true,
      deleted_at: null,
      created_at: '2024-01-01T00:00:00Z',
    });

    // ===== Клиенты =====
    const c1 = uuidv4();
    const c2 = uuidv4();
    const c3 = uuidv4();

    this.clients.set(c1, {
      client_id: c1,
      company_name: 'ООО "Ромашка"',
      legal_name: 'Общество с ограниченной ответственностью "Ромашка"',
      tax_id: '7701234567',
      website: 'https://romashka.example.com',
      industry: 'Food & Beverage',
      description: 'Ключевой клиент, производитель кондитерских изделий.',
      is_active: true,
      archived_at: null,
      created_at: '2024-06-01T10:00:00Z',
      updated_at: '2025-01-15T14:30:00Z',
      manager_id: adminId,
      deleted_at: null,
    });

    this.clients.set(c2, {
      client_id: c2,
      company_name: 'ИП Сидорова',
      legal_name: null,
      tax_id: '5009876543',
      website: null,
      industry: 'Retail',
      description: 'Интересуется оптовыми закупками.',
      is_active: true,
      archived_at: null,
      created_at: '2024-07-15T09:00:00Z',
      updated_at: '2025-02-20T11:00:00Z',
      manager_id: adminId,
      deleted_at: null,
    });

    this.clients.set(c3, {
      client_id: c3,
      company_name: 'ЗАО "ТехноПром"',
      legal_name: 'Закрытое акционерное общество "ТехноПром"',
      tax_id: '7800567890',
      website: 'https://technoprom.example.com',
      industry: 'Manufacturing',
      description: 'Новый лид с выставки.',
      is_active: false,
      archived_at: null,
      created_at: '2025-04-01T08:00:00Z',
      updated_at: '2025-04-01T08:00:00Z',
      manager_id: null,
      deleted_at: null,
    });

    // Контакты
    this.contacts.set(uuidv4(), {
      contact_id: uuidv4(),
      client_id: c1,
      first_name: 'Иван',
      last_name: 'Петров',
      email: 'ivan@example.com',
      phone: '+7 (999) 123-45-67',
      is_primary: true,
      deleted_at: null,
    });
    this.contacts.set(uuidv4(), {
      contact_id: uuidv4(),
      client_id: c2,
      first_name: 'Мария',
      last_name: 'Сидорова',
      email: 'maria@example.com',
      phone: '+7 (999) 765-43-21',
      is_primary: true,
      deleted_at: null,
    });
    this.contacts.set(uuidv4(), {
      contact_id: uuidv4(),
      client_id: c3,
      first_name: 'Алексей',
      last_name: 'Смирнов',
      email: 'alex@example.com',
      phone: '+7 (999) 555-55-55',
      is_primary: true,
      deleted_at: null,
    });

    // Адреса
    this.addresses.set(uuidv4(), {
      address_id: uuidv4(),
      client_id: c1,
      address_type: 'legal',
      country: 'Россия',
      city: 'Москва',
      state_region: 'Москва',
      postal_code: '101000',
      address_line_1: 'ул. Тверская, д. 1',
      address_line_2: 'офис 500',
      deleted_at: null,
      created_at: '2024-06-01T10:00:00Z',
    });
    this.addresses.set(uuidv4(), {
      address_id: uuidv4(),
      client_id: c1,
      address_type: 'shipping',
      country: 'Россия',
      city: 'Москва',
      state_region: 'Москва',
      postal_code: '101000',
      address_line_1: 'ул. Складская, д. 5',
      address_line_2: null,
      deleted_at: null,
      created_at: '2024-06-01T10:00:00Z',
    });
    this.addresses.set(uuidv4(), {
      address_id: uuidv4(),
      client_id: c2,
      address_type: 'legal',
      country: 'Россия',
      city: 'Санкт-Петербург',
      state_region: 'Санкт-Петербург',
      postal_code: '190000',
      address_line_1: 'наб. реки Мойки, д. 40',
      address_line_2: null,
      deleted_at: null,
      created_at: '2024-07-15T09:00:00Z',
    });

    // Заметки
    this.notes.set(uuidv4(), {
      note_id: uuidv4(),
      client_id: c1,
      author_id: adminId,
      content: 'Обсудили условия нового контракта. Клиент запросил скидку 5%.',
      is_internal: false,
      deleted_at: null,
      created_at: '2025-03-10T14:00:00Z',
    });
    this.notes.set(uuidv4(), {
      note_id: uuidv4(),
      client_id: c1,
      author_id: adminId,
      content: 'Клиент любит кофе, всегда предлагать эспрессо при встрече.',
      is_internal: true,
      deleted_at: null,
      created_at: '2025-02-01T09:00:00Z',
    });
    this.notes.set(uuidv4(), {
      note_id: uuidv4(),
      client_id: c2,
      author_id: adminId,
      content: 'Отправили КП на оптовую партию. Ждем ответа до конца недели.',
      is_internal: false,
      deleted_at: null,
      created_at: '2025-04-14T11:00:00Z',
    });

    // ===== Заказы =====
    const o1 = uuidv4();
    const o2 = uuidv4();

    this.orders.set(o1, {
      order_id: o1,
      order_number: 'ORD-1001',
      client_id: c1,
      order_status_id: osProgress,
      priority_id: pHigh,
      title: 'Поставка кофемашин',
      description: 'Поставка 3 промышленных кофемашин для офиса.',
      total_amount: 150000,
      currency_code: 'RUB',
      due_date: '2025-05-20T18:00:00Z',
      assigned_manager_id: adminId,
      deleted_at: null,
      created_at: '2025-01-20T12:00:00Z',
      updated_at: '2025-04-15T16:00:00Z',
    });

    this.orders.set(o2, {
      order_id: o2,
      order_number: 'ORD-1002',
      client_id: c2,
      order_status_id: osNew,
      priority_id: pMedium,
      title: 'Ежемесячная поставка канцтоваров',
      description: 'Канцтовары для офиса на 3 месяца.',
      total_amount: 25000,
      currency_code: 'RUB',
      due_date: null,
      assigned_manager_id: null,
      deleted_at: null,
      created_at: '2025-04-01T09:30:00Z',
      updated_at: '2025-04-01T09:30:00Z',
    });

    // Позиции заказов
    this.orderItems.set(uuidv4(), {
      order_item_id: uuidv4(),
      order_id: o1,
      product_name: 'Кофемашина DeLonghi',
      description: 'Промышленная кофемашина',
      quantity: 2,
      unit_price: 50000,
      total_price: 100000,
      created_at: '2025-01-20T12:00:00Z',
    });
    this.orderItems.set(uuidv4(), {
      order_item_id: uuidv4(),
      order_id: o1,
      product_name: 'Кофемашина Saeco',
      description: null,
      quantity: 1,
      unit_price: 50000,
      total_price: 50000,
      created_at: '2025-01-20T12:00:00Z',
    });
    this.orderItems.set(uuidv4(), {
      order_item_id: uuidv4(),
      order_id: o2,
      product_name: 'Бумага А4',
      description: 'Белая, 500 листов',
      quantity: 10,
      unit_price: 300,
      total_price: 3000,
      created_at: '2025-04-01T09:30:00Z',
    });
    this.orderItems.set(uuidv4(), {
      order_item_id: uuidv4(),
      order_id: o2,
      product_name: 'Ручки шариковые',
      description: 'Синие, набор 50 шт',
      quantity: 5,
      unit_price: 400,
      total_price: 2000,
      created_at: '2025-04-01T09:30:00Z',
    });

    // Комментарии к заказам
    this.orderComments.set(uuidv4(), {
      order_comment_id: uuidv4(),
      order_id: o1,
      author_id: adminId,
      content: 'Клиент просит ускорить доставку.',
      is_internal: false,
      deleted_at: null,
      created_at: '2025-04-10T10:00:00Z',
    });

    // ===== Задачи =====
    const t1 = uuidv4();
    const t2 = uuidv4();
    const t3 = uuidv4();

    this.tasks.set(t1, {
      task_id: t1,
      title: 'Позвонить Ивану',
      description: 'Обсудить условия нового договора.',
      client_id: c1,
      order_id: o1,
      task_status_id: tsOpen,
      priority_id: pHigh,
      assignee_id: adminId,
      created_by: adminId,
      due_date: '2025-05-15T18:00:00Z',
      deleted_at: null,
      created_at: '2025-04-10T08:00:00Z',
      updated_at: '2025-04-10T08:00:00Z',
    });

    this.tasks.set(t2, {
      task_id: t2,
      title: 'Подготовить КП для Марии',
      description: 'Сделать коммерческое предложение на оптовую партию.',
      client_id: c2,
      order_id: null,
      task_status_id: tsProgress,
      priority_id: pMedium,
      assignee_id: adminId,
      created_by: adminId,
      due_date: '2025-05-20T18:00:00Z',
      deleted_at: null,
      created_at: '2025-04-12T10:00:00Z',
      updated_at: '2025-04-14T15:00:00Z',
    });

    this.tasks.set(t3, {
      task_id: t3,
      title: 'Обновить CRM',
      description: 'Перенести базу на JSON для демонстрации.',
      client_id: null,
      order_id: null,
      task_status_id: tsProgress,
      priority_id: pHigh,
      assignee_id: null,
      created_by: adminId,
      due_date: '2025-05-10T18:00:00Z',
      deleted_at: null,
      created_at: '2025-04-20T12:00:00Z',
      updated_at: '2025-05-05T09:00:00Z',
    });

    this.taskComments.set(uuidv4(), {
      task_comment_id: uuidv4(),
      task_id: t2,
      author_id: adminId,
      content: 'Черновик готов, нужно проверить цифры.',
      is_internal: true,
      deleted_at: null,
      created_at: '2025-04-14T12:00:00Z',
    });
  }

  private async delay(ms = 150): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ============ Пользователи ============
  async getUserByEmail(email: string): Promise<JsonUser | null> {
    await this.delay();
    for (const user of this.users.values()) {
      if (
        user.email.toLowerCase() === email.toLowerCase() &&
        !user.deleted_at &&
        user.is_active
      ) {
        return { ...user };
      }
    }
    return null;
  }

  async getUserById(userId: string): Promise<JsonUser | null> {
    await this.delay();
    const user = this.users.get(userId);
    if (user && !user.deleted_at && user.is_active) return { ...user };
    return null;
  }

  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<JsonUser> {
    await this.delay();
    const id = uuidv4();
    const user: JsonUser = {
      user_id: id,
      email: data.email,
      password_hash: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      is_active: true,
      deleted_at: null,
      created_at: new Date().toISOString(),
    };
    this.users.set(id, user);
    return { ...user };
  }

  // ============ Клиенты (список) ============
  async getClients(params?: {
    search?: string;
    status?: string;
  }): Promise<JsonClient[]> {
    await this.delay(200);
    const search = params?.search?.toLowerCase() ?? '';
    const status = params?.status ?? 'all';

    let result = Array.from(this.clients.values()).filter((c) => !c.deleted_at);

    if (search) {
      result = result.filter((c) =>
        c.company_name.toLowerCase().includes(search)
      );
    }
    if (status === 'active') result = result.filter((c) => c.is_active);
    if (status === 'inactive') result = result.filter((c) => !c.is_active);

    result.sort((a, b) => b.created_at.localeCompare(a.created_at));
    return result.map((c) => ({ ...c }));
  }

  async getClientById(clientId: string): Promise<JsonClient | null> {
    await this.delay();
    const c = this.clients.get(clientId);
    return c && !c.deleted_at ? { ...c } : null;
  }

  async getContactsByClientId(clientId: string): Promise<JsonContact[]> {
    await this.delay();
    return Array.from(this.contacts.values()).filter(
      (c) => c.client_id === clientId && !c.deleted_at
    );
  }

  async getAddressesByClientId(clientId: string): Promise<JsonAddress[]> {
    await this.delay();
    return Array.from(this.addresses.values()).filter(
      (a) => a.client_id === clientId && !a.deleted_at
    );
  }

  async getNotesByClientId(
    clientId: string,
    limit = 5
  ): Promise<{ note: JsonNote; authorName: string }[]> {
    await this.delay();
    const notes = Array.from(this.notes.values())
      .filter((n) => n.client_id === clientId && !n.deleted_at)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit);

    return notes.map((n) => {
      const author = this.users.get(n.author_id);
      return {
        note: n,
        authorName: author
          ? `${author.first_name} ${author.last_name}`
          : 'Unknown',
      };
    });
  }

  // ============ Заказы (список) ============
  async getOrders(params?: {
    search?: string;
    status?: string;
  }): Promise<JsonOrder[]> {
    await this.delay(200);
    const search = params?.search?.toLowerCase() ?? '';
    const status = params?.status ?? 'all';

    let result = Array.from(this.orders.values()).filter((o) => !o.deleted_at);

    if (search) {
      result = result.filter(
        (o) =>
          o.order_number.toLowerCase().includes(search) ||
          o.title.toLowerCase().includes(search)
      );
    }
    if (status !== 'all') {
      result = result.filter((o) => {
        const os = this.orderStatuses.get(o.order_status_id);
        return os?.status_code === status;
      });
    }

    result.sort((a, b) => b.created_at.localeCompare(a.created_at));
    return result.map((o) => ({ ...o }));
  }

  async getOrderById(orderId: string): Promise<JsonOrder | null> {
    await this.delay();
    const o = this.orders.get(orderId);
    return o && !o.deleted_at ? { ...o } : null;
  }

  getOrderStatus(statusId: string): JsonOrderStatus | undefined {
    return this.orderStatuses.get(statusId);
  }

  getPriority(priorityId: string | null): JsonPriority | undefined {
    if (!priorityId) return undefined;
    return this.priorities.get(priorityId);
  }

  async getOrderItems(orderId: string): Promise<JsonOrderItem[]> {
    await this.delay();
    return Array.from(this.orderItems.values())
      .filter((i) => i.order_id === orderId)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
  }

  async getOrderComments(
    orderId: string,
    limit = 5
  ): Promise<{ comment: JsonOrderComment; authorName: string }[]> {
    await this.delay();
    const comments = Array.from(this.orderComments.values())
      .filter((c) => c.order_id === orderId && !c.deleted_at)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit);

    return comments.map((c) => {
      const author = this.users.get(c.author_id);
      return {
        comment: c,
        authorName: author
          ? `${author.first_name} ${author.last_name}`
          : 'Unknown',
      };
    });
  }

  // ============ Задачи (список) ============
  async getTasks(params?: {
    search?: string;
    status?: string;
  }): Promise<JsonTask[]> {
    await this.delay(200);
    const search = params?.search?.toLowerCase() ?? '';
    const status = params?.status ?? 'all';

    let result = Array.from(this.tasks.values()).filter((t) => !t.deleted_at);

    if (search) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          (t.description ?? '').toLowerCase().includes(search)
      );
    }
    if (status !== 'all') {
      result = result.filter((t) => {
        const ts = this.taskStatuses.get(t.task_status_id);
        return ts?.status_code === status;
      });
    }

    result.sort((a, b) => b.created_at.localeCompare(a.created_at));
    return result.map((t) => ({ ...t }));
  }

  async getTaskById(taskId: string): Promise<JsonTask | null> {
    await this.delay();
    const t = this.tasks.get(taskId);
    return t && !t.deleted_at ? { ...t } : null;
  }

  getTaskStatus(statusId: string): JsonTaskStatus | undefined {
    return this.taskStatuses.get(statusId);
  }

  async getTaskComments(
    taskId: string,
    limit = 5
  ): Promise<{ comment: JsonTaskComment; authorName: string }[]> {
    await this.delay();
    const comments = Array.from(this.taskComments.values())
      .filter((c) => c.task_id === taskId && !c.deleted_at)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit);

    return comments.map((c) => {
      const author = this.users.get(c.author_id);
      return {
        comment: c,
        authorName: author
          ? `${author.first_name} ${author.last_name}`
          : 'Unknown',
      };
    });
  }

  // Получить имя клиента по id
  getClientName(clientId: string): string | null {
    const c = this.clients.get(clientId);
    return c ? c.company_name : null;
  }
}

// Глобальный синглтон
const globalDb = globalThis as unknown as { __jsonDb?: JsonDatabase };

if (!globalDb.__jsonDb) {
  globalDb.__jsonDb = new JsonDatabase();
}

export const db = globalDb.__jsonDb;

// Для обратной совместимости
export const pool = {
  query: async (text: string, params?: unknown[]) => {
    console.warn('pool.query вызван в JSON-режиме.', { text, params });
    return { rows: [], rowCount: 0 };
  },
};
