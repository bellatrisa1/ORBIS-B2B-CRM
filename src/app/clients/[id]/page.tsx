import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/shared/ui/app-shell';
import { getClientById } from '@/features/server/get-client-by-id';
import { ClientDetailsCard } from '@/features/clients/client-details';

type ClientPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  return (
    <AppShell>
      <section className="page-section">
        <div className="page-section__header">
          <div>
            <p className="page-section__eyebrow">CRM Module</p>
            <h1 className="page-section__title">{client.companyName}</h1>
          </div>

          <div className="page-actions">
            <Link href="/clients" className="secondary-link">
              ← Назад к клиентам
            </Link>
          </div>
        </div>

        <ClientDetailsCard client={client} />
      </section>
    </AppShell>
  );
}
