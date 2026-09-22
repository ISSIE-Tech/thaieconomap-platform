'use client';

import { OptionList } from './option-list';
import {
  useGetJobCategories,
  useCreateJobCategory,
  useDeleteJobCategory,
  useUpdateJobCategory,
} from '../_hooks/use-csc-options';

export function JobCategories() {
  const { data } = useGetJobCategories();
  const { mutateAsync: create } = useCreateJobCategory();
  const { mutateAsync: remove } = useDeleteJobCategory();
  const { mutateAsync: update } = useUpdateJobCategory();

  return (
    <OptionList
      withIcon
      heading="ประเภทงาน"
      options={data}
      onDelete={remove}
      onUpdate={(id, name, icon) => {
        const formData = new FormData();
        formData.append('name', name);
        if (icon) formData.append('iconImage', icon);

        return update({ id, params: formData });
      }}
      onCreate={(name, icon) => {
        const formData = new FormData();
        formData.append('name', name);
        if (icon) formData.append('iconImage', icon);

        return create(formData);
      }}
    />
  );
}
