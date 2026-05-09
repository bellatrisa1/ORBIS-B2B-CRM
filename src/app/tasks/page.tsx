import { getTasks } from '@/features/server/get-tasks';
import { TasksTable } from '@/features/tasks/tasks-table';
import { AppShell } from '@/shared/ui/app-shell';

type TasksPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams.search ?? '';
  const status = resolvedSearchParams.status ?? 'all';

  const tasks = await getTasks({
    search,
    status,
  });

  return (
    <AppShell>
      <section className="page-section">
        <div className="page-section__header">
          <div>
            <p className="page-section__eyebrow">CRM Module</p>
            <h1 className="page-section__title">Tasks</h1>
          </div>

          <p className="page-section__description">
            Список задач из PostgreSQL с поиском и фильтрацией по статусу.
          </p>
        </div>

        <TasksTable tasks={tasks} search={search} status={status} />
      </section>
    </AppShell>
  );
}
