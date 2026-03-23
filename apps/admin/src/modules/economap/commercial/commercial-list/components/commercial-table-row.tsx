import type { CommercialItem } from '../../types';
import type { UserLookupMap } from '../../../_hooks/use-user-lookup';

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

import { Image } from 'src/components/image';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import CommercialTableRowDrawer from './commercial-table-row-drawer';
import { useDeleteCommercial } from '../../_hooks/use-delete-commercial';
import { ECONOMAP_STATUS } from '../../../_config/economap-status.config';
import { getUserRole, getUserDisplayName } from '../../../_hooks/use-user-lookup';
import {
  COMMERCIAL_CATEGORY,
  COMMERCIAL_CATEGORY_TRANSLATIONS,
} from '../../_configs/commercial-category.config';

// ----------------------------------------------------------------------

type Props = {
  row: CommercialItem;
  selected: boolean;
  onSelectRow: () => void;
  userLookup: UserLookupMap;
};

export function CommercialTableRow({ row, selected, onSelectRow, userLookup }: Props) {
  const { mutateAsync: deleteCommercial, isPending: pendingDelete } = useDeleteCommercial();

  const drawerController = useBoolean();

  const deleteDialog = useBoolean();

  const handleDelete = async () => {
    try {
      await deleteCommercial(row._id);
      toast.success('ลบข้อมูลสำเร็จ');
      deleteDialog.onFalse();
    } catch (error) {
      console.log(error);
      toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

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
              </Box>

              <Typography variant="caption">
                {`${row?.district.districtName} ${row?.district.provinceName}`}
              </Typography>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.phoneNumber}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row?.types.map((type) => <Box key={type._id}>{type?.name}</Box>)}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row?.category === COMMERCIAL_CATEGORY.RESTAURANT && 'success') ||
              (row?.category === COMMERCIAL_CATEGORY.BUSINESS && 'warning') ||
              'default'
            }
          >
            {row?.category && COMMERCIAL_CATEGORY_TRANSLATIONS[row?.category]}
          </Label>
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

      <CommercialTableRowDrawer drawerController={drawerController} row={row} />

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
            loading={pendingDelete}
          >
            ลบ
          </LoadingButton>
        }
      />
    </>
  );
}
