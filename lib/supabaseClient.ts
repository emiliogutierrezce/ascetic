import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

// IMPORTANT: We are using createPagesBrowserClient here because we are using the `pages` directory.
// If you were to switch to the `app` directory, you would use createBrowserClient.
export const supabase = createPagesBrowserClient()