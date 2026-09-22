'use client';

import { OptionList } from './option-list';
import { useGetJobCategories, useCreateJobCategory, useDeleteJobCategory } from '../_hooks/use-csc-options';

export function JobCategories() {
  const { data } = useGetJobCategories();
  const { mutateAsync: create } = useCreateJobCategory();
  const { mutateAsync: remove } = useDeleteJobCategory();

  return (
    <OptionList
      withIcon
      heading="ประเภทงาน"
      options={data}
      onDelete={remove}
      onCreate={(name, icon) => {
        const formData = new FormData();
        formData.append('name', name);
        if (icon) formData.append('iconImage', icon);

        return create(formData);
      }}
    />
  );
}
