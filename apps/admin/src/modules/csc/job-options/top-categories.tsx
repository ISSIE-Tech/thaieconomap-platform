'use client';

import type { JobCategory } from '../types';

import { useState, useEffect } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';

import { Card, Stack, Button, TextField, Typography, Autocomplete } from '@mui/material';

import { paths } from 'src/routes/paths';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useGetJobCategories, useArrangeJobCategories } from '../_hooks/use-csc-options';

const TOP = 5; // backend requires exactly 5 (ArrayMinSize/ArrayMaxSize)

// the LIFF home shows these 5 categories, in this order
export function TopCategories() {
  const { data: categories = [] } = useGetJobCategories();
  const { mutate, isPending } = useArrangeJobCategories();
  const [selected, setSelected] = useState<JobCategory[]>([]);

  useEffect(() => {
    setSelected(categories.filter((category) => category.isMain).sort((a, b) => a.index - b.index));
  }, [categories]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="ประเภทงาน 5 อันดับ"
        links={[{ name: 'งาน', href: paths.csc.dashboard.jobs.root }, { name: 'ตัวเลือก' }, { name: '5 อันดับ' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            เลือก {TOP} ประเภทงานตามลำดับที่ต้องการแสดง
          </Typography>

          <Autocomplete
            multiple
            options={categories}
            value={selected}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            getOptionDisabled={() => selected.length >= TOP}
            onChange={(_, value) => setSelected(value)}
            renderInput={(params) => <TextField {...params} label={`ประเภทงาน (${selected.length}/${TOP})`} />}
          />

          <Button
            variant="contained"
            disabled={selected.length !== TOP || isPending}
            onClick={() =>
              mutate(
                selected.map((category) => category._id),
                {
                  onSuccess: () => toast.success('บันทึกเรียบร้อยแล้ว'),
                  onError: (error: any) => toast.error(error?.response?.data?.message ?? 'เกิดข้อผิดพลาด'),
                }
              )
            }
            sx={{ alignSelf: 'flex-end' }}
          >
            บันทึก
          </Button>
        </Stack>
      </Card>
    </DashboardContent>
  );
}
