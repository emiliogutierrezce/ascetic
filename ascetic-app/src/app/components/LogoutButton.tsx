'use client'; // <-- PASO 1: Indicar que es un Componente de Cliente

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // PASO 2: Crear una función que se ejecuta en el navegador
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redirigir a la página de inicio
    router.refresh(); // Limpiar el caché del router
  };

  return (
    // PASO 3: Cambiar el <form> por un <button> con onClick
    <button
      onClick={handleSignOut}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
    >
      Cerrar Sesión
    </button>
  );
}