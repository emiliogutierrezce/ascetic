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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          ascetic
        </h1>
        <AuthForm />
      </div>
    </main>
  )
}