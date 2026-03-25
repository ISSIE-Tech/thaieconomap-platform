import type { PumpuangItem } from '../../type';
import type { UserLookupMap } from '../../../_hooks/use-user-lookup';

import { useCallback } from 'react';
import { ECONOMAP_STATUS } from 'src/modules/economap/_config/economap-status.config';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import { Image } from 'src/components/image';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';

import PumpuangTableRowDrawer from './pumpuang-table-row-drawer';
import { useDeletePumpuang } from '../../_hooks/use-delete-pumpuang';
import { useForceStopPumpuang } from '../../_hooks/use-force-stop-pumpuang';
import { getUserRole, getUserDisplayName } from '../../../_hooks/use-user-lookup';

// ----------------------------------------------------------------------

type Props = {
  row: PumpuangItem;
  selected: boolean;
  onSelectRow: () => void;
  userLookup: UserLookupMap;
};

export default function PumpuangTableRow({ row, selected, onSelectRow, userLookup }: Props) {
  const drawerController = useBoolean();

  const deleteDialog = useBoolean();

  const forceStopDialog = useBoolean();

  const deletePumpuang = useDeletePumpuang();

  const forceStopPumpuang = useForceStopPumpuang();

  // ----------------------------------------------------------------------

  const handleDelete = useCallback(async () => {
    try {
      await deletePumpuang.mutateAsync(row._id);
      toast.success('ลบข้อมูลสำเร็จ');
      deleteDialog.onFalse();
    } catch (error) {
      console.log(error);
      toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  }, [deleteDialog, deletePumpuang, row._id]);

  const handleForceStop = useCallback(async () => {
    try {
      await forceStopPumpuang.mutateAsync(row._id);
      toast.success('หยุดการติดตามสำเร็จ');
      forceStopDialog.onFalse();
    } catch (error) {
      console.error(error);
      toast.error('เกิดข้อผิดพลาดในการหยุดการติดตาม');
    }
  }, [forceStopDialog, forceStopPumpuang, row._id]);

  // ----------------------------------------------------------------------

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
                  {row?.owner}
                </Typography>
              </Box>

              <Typography variant="caption">{row.phoneNumber}</Typography>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row?.types.map((type) => <Box key={type._id}>{type?.name}</Box>)}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.licensePlate}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row?.submissionStatus === ECONOMAP_STATUS.APPROVED && (
            <Label color={row?.status === 'RUNNING' ? 'success' : 'default'}>
              {row?.status === 'RUNNING' ? 'กำลังวิ่ง' : 'ไม่ได้ใช้งาน'}
            </Label>
          )}
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
          <Stack direction="row" spacing={0.5}>
            {row?.submissionStatus === ECONOMAP_STATUS.APPROVED && (
              <>
                <Button
                  component={RouterLink}
                  href={paths.pumpuang.dashboard.edit(row._id)}
                  size="small"
                >
                  <Iconify icon="solar:pen-bold" />
                </Button>

                <Button
                  component={RouterLink}
                  href={paths.pumpuang.dashboard.tracking(row._id)}
                  size="small"
                >
                  <Iconify icon="solar:route-bold" />
                </Button>

                <Button onClick={deleteDialog.onTrue} size="small">
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </Button>
              </>
            )}

            {row?.status === 'RUNNING' && (
              <Button onClick={forceStopDialog.onTrue} size="small" color="warning">
                <Iconify icon="solar:stop-bold" />
              </Button>
            )}
          </Stack>
        </TableCell>
      </TableRow>

      <PumpuangTableRowDrawer drawerController={drawerController} row={row} />

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
            loading={deletePumpuang.isPending}
          >
            ลบ
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={forceStopDialog.value}
        onClose={forceStopDialog.onFalse}
        title="ยืนยันการหยุดติดตาม"
        content={
          <Typography variant="body2" color="text.secondary">
            คุณต้องการหยุดการติดตาม{' '}
            <Typography component="span" sx={{ textDecoration: 'underline' }} color="black">
              {row?.name}
            </Typography>{' '}
            ใช่หรือไม่?
          </Typography>
        }
        action={
          <LoadingButton
            variant="contained"
            color="warning"
            onClick={handleForceStop}
            loading={forceStopPumpuang.isPending}
          >
            หยุดติดตาม
          </LoadingButton>
        }
      />
    </>
  );
}
