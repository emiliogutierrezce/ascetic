import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AuthForm from './components/AuthForm'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard') // Redirige al dashboard si ya hay sesión
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4">
      <div className="container flex max-w-lg flex-col items-center justify-center text-center">
        <h1 className="font-mono text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_theme(colors.cyan.500/0.5)] sm:text-6xl">
          ascetic
        </h1>
        <p className="mt-4 text-slate-400">
          A minimalist toolkit for focus and discipline.
        </p>
        <div className="mt-8 w-full">
          <AuthForm />
        </div>
      </div>
    </main>
  )
}