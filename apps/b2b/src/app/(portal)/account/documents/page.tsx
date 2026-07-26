import type { Metadata } from 'next';
import {
  CellPrimary,
  CellSecondary,
  CellStack,
  DataTable,
  IconButtonSm,
  PageBody,
  RowIcon,
  StatusBadge,
  TableCard,
  type BadgeTone,
} from '@loopway/ui';
import { Header } from '@/components/Header';
import { DOCUMENT_ARCHIVE } from '@/mocks/workspace';
import { AccountTabs } from '../AccountTabs';

export const metadata: Metadata = { title: 'أرشيف المستندات — LoopWay' };

const STATUS: Record<string, { tone: BadgeTone; label: string }> = {
  Approved: { tone: 'success', label: 'معتمدة' },
  Archived: { tone: 'neutral', label: 'مؤرشفة' },
  'Under Review': { tone: 'warning', label: 'قيد المراجعة' },
  'Required Now': { tone: 'danger', label: 'مطلوبة الآن' },
  'Required Later': { tone: 'warning', label: 'مطلوبة لاحقاً' },
};

/** DERIVED, NOT DESIGNED — SRS M03-E07. */
export default function DocumentsPage() {
  return (
    <>
      <Header title="أرشيف المستندات" subtitle="بوليصات وإثباتات وفواتير وتصاريح كل رحلات الشركة" />
      <PageBody>
        <AccountTabs />

        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <TableCard>
            <DataTable
              head={
                <>
                  <th>المستند</th>
                  <th>الرحلة</th>
                  <th>رفعه</th>
                  <th>التاريخ</th>
                  <th>الحالة</th>
                  <th style={{ width: 44 }} />
                </>
              }
            >
              {DOCUMENT_ARCHIVE.map((d) => {
                const s = STATUS[d.status] ?? { tone: 'neutral' as BadgeTone, label: d.status };
                return (
                  <tr key={d.id}>
                    <td>
                      <CellStack>
                        <RowIcon icon="document" background="var(--lw-icon-tint-bg)" color="var(--lw-navy-800)" />
                        <div>
                          <CellPrimary>{d.documentType}</CellPrimary>
                          <CellSecondary>
                            <span className="lw-ltr">{d.id}</span> · {d.sizeLabel}
                          </CellSecondary>
                        </div>
                      </CellStack>
                    </td>
                    <td>{d.tripId ? <CellPrimary ltr>{d.tripId}</CellPrimary> : <CellSecondary>وثيقة شركة</CellSecondary>}</td>
                    <td>
                      <CellPrimary>{d.uploadedBy}</CellPrimary>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <CellPrimary>{d.uploadedAt}</CellPrimary>
                      {d.expiryDate ? <CellSecondary>تنتهي {d.expiryDate}</CellSecondary> : null}
                    </td>
                    <td>
                      <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
                    </td>
                    <td style={{ padding: '13px 10px' }}>
                      <IconButtonSm icon="download" title="تنزيل المستند" />
                    </td>
                  </tr>
                );
              })}
            </DataTable>
          </TableCard>
        </div>
      </PageBody>
    </>
  );
}
