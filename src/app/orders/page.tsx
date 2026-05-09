import { AppShell } from '@/shared/ui/app-shell';
import { getOrders } from '@/features/server/get-orders';
import { OrdersTable } from '@/features/orders/orders-table';

type OrdersPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams.search ?? '';
  const status = resolvedSearchParams.status ?? 'all';

  const orders = await getOrders({
    search,
    status,
  });

  return (
    <AppShell>
      <section className="page-section">
        <div className="page-section__header">
          <div>
            <p className="page-section__eyebrow">CRM Module</p>
            <h1 className="page-section__title">Orders</h1>
          </div>
        </div>

        <OrdersTable orders={orders} search={search} status={status} />
      </section>
    </AppShell>
  );
}
