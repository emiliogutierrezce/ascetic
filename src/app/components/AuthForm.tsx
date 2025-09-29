'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const customTheme: typeof ThemeSupa = {
  ...ThemeSupa,
  variables: {
    ...(ThemeSupa.variables || {}),
    colors: {
      ...(ThemeSupa.variables?.colors || {}),
      brand: '#06b6d4', // cyan-500
      brandAccent: '#22d3ee', // cyan-400
      brandButtonText: '#0f172a', // slate-900
      defaultButtonBackground: '#1e293b', // slate-800
      defaultButtonBackgroundHover: '#334155', // slate-700
      defaultButtonBorder: '#334155', // slate-700
      defaultButtonText: '#f1f5f9', // slate-100
      inputBackground: 'rgba(15, 23, 42, 0.8)', // slate-900/80
      inputBorder: '#334155', // slate-700
      inputBorderHover: '#06b6d4', // cyan-500
      inputBorderFocus: '#06b6d4', // cyan-500
      inputText: '#f1f5f9', // slate-100
      inputLabelText: '#94a3b8', // slate-400
      inputPlaceholder: '#475569', // slate-600
      messageText: '#94a3b8', // slate-400
      messageTextDanger: '#fb7185', // rose-400
      anchorTextColor: '#94a3b8', // slate-400
      anchorTextHoverColor: '#06b6d4', // cyan-500
    },
    space: {
      ...(ThemeSupa.variables?.space || {}),
      buttonPadding: '0.5rem 1rem',
      inputPadding: '0.5rem 1rem',
    },
    radii: {
      ...(ThemeSupa.variables?.radii || {}),
      borderRadiusButton: '0.375rem', // rounded-md
      inputBorderRadius: '0.375rem', // rounded-md
    }
  },
};

export default function AuthForm() {
  const supabase = createClientComponentClient()

  return (
    <div className="w-full max-w-sm">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: customTheme }}
        providers={['google']}
        redirectTo={`${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/auth/callback`}
      />
    </div>
  )
}