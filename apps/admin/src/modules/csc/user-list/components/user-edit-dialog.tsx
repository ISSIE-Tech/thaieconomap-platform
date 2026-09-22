import type { CscUser, CscDistrict, CscUserRole } from '../../types';

import { useState, useEffect } from 'react';

import {
  Stack,
  Button,
  Dialog,
  MenuItem,
  TextField,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { toast } from 'src/components/snackbar';

import { CSC_ROLE_TRANSLATIONS } from '../../types';
import { useUpdateCscUser, useGetCscDistricts } from '../../_hooks/use-csc-users';

type Props = {
  user: CscUser | null;
  onClose: () => void;
};

export function UserEditDialog({ user, onClose }: Props) {
  const { data: allDistricts = [] } = useGetCscDistricts();
  const { mutate, isPending } = useUpdateCscUser();

  const [role, setRole] = useState<CscUserRole>('CUSTOMER');
  const [districts, setDistricts] = useState<CscDistrict[]>([]);

  useEffect(() => {
    if (user) {
      setRole(user.role);
      setDistricts(user.districts);
    }
  }, [user]);

  const handleSave = () =>
    user &&
    mutate(
      { user, role, districts: districts.map((district) => district._id) },
      {
        onSuccess: () => {
          toast.success('แก้ไขข้อมูลสำเร็จ');
          onClose();
        },
        onError: (error: any) => toast.error(error?.response?.data?.message ?? 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล'),
      }
    );

  return (
    <Dialog fullWidth maxWidth="sm" open={!!user} onClose={onClose}>
      <DialogTitle>แก้ไขผู้ใช้งาน</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <TextField disabled label="รหัสผู้ใช้งาน" value={user?.shortId ?? ''} />
          <TextField disabled label="ชื่อ-นามสกุล" value={user?.name ?? ''} />

          <TextField
            select
            label="สิทธิ์การใช้งาน"
            value={role}
            disabled={!!user?.authId}
            helperText={user?.authId ? 'บัญชีจากระบบ Thai Economap กำหนดสิทธิ์ที่เมนูผู้จัดการ' : undefined}
            onChange={(event) => setRole(event.target.value as CscUserRole)}
          >
            {Object.entries(CSC_ROLE_TRANSLATIONS).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>

          <Autocomplete
            multiple
            options={allDistricts}
            value={districts}
            getOptionLabel={(option) => `${option.districtType}${option.districtName} ${option.provinceName}`}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={(_, value) => setDistricts(value)}
            renderInput={(params) => <TextField {...params} label="เขตรับผิดชอบ" />}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button variant="contained" disabled={isPending} onClick={handleSave}>
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
}
