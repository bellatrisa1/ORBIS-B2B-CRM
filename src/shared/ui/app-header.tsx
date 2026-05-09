import { getSessionUser } from '@/shared/lib/auth';

export async function AppHeader() {
  const user = await getSessionUser();

  return (
    <header className="app-header">
      <div>
        <p className="app-header__eyebrow">Orbis CRM</p>
        <h1 className="app-header__title">Workspace</h1>
      </div>

      <div className="app-header__meta">
        {user ? (
          <div className="app-header__user">
            <span className="app-header__user-name">
              {user.firstName} {user.lastName}
            </span>
            <span className="app-header__user-email">{user.email}</span>
            {user.role ? (
              <span className="app-header__user-role">{user.role}</span>
            ) : null}
          </div>
        ) : (
          <span className="app-header__status">Guest</span>
        )}
      </div>
    </header>
  );
}
