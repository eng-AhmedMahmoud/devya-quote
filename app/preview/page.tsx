import { headers } from 'next/headers';
import { PreviewClient } from '@/components/preview/preview-client';
import { resolveRegion } from '@/lib/region';

export const dynamic = 'force-dynamic';

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const h = await headers();
  const { region: override } = await searchParams;
  const region = resolveRegion(h.get('host'), override);
  return <PreviewClient region={region} />;
}
