import { notFound } from 'next/navigation';
import { ALL_TRIPS, findTrip } from '@/mocks/trips';
import { TripWorkspace } from './TripWorkspace';

export function generateStaticParams() {
  return ALL_TRIPS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `${id} — رحلاتي — LoopWay` };
}

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = findTrip(id);
  if (!trip) notFound();
  return <TripWorkspace trip={trip} />;
}
