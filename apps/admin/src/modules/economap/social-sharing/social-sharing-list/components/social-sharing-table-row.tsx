import React, { useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import { ECONOMAP_STATUS } from 'src/modules/economap/_config/economap-status.config';

import { Image } from 'src/components/image';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import SocialSharingTableRowDrawer from './social-sharing-table-row-drawer';
import { useDeleteSocialSharing } from '../../_hooks/use-delete-social-sharing';
import { getUserRole, getUserDisplayName } from '../../../_hooks/use-user-lookup';

import type { SocialSharingItem } from '../../types';
import type { UserLookupMap } from '../../../_hooks/use-user-lookup';

// ----------------------------------------------------------------------

type Props = {
  row: SocialSharingItem;
  selected: boolean;
  onSelectRow: () => void;
  userLookup: UserLookupMap;
};

export default function SocialSharingTableRow({ row, selected, onSelectRow, userLookup }: Props) {
  const deleteSocialSharing = useDeleteSocialSharing();

  const drawerController = useBoolean();

  const deleteDialog = useBoolean();

  const handleDelete = useCallback(async () => {
    await deleteSocialSharing.mutate(row._id, {
      onSuccess: () => {
        deleteDialog.onFalse();
        toast.success('ลบข้อมูลสำเร็จ');
      },
      onError: (error) => {
        console.log(error);
        toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
      },
    });
  }, [deleteDialog, deleteSocialSharing, row._id]);

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row._id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Image
              alt={row?.name}
              src={row?.imageUrl}
              ratio="4/3"
              sx={{ width: 64, borderRadius: 1 }}
            />

            <Stack sx={{ typography: 'body2' }}>
              <Box onClick={drawerController.onTrue}>
                <Typography
                  variant="body2"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '1',
                    WebkitBoxOrient: 'vertical',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {row?.name}
                </Typography>

                <Typography variant="caption">
                  {`${row?.district.districtName} ${row?.district.provinceName}`}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.contact.phoneNumber}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row?.types.map((type) => <Box key={type._id}>{type?.name}</Box>)}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2">{fDateTime(row?.createdAt)}</Typography>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2">{fDateTime(row?.updatedAt)}</Typography>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2">
            {getUserDisplayName(userLookup, row?.createdBy?._id)}
          </Typography>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2">
            {getUserDisplayName(userLookup, row?.lastModifiedBy?._id)}
          </Typography>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2">
            {getUserDisplayName(userLookup, row?.approvedBy?._id)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {getUserRole(userLookup, row?.approvedBy?._id)}
          </Typography>
        </TableCell>

        <TableCell>
          {row?.submissionStatus === ECONOMAP_STATUS.APPROVED && (
            <Button onClick={deleteDialog.onTrue}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </Button>
          )}
        </TableCell>
      </TableRow>

      <SocialSharingTableRowDrawer drawerController={drawerController} row={row} />

      <ConfirmDialog
        open={deleteDialog.value}
        onClose={deleteDialog.onFalse}
        title="ยืนยันการลบประกาศ"
        content={
          <Typography variant="body2" color="text.secondary">
            คุณต้องการลบ{' '}
            <Typography component="span" sx={{ textDecoration: 'underline' }} color="black">
              {row?.name}
            </Typography>{' '}
            ใช่หรือไม่?
          </Typography>
        }
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleDelete}
            loading={deleteSocialSharing.isPending}
          >
            ลบ
          </LoadingButton>
        }
      />
    </>
  );
}
