'use client';

import type { GeoJsonLineString, PumpuangRouteResponse } from '../type';

import { toast } from 'sonner';
import { useMemo, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';

import { useGetPumpuang } from '../_hooks/use-get-pumpuang';
import { useGetPumpuangRoute } from '../_hooks/use-get-pumpuang-route';
import { useForceStopPumpuang } from '../_hooks/use-force-stop-pumpuang';
import TrackingSessionList from './components/tracking-session-list';

const TrackingRouteMap = dynamic(() => import('./components/tracking-route-map'), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
      <CircularProgress />
    </Box>
  ),
  ssr: false,
});

type Props = {
  pumpuangId: string;
};

/**
 * Flatten all route records into a single list of sessions (GeoJSON LineStrings).
 * Each route record represents one tracking session with multiple time slots.
 * Each time slot becomes one selectable session entry.
 */
function flattenSessions(records: PumpuangRouteResponse[]): GeoJsonLineString[] {
  if (!records || !Array.isArray(records)) return [];

  return records.flatMap((record) => record.history || []);
}

export function PumpuangTrackingView({ pumpuangId }: Props) {
  const { data: pumpuangResponse, isLoading: isPumpuangLoading } = useGetPumpuang(pumpuangId);
  const { data: routeResponse, isLoading: isRouteLoading } = useGetPumpuangRoute(pumpuangId);
  const forceStopPumpuang = useForceStopPumpuang();

  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number>(0);

  const pumpuang = pumpuangResponse?.data;
  const routeRecords: PumpuangRouteResponse[] = routeResponse?.data || [];
  const isRunning = pumpuang?.status === 'RUNNING';

  const handleForceStop = useCallback(async () => {
    try {
      await forceStopPumpuang.mutateAsync(pumpuangId);
      toast.success('หยุดการติดตามสำเร็จ');
    } catch (error) {
      console.error(error);
      toast.error('เกิดข้อผิดพลาดในการหยุดการติดตาม');
    }
  }, [forceStopPumpuang, pumpuangId]);

  // Flatten all records' time slots into a single selectable list
  const sessions = useMemo(() => flattenSessions(routeRecords), [routeRecords]);

  if (isPumpuangLoading || isRouteLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 400 }}>
        <CircularProgress />
      </Stack>
    );
  }

  const selectedSession = sessions[selectedSessionIndex];

  // Convert GeoJSON LineString coordinates [lng, lat] to Leaflet [lat, lng]
  const routePoints: [number, number][] = (selectedSession?.coordinates || [])
    .map(([lng, lat]) => [lat, lng] as [number, number])
    .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));

  return (
    <>
      {isRunning && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          action={
            <LoadingButton
              color="warning"
              variant="contained"
              size="small"
              onClick={handleForceStop}
              loading={forceStopPumpuang.isPending}
            >
              หยุดติดตาม
            </LoadingButton>
          }
        >
          <Typography variant="subtitle2">กำลังวิ่งอยู่</Typography>
          <Typography variant="body2">รถพุ่มพวงนี้กำลังเปิดการติดตามตำแหน่งอยู่</Typography>
        </Alert>
      )}

      {sessions.length === 0 ? (
        <Card sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            ไม่มีประวัติการเดินทาง
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            ยังไม่มีข้อมูลการติดตามเส้นทางสำหรับรถพุ่มพวงนี้
          </Typography>
        </Card>
      ) : (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box sx={{ width: { xs: '100%', md: 300 }, flexShrink: 0 }}>
            <TrackingSessionList
              sessions={sessions}
              selectedIndex={selectedSessionIndex}
              onSelect={setSelectedSessionIndex}
            />
          </Box>

          <Box sx={{ flexGrow: 1, minHeight: 500 }}>
            <Card sx={{ height: '100%', overflow: 'hidden' }}>
              <TrackingRouteMap routePoints={routePoints} />
            </Card>
          </Box>
        </Stack>
      )}
    </>
  );
}
