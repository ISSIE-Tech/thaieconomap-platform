'use client';

import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import { useMemo, useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { createTypeNameMap } from 'src/shared/utils/url-filter';
import { FilterHeader } from 'src/modules/commercials/filter-drawer';
import {
  filterStyle,
  selectedFilterStyle,
} from 'src/modules/commercials/filter-drawer/filter-tags';

import { useJobsStore } from '../_store/jobs.store';
import { jobsFilterDefault } from '../_constants/jobs-filter';
import useGetJobCategories from '../_hooks/use-get-job-categories';

type Props = {
  controller: UseBooleanReturn;
};

export const JobsFilterDrawer = ({ controller }: Props) => {
  // used to find category name from id
  const { data: categories } = useGetJobCategories();
  const categoryIdNameMap = useMemo(() => createTypeNameMap(categories ?? []), [categories]);

  // unconfirmed filter, confirm when click the confirm button
  const selectedCategoryId = useJobsStore((state) => state.category);
  const [tempCategoryId, setTempCategoryId] = useState(jobsFilterDefault.category);

  useEffect(() => {
    setTempCategoryId(selectedCategoryId);
  }, [selectedCategoryId]);

  const toggleTempCategory = useCallback(
    (newTempCategory: string) => {
      if (tempCategoryId === newTempCategory) {
        setTempCategoryId('');
      } else {
        setTempCategoryId(newTempCategory);
      }
    },
    [tempCategoryId]
  );

  // confirm newly selected filters
  const { toggleCategory } = useJobsStore((state) => state.actions);
  const confirmFilterChanges = useCallback(() => {
    toggleCategory(tempCategoryId);
    controller.onFalse();
  }, [controller, tempCategoryId, toggleCategory]);

  return (
    <Drawer
      open={controller.value}
      onClose={controller.onFalse}
      anchor="bottom"
      hideBackdrop
      PaperProps={{
        sx: { width: { xs: '100vw', md: 480 }, ml: 'auto', overflowX: 'hidden', pb: 8 },
      }}
    >
      <FilterHeader controller={controller} />

      <Stack spacing={2} px={3}>
        <Typography fontWeight="bold">ประเภทงาน</Typography>

        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', overflowX: 'hidden' }}>
          {categories &&
            categories.map((category) => (
              <Button
                key={category._id}
                variant={category._id === tempCategoryId ? 'contained' : 'outlined'}
                sx={category._id === tempCategoryId ? selectedFilterStyle : filterStyle}
                // When that type is clicked, toggle its truth value
                onClick={() => toggleTempCategory(category._id)}
              >
                {categoryIdNameMap[category._id]}
              </Button>
            ))}
        </Stack>

        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: '9999px', mt: 4 }}
          onClick={confirmFilterChanges}
        >
          ยืนยัน
        </Button>
      </Stack>
    </Drawer>
  );
};
