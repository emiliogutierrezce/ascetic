import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Function to get today's date in YYYY-MM-DD format for a specific timezone
const getTodayDateString = (timeZone: string): string => {
  // Uses en-CA locale to get the YYYY-MM-DD format reliably.
  return new Date().toLocaleDateString('en-CA', { timeZone });
};

// Main function handler
Deno.serve(async (req) => {
  try {
    // Create a Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get today's date in Mexico City
    const todayInMexicoCity = getTodayDateString('America/Mexico_City');

    // Delete todos that were marked as 'terminado' and are from a previous day
    const { error } = await supabaseAdmin
      .from('todos')
      .delete()
      .eq('status', 'terminado')
      .lt('due_date', todayInMexicoCity);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ message: "Completed todos from previous days have been deleted." }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});
