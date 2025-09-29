// app/dashboard/layout.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '../components/LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 antialiased">
      <header className="sticky top-0 z-50 w-full border-b border-cyan-500/10 bg-slate-950/80 backdrop-blur-sm">
        <nav className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-mono text-lg font-bold text-cyan-400">
              ascetic
            </Link>
            <Link
              href="/dashboard/pendientes"
              className="text-sm text-slate-400 transition-colors hover:text-cyan-400"
            >
              Pendientes
            </Link>
            <Link
              href="/dashboard/habitos"
              className="text-sm text-slate-400 transition-colors hover:text-cyan-400"
            >
              Hábitos
            </Link>
            <Link
              href="/dashboard/enfoque"
              className="text-sm text-slate-400 transition-colors hover:text-cyan-400"
            >
              Enfoque
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">{session.user.email}</span>
            <LogoutButton />
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}