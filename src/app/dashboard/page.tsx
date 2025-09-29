import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  // This server component now simply renders the client component.
  // The client component will be responsible for fetching all data, including the user.
  return <DashboardClient />;
}
