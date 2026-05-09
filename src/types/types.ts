// ===== AUTH / SESSION =====

export type UserRole = 'admin' | 'manager' | 'support';

export type Permission =
  | 'clients.read'
  | 'clients.write'
  | 'orders.read'
  | 'orders.write'
  | 'tasks.read'
  | 'tasks.write'
  | 'users.read'
  | 'users.write';

export type SessionUser = {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
};

export type AuthSession = {
  user: SessionUser;
};

// ===== CLIENTS =====

export type Client = {
  clientId: string;
  companyName: string;
  legalName: string | null;
  taxId: string | null;
  website: string | null;
  industry: string | null;
  isActive: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  primaryContactName: string | null;
  primaryContactEmail: string | null;
  primaryContactPhone: string | null;
};

export type ClientAddress = {
  addressId: string;
  addressType: 'legal' | 'billing' | 'shipping' | 'office';
  country: string | null;
  city: string | null;
  stateRegion: string | null;
  postalCode: string | null;
  addressLine1: string;
  addressLine2: string | null;
};

export type ClientNote = {
  noteId: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  authorFullName: string;
};

export type ClientDetails = {
  clientId: string;
  companyName: string;
  legalName: string | null;
  taxId: string | null;
  website: string | null;
  industry: string | null;
  description: string | null;
  isActive: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  managerId: string | null;
  primaryContactName: string | null;
  primaryContactEmail: string | null;
  primaryContactPhone: string | null;
  addresses: ClientAddress[];
  notes: ClientNote[];
};

// ===== ORDERS =====

export type OrderListItem = {
  orderId: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  statusCode: string;
  statusName: string;
  priorityCode: string | null;
  priorityName: string | null;
  title: string;
  totalAmount: string;
  currencyCode: string;
  dueDate: string | null;
  createdAt: string;
  assignedManagerId: string | null;
};

export type OrderFilters = {
  search: string;
  status: string;
};

export type OrderItem = {
  orderItemId: string;
  productName: string;
  description: string | null;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
};

export type OrderComment = {
  orderCommentId: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  authorFullName: string;
};

export type OrderDetails = {
  orderId: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  statusCode: string;
  statusName: string;
  priorityCode: string | null;
  priorityName: string | null;
  title: string;
  description: string | null;
  totalAmount: string;
  currencyCode: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignedManagerId: string | null;
  items: OrderItem[];
  comments: OrderComment[];
};

// ===== TASKS =====

export type TaskListItem = {
  taskId: string;
  title: string;
  description: string | null;
  clientId: string | null;
  clientName: string | null;
  orderId: string | null;
  orderNumber: string | null;
  statusCode: string;
  statusName: string;
  priorityCode: string | null;
  priorityName: string | null;
  assigneeId: string | null;
  assigneeFullName: string | null;
  dueDate: string | null;
  createdAt: string;
};

export type TaskFilters = {
  search: string;
  status: string;
};

export type TaskComment = {
  taskCommentId: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  authorFullName: string;
};

export type TaskDetails = {
  taskId: string;
  title: string;
  description: string | null;
  clientId: string | null;
  clientName: string | null;
  orderId: string | null;
  orderNumber: string | null;
  statusCode: string;
  statusName: string;
  priorityCode: string | null;
  priorityName: string | null;
  assigneeId: string | null;
  assigneeFullName: string | null;
  createdBy: string;
  createdByFullName: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  comments: TaskComment[];
};
