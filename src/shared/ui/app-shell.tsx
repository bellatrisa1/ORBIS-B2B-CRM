import Link from 'next/link';
import { getSessionUser } from '@/shared/lib/auth';
import { redirect } from 'next/navigation';
import { AppHeader } from '@/shared/ui/app-header';
import { AppSidebar } from '@/shared/ui/app-sidebar';

type AppShellProps = {
  children: React.ReactNode;
};

export async function AppShell({ children }: AppShellProps) {
  const session = await getSessionUser();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div className="app-shell__logo">
          <Link href="/">Orbis CRM</Link>
        </div>

        <AppSidebar />
      </aside>

      <div className="app-shell__content">
        <AppHeader />
        <main className="app-shell__main">{children}</main>
      </div>
    </div>
  );
}
