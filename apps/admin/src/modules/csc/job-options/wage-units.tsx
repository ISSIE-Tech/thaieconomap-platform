'use client';

import { OptionList } from './option-list';
import { useGetWageUnits, useCreateWageUnit, useDeleteWageUnit } from '../_hooks/use-csc-options';

export function WageUnits() {
  const { data } = useGetWageUnits();
  const { mutateAsync: create } = useCreateWageUnit();
  const { mutateAsync: remove } = useDeleteWageUnit();

  return <OptionList heading="หน่วยค่าตอบแทน" options={data} onCreate={(name) => create(name)} onDelete={remove} />;
}
