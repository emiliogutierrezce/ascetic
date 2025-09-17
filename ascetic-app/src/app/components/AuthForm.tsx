'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthForm() {
  const supabase = createClientComponentClient()

  return (
    <div className="w-full max-w-md">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
        providers={['google']} // Opcional: para login con Google, etc.
        redirectTo={`${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/auth/callback`}
      />
    </div>
  )
}