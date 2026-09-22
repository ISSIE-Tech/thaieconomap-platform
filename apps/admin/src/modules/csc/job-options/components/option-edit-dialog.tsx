import { useState, useEffect } from 'react';

import {
  Stack,
  Avatar,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { toast } from 'src/components/snackbar';

type Option = { _id: string; name: string; iconUrl?: string };

type Props = {
  option: Option | null;
  withIcon: boolean;
  onClose: () => void;
  onSave: (id: string, name: string, icon: File | null) => Promise<unknown>;
};

export function OptionEditDialog({ option, withIcon, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(option?.name ?? '');
    setIcon(null);
  }, [option]);

  const handleSave = () => {
    if (!option) return;

    setSaving(true);
    onSave(option._id, name.trim(), icon)
      .then(() => {
        toast.success('แก้ไขข้อมูลสำเร็จ');
        onClose();
      })
      .catch((error: any) =>
        toast.error(error?.response?.data?.message ?? 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล')
      )
      .finally(() => setSaving(false));
  };

  const preview = icon ? URL.createObjectURL(icon) : option?.iconUrl;

  return (
    <Dialog fullWidth maxWidth="xs" open={!!option} onClose={onClose}>
      <DialogTitle>แก้ไข{option?.name ? ` "${option.name}"` : ''}</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <TextField label="ชื่อ" value={name} onChange={(event) => setName(event.target.value)} />

          {withIcon && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={preview} variant="rounded" sx={{ width: 56, height: 56 }} />

              <Button component="label" variant="outlined">
                {icon ? icon.name : 'เปลี่ยนไอคอน'}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(event) => setIcon(event.target.files?.[0] ?? null)}
                />
              </Button>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button variant="contained" disabled={!name.trim() || saving} onClick={handleSave}>
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
}
