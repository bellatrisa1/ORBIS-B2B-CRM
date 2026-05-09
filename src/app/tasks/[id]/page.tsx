import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTaskById } from '@/features/server/get-task-by-id';
import { TaskDetailsCard } from '@/features/tasks/task-details';
import { AppShell } from '@/shared/ui/app-shell';

type TaskPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;
  const task = await getTaskById(id);

  if (!task) {
    notFound();
  }

  return (
    <AppShell>
      <section className="page-section">
        <div className="page-section__header">
          <div>
            <p className="page-section__eyebrow">CRM Module</p>
            <h1 className="page-section__title">{task.title}</h1>
          </div>

          <div className="page-actions">
            <Link href="/tasks" className="secondary-link">
              ← Назад к задачам
            </Link>
          </div>
        </div>

        <TaskDetailsCard task={task} />
      </section>
    </AppShell>
  );
}
