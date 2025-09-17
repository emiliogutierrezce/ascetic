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
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">
            ascetic
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{session.user.email}</span>
            <LogoutButton />
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-8">
        {children}
      </main>
    </div>
  );
}