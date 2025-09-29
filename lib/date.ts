export const getTodayInMexicoCity = (): string => {
  // Uses en-CA locale to get the YYYY-MM-DD format reliably.
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
};

/**
 * Calculates the date range for the current week (Monday to Sunday).
 * Dates are returned in 'YYYY-MM-DD' format for consistency with Supabase queries.
 */
export const getWeekDateRange = () => {
  // Get the date string for the target timezone. This is our source of truth.
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });

  // Create a date object from this string. JS treats this as UTC midnight.
  const today = new Date(todayStr);

  // Explicitly use UTC methods for calculation to avoid ambiguity.
  const dayOfWeek = today.getUTCDay(); // Sunday = 0, Monday = 1, etc.

  // Adjust so Monday is 0 and Sunday is 6
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startOfWeek = new Date(today);
  startOfWeek.setUTCDate(today.getUTCDate() - adjustedDay);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return {
    startOfWeek: formatDate(startOfWeek),
    endOfWeek: formatDate(endOfWeek),
  };
};