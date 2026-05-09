import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/shared/ui/app-shell';
import { getOrderById } from '@/features/server/get-order-by-id';
import { OrderDetailsCard } from '@/features/orders/order-details';

type OrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <AppShell>
      <section className="page-section">
        <div className="page-section__header">
          <div>
            <p className="page-section__eyebrow">CRM Module</p>
            <h1 className="page-section__title">{order.orderNumber}</h1>
          </div>

          <div className="page-actions">
            <Link href="/orders" className="secondary-link">
              ← Назад к заказам
            </Link>
          </div>
        </div>

        <OrderDetailsCard order={order} />
      </section>
    </AppShell>
  );
}
