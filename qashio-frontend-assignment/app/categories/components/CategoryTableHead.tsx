'use client';

import CustomTableHead from '@/app/components/CustomTableHead';

export default function CategoryTableHead() {
  return (
    <CustomTableHead
      columns={[
        { label: 'Category' },
        { label: 'Current Budget' },
        { label: 'Total Spent' },
        { label: 'Remaining' },
        { label: 'Utilization' },
        { label: 'Status' },
      ]}
    />
  )
}
