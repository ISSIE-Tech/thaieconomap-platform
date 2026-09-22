import type { JobKind } from '../../types';
import type { JobAction } from '../../_hooks/use-csc-jobs';

import { useState } from 'react';

import { Button, Tooltip, IconButton } from '@mui/material';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { RejectDialog } from './reject-dialog';
import { useJobAction } from '../../_hooks/use-csc-jobs';

type ActionConfig = { action: JobAction; label: string; icon: string; color: 'success' | 'error' | 'info' };

const ACTIONS: Record<JobKind, ActionConfig[]> = {
  active: [{ action: 'recycle', label: 'ลบ', icon: 'solar:trash-bin-minimalistic-bold', color: 'error' }],
  pending: [
    { action: 'approve', label: 'อนุมัติ', icon: 'material-symbols:check-circle-outline-rounded', color: 'success' },
    { action: 'reject', label: 'ปฏิเสธ', icon: 'charm:circle-cross', color: 'error' },
  ],
  deleted: [
    { action: 'restore', label: 'กู้คืน', icon: 'material-symbols:restore-from-trash-rounded', color: 'info' },
    { action: 'destroy', label: 'ลบถาวร', icon: 'solar:trash-bin-minimalistic-bold', color: 'error' },
  ],
};

type Props = {
  kind: JobKind;
  id: string;
  variant?: 'icon' | 'button';
  onDone?: () => void;
};

// every action confirms first; reject also collects a reason
export function JobActions({ kind, id, variant = 'icon', onDone }: Props) {
  const [confirming, setConfirming] = useState<ActionConfig | null>(null);
  const { mutate, isPending } = useJobAction();

  const run = (config: ActionConfig, rejectMessage?: string) =>
    mutate(
      { action: config.action, id, rejectMessage },
      {
        onSuccess: () => {
          toast.success(`${config.label}เรียบร้อยแล้ว`);
          onDone?.();
        },
        onError: (error: any) => toast.error(error?.response?.data?.message ?? 'เกิดข้อผิดพลาด'),
      }
    );

  return (
    <>
      {ACTIONS[kind].map((config) =>
        variant === 'icon' ? (
          <Tooltip key={config.action} title={config.label}>
            <IconButton disabled={isPending} onClick={() => setConfirming(config)}>
              <Iconify icon={config.icon} sx={{ color: `${config.color}.main` }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            key={config.action}
            variant="contained"
            color={config.color}
            disabled={isPending}
            onClick={() => setConfirming(config)}
          >
            {config.label}
          </Button>
        )
      )}

      <RejectDialog
        open={confirming?.action === 'reject'}
        onClose={() => setConfirming(null)}
        onReject={(rejectMessage) => confirming && run(confirming, rejectMessage)}
      />

      <ConfirmDialog
        open={!!confirming && confirming.action !== 'reject'}
        onClose={() => setConfirming(null)}
        title={confirming?.label}
        content={`คุณยืนยันที่จะ${confirming?.label ?? ''}งานนี้?`}
        action={
          <Button
            variant="contained"
            color={confirming?.color}
            onClick={() => {
              if (confirming) run(confirming);
              setConfirming(null);
            }}
          >
            ยืนยัน
          </Button>
        }
      />
    </>
  );
}
