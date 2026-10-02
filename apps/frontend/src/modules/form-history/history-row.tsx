'use client';

import type { ReactNode } from 'react';
import type { FormHistory } from './_types/history.type';
import type { Commercial } from '../commercials/_types/commercials.type';

import { toast } from 'sonner';
import { useMemo } from 'react';
import { maxLine } from 'src/theme/styles/mixins';
import { Image } from 'src/shared/components/image';
import { paths } from 'src/shared/routes/paths.config';
import { Iconify } from 'src/shared/components/iconify';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { formatCreateDate } from 'src/shared/components/constants/date';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import useDeleteMyShop from './_hooks/use-delete-my-shop';
import { ENTITY_TYPE, SubmissionStatus } from './_types/history.type';
import { CommercialCategory } from '../commercials/_types/commercials.type';

type Props = {
  history: FormHistory;
  onClick: (history: FormHistory) => void;
  /** replaces the trailing arrow (mobile) / fills the last column (desktop) */
  actions?: ReactNode;
};

export function HistoryRow({ history, onClick, actions }: Props) {
  const theme = useTheme();

  const entityTypeThai = ENTITY_TYPE[history.entityType].th;
  const categoryThai = useMemo(() => {
    if (history.entityType === ENTITY_TYPE.commercials.en) {
      return CommercialCategory[(history as Commercial).category];
    }
    return null;
  }, [history]);

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      py={2}
      sx={{ cursor: 'pointer' }}
      onClick={() => onClick(history)}
    >
      <Stack direction="row" flexGrow={1} spacing={1.5} alignItems="center" width="80%">
        <Image
          src={history?.imageUrl}
          alt="history"
          ratio="4/3"
          flexShrink={0}
          sx={{ width: '100px', borderRadius: '5px' }}
        />

        <Stack>
          <Typography variant="body2" color={theme.palette.primary.main} sx={maxLine({ line: 1 })}>
            {entityTypeThai} {categoryThai && ` - ${categoryThai}`}
          </Typography>
          <Typography fontWeight="bold" sx={maxLine({ line: 1 })}>
            {history?.name}
          </Typography>
          <Typography variant="body2" color={theme.palette.grey['500']}>
            {formatCreateDate(history.createdAt)}
          </Typography>
        </Stack>
      </Stack>

      {actions ?? (
        <Stack>
          <Image src="/assets/icons/right-arrow.svg" alt="right-arrow" sx={{ width: '24px' }} />
        </Stack>
      )}
    </Stack>
  );
}

// --------------------------------------------------

export function HistoryRowSkeleton() {
  return (
    <Stack direction="row" spacing={2} alignItems="center" py={2} sx={{ cursor: 'pointer' }}>
      {/* Skeleton for Image */}
      <Skeleton variant="rectangular" width={60} height={45} />

      {/* Skeleton for Text */}
      <Stack flexGrow={1} gap={1}>
        <Typography fontWeight="bold">
          <Skeleton width="80%" />
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <Skeleton width="60%" />
        </Typography>
      </Stack>

      {/* Skeleton for Status */}
      <Skeleton variant="rounded" width={100} height={40} />
    </Stack>
  );
}

// --------------------------------------------------

const STATUS = {
  [SubmissionStatus.PENDING]: { label: 'รอตรวจสอบ', tone: 'warning' },
  [SubmissionStatus.ACCEPTED]: { label: 'อนุมัติแล้ว', tone: 'success' },
  [SubmissionStatus.REJECTED]: { label: 'ไม่ผ่านการอนุมัติ', tone: 'error' },
} as const;

export const historyTableColumns = 'minmax(0, 2fr) 1fr 1fr 140px';
export const historyTableColumnsWithActions = `${historyTableColumns} 96px`;

/** Desktop table row: รายการ | ประเภท | วันที่ส่ง | สถานะ */
export function HistoryTableRow({ history, onClick, actions }: Props) {
  const type =
    history.entityType === ENTITY_TYPE.commercials.en
      ? CommercialCategory[(history as Commercial).category]
      : ENTITY_TYPE[history.entityType].th;
  const status = STATUS[history.submissionStatus];

  return (
    <Box
      onClick={() => onClick(history)}
      sx={{
        display: 'grid',
        gridTemplateColumns: actions ? historyTableColumnsWithActions : historyTableColumns,
        alignItems: 'center',
        p: 1.5,
        fontSize: 15,
        cursor: 'pointer',
        borderBottom: (theme) => `1px solid ${theme.palette.grey[200]}`,
        '&:hover': { bgcolor: '#F5FBFF' },
      }}
    >
      <Typography fontWeight={500} noWrap>
        {history.name}
      </Typography>
      <Typography color="grey.600">{type}</Typography>
      <Typography color="grey.600">{formatCreateDate(history.createdAt)}</Typography>
      <Box
        component="span"
        sx={{
          justifySelf: 'start',
          fontWeight: 700,
          fontSize: 13,
          borderRadius: '9999px',
          px: 1.5,
          py: 0.5,
          bgcolor: `${status.tone}.lighter`,
          color: status.tone === 'warning' ? 'warning.dark' : `${status.tone}.main`,
        }}
      >
        {status.label}
      </Box>
      {actions}
    </Box>
  );
}

// --------------------------------------------------

/** Open the public page (approved shops only) and delete, for "ร้านค้าของฉัน". */
export function ShopActions({ history }: { history: FormHistory }) {
  const confirm = useBoolean();
  const { mutate: deleteShop, isPending } = useDeleteMyShop();
  const isLive = history.submissionStatus === SubmissionStatus.ACCEPTED;

  const onDelete = () =>
    deleteShop(history, {
      onSuccess: () => {
        toast.success(`ลบ "${history.name}" แล้ว`);
        confirm.onFalse();
      },
      onError: (error: any) => toast.error(error?.display ?? 'ลบร้านไม่สำเร็จ'),
    });

  return (
    // keep clicks here from opening the row's drawer
    <Stack direction="row" justifySelf="end" onClick={(e) => e.stopPropagation()}>
      {isLive && (
        <Tooltip title="เปิดหน้าร้าน">
          <IconButton
            component="a"
            href={paths.shop(history._id)}
            target="_blank"
            rel="noopener"
            aria-label={`เปิดหน้าร้าน ${history.name}`}
          >
            <Iconify icon="solar:square-arrow-right-up-linear" width={22} />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="ลบร้าน">
        <IconButton color="error" onClick={confirm.onTrue} aria-label={`ลบร้าน ${history.name}`}>
          <Iconify icon="solar:trash-bin-trash-linear" width={22} />
        </IconButton>
      </Tooltip>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={confirm.value}
        onClose={isPending ? undefined : confirm.onFalse}
      >
        <DialogTitle sx={{ pb: 1 }}>ลบ &quot;{history.name}&quot; ?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {isLive ? 'ร้านจะหายจากแผนที่และหน้าค้นหาทันที' : 'คำขอลงทะเบียนนี้จะถูกยกเลิก'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirm.onFalse} disabled={isPending}>
            ยกเลิก
          </Button>
          <Button variant="contained" color="error" onClick={onDelete} disabled={isPending}>
            {isPending ? 'กำลังลบ...' : 'ลบร้าน'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
