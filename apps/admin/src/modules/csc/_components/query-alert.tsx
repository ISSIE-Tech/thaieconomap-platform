import { Alert, AlertTitle } from '@mui/material';

type Props = {
  error: unknown;
};

/** a failed list request should say so, not look like an empty table */
export function QueryAlert({ error }: Props) {
  if (!error) return null;

  const message =
    (error as any)?.response?.data?.message ?? (error as Error)?.message ?? 'ไม่ทราบสาเหตุ';

  return (
    <Alert severity="error" sx={{ mb: 3 }}>
      <AlertTitle>โหลดข้อมูลไม่สำเร็จ</AlertTitle>
      {String(message)}
    </Alert>
  );
}
