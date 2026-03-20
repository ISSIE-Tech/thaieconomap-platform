'use client';

import type { UseMutateAsyncFunction } from '@tanstack/react-query';

import { toast } from 'sonner';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import type { CommercialType } from '../../types';

// ----------------------------------------------------------------------

type Props = {
  commercialType: CommercialType;
  deleteMutation: UseMutateAsyncFunction<null, Error, string, unknown>;
  deletePending: boolean;
};

export default function CommercialTypeItem({
  commercialType,
  deleteMutation,
  deletePending,
}: Props) {
  const deleteDialog = useBoolean();

  const handleDeleteRestaurantType = async () => {
    try {
      await deleteMutation(commercialType._id);

      deleteDialog.onFalse();

      toast.success(`ลบ${commercialType.name}สำเร็จ`);
    } catch (error) {
      console.log(error);
      toast.error(error.display);
    }
  };

  return (
    <>
      <ListItem>
        <Button color="inherit" onClick={deleteDialog.onTrue}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </Button>

        <Typography variant="body1" fontWeight="600">
          {commercialType.name}
        </Typography>
      </ListItem>

      <ConfirmDialog
        open={deleteDialog.value}
        onClose={deleteDialog.onFalse}
        title="ยืนยันการลบประเภทร้านอาหาร"
        content={
          <Box>
            คุณต้องการยืนยันการลบ{' '}
            <Typography
              component="span"
              fontWeight="600"
              fontSize={14}
              sx={{ textDecoration: 'underline' }}
            >
              {commercialType.name}
            </Typography>{' '}
            ใช่หรือไม่?
          </Box>
        }
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleDeleteRestaurantType}
            loading={deletePending}
          >
            ลบ
          </LoadingButton>
        }
      />
    </>
  );
}
