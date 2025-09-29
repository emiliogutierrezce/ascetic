export const getTodayInMexicoCity = (): string => {
  // Uses en-CA locale to get the YYYY-MM-DD format reliably.
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
};

/**
 * Calculates the date range for the current week (Monday to Sunday).
 * Dates are returned in 'YYYY-MM-DD' format for consistency with Supabase queries.
 */
export const getWeekDateRange = () => {
  const now = new Date();
  const today = new Date(now.toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' }));

  const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
  
  // Adjust so Monday is 0 and Sunday is 6
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - adjustedDay);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  // Format dates to YYYY-MM-DD string
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return {
    startOfWeek: formatDate(startOfWeek),
    endOfWeek: formatDate(endOfWeek),
  };
};