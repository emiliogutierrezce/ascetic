import DashboardClient from './DashboardClient';
import { getTodayInMexicoCity } from '../../../lib/date';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  // This server component now simply renders the client component.
  // The client component will be responsible for fetching all data, including the user.
  // By adding a key that changes daily, we ensure the client component remounts
  // and refetches data when the user visits on a new day.
  const today = getTodayInMexicoCity();
  return <DashboardClient key={today} />;
}