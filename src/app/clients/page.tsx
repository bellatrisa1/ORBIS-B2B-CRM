import { AppShell } from '@/shared/ui/app-shell';
import { getClients } from '@/features/server/get-clients';
import { ClientsTable } from '@/features/clients/clients-table';

type ClientsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: 'all' | 'active' | 'inactive';
  }>;
};

export const dynamic = 'force-dynamic';

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams.search ?? '';
  const status = resolvedSearchParams.status ?? 'all';

  const clients = await getClients({
    search,
    status,
  });

  return (
    <AppShell>
      <section className="page-section">
        <div className="page-section__header">
          <div>
            <p className="page-section__eyebrow">CRM Module</p>
            <h1 className="page-section__title">Clients</h1>
          </div>

        </div>

        <ClientsTable clients={clients} search={search} status={status} />
      </section>
    </AppShell>
  );
}
