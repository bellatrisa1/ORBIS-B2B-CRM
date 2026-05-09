import Link from 'next/link';
import { logout } from '@/features/server/logout';

const navigation = [
  {
    title: 'Dashboard',
    href: '/',
  },
  {
    title: 'Clients',
    href: '/clients',
  },
  {
    title: 'Orders',
    href: '/orders',
  },
  {
    title: 'Tasks',
    href: '/tasks',
  },
  {
    title: 'Audit logs',
    href: '/audit-logs',
  },
];

export function AppSidebar() {
  return (
    <div className="sidebar-layout">
      <nav className="sidebar-nav">
        <ul className="sidebar-nav__list">
          {navigation.map((item) => (
            <li key={item.href} className="sidebar-nav__item">
              <Link href={item.href} className="sidebar-nav__link">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-bottom">
        <form action={logout}>
          <button className="sidebar-nav__link sidebar-nav__link--danger">
            Выйти
          </button>
        </form>
      </div>
    </div>
  );
}
