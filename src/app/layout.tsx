import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Orbis CRM',
  description: 'B2B admin system for clients, orders and tasks',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
