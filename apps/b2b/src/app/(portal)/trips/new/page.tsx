import type { Metadata } from 'next';
import { CreateTripWizard } from './CreateTripWizard';

export const metadata: Metadata = { title: 'إنشاء رحلة جديدة — LoopWay' };

export default function NewTripPage() {
  return <CreateTripWizard />;
}
