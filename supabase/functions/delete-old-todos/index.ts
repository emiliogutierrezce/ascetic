import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Manejador principal de la función
Deno.serve(async (req) => {
  try {
    // Crea un cliente de Supabase con permisos de administrador
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Calcula el inicio del día actual en UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const startOfTodayUTC = today.toISOString();

    // Ejecuta la consulta para borrar los pendientes completados de días anteriores
    const { error } = await supabaseAdmin
      .from('todos')
      .delete()
      .eq('status', 'terminado')
      .lt('updated_at', startOfTodayUTC);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ message: "Tareas completadas antiguas han sido eliminadas." }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});