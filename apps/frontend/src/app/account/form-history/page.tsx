'use client';

import type { Sharing } from 'src/modules/sharings/_types/sharing.type';
import type { Commercial } from 'src/modules/commercials/_types/commercials.type';
import type { FormHistory, SubmissionStatus } from 'src/modules/form-history/_types/history.type';

import { useTabs } from 'src/shared/hooks/use-tabs';
import { Image } from 'src/shared/components/image';
import { useMemo, useState, useEffect } from 'react';
import { paths } from 'src/shared/routes/paths.config';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { BlueRoundedHeader } from 'src/modules/economap-headers';
import { HistoryRow, HistoryRowSkeleton } from 'src/modules/form-history';
import { SharingDrawer } from 'src/modules/sharings/sharing-detail-drawer';
import useGetHistory from 'src/modules/form-history/_hooks/use-get-history';
import { CommercialDrawer } from 'src/modules/commercials/commercial-detail-drawer';
import { ENTITY_TYPE, FORM_HISTORY_TABS } from 'src/modules/form-history/_types/history.type';

import Tab from '@mui/material/Tab';
import Link from '@mui/material/Link';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export default function Page() {
  const theme = useTheme();
  const tabs = useTabs(FORM_HISTORY_TABS.PENDING.en);

  // drawers
  const commercialDrawerController = useBoolean();
  const sharingDrawerController = useBoolean();

  const { data: histories, isLoading } = useGetHistory();

  const displayedHistory = useMemo(
    () => histories?.filter((history) => history.submissionStatus === tabs.value),
    [histories, tabs.value]
  );

  const [selectedHistory, setSelectedHistory] = useState<FormHistory | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const onHistoryClick = (history: FormHistory) => {
    setSelectedHistory(history);
    setSelectedId(history._id);

    // TODO: add for job
    switch (history?.entityType) {
      case ENTITY_TYPE.commercials.en:
        commercialDrawerController.onTrue();
        break;
      case ENTITY_TYPE.shares.en:
        sharingDrawerController.onTrue();
        break;
      default:
    }
  };

  useEffect(() => {
    const newHistory = histories?.find((history) => history._id === selectedId);
    setSelectedHistory(newHistory || null);
  }, [histories, selectedId]);

  return (
    <Stack height="100vh">
      <Stack position="fixed" width="100%">
        <BlueRoundedHeader
          title="ประวัติการกรอกฟอร์ม"
          wrapperStyle={{ pb: 0 }}
          headerStyle={{ position: 'static' }}
        />

        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          variant="fullWidth"
          TabIndicatorProps={{
            style: {
              backgroundColor: theme.palette.primary.main,
              height: '0.3rem',
              borderRadius: '1rem 1rem 0 0',
            },
          }}
          sx={{
            borderTop: `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          <Tab label={FORM_HISTORY_TABS.PENDING.th} value={FORM_HISTORY_TABS.PENDING.en} />
          <Tab label={FORM_HISTORY_TABS.REJECTED.th} value={FORM_HISTORY_TABS.REJECTED.en} />
          <Tab label={FORM_HISTORY_TABS.ACCEPTED.th} value={FORM_HISTORY_TABS.ACCEPTED.en} />
        </Tabs>
      </Stack>

      <Stack
        divider={<Divider />}
        flexGrow={1}
        mt={16}
        px={3}
        py={2}
        sx={{
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
      >
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => <HistoryRowSkeleton key={index} />)}

        {displayedHistory?.map((history) => (
          <HistoryRow key={history._id} history={history} onClick={onHistoryClick} />
        ))}

        {displayedHistory?.length === 0 && (
          <Stack
            width="216px"
            flexGrow={1}
            alignSelf="center"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src="/assets/illustrations/onboarding.svg"
              alt="onboarding illustrations"
              width="216"
              height="216"
            />
            <Typography variant="body1" fontWeight="bold">
              ไม่มีข้อมูลประวัติการค้นหา
            </Typography>
            <Link href={paths.create.restaurants}>เริ่มต้นสร้างประวัติในชุมชนกับเรา</Link>
          </Stack>
        )}
      </Stack>

      <CommercialDrawer
        controller={commercialDrawerController}
        commercial={selectedHistory as Commercial}
        submissionStatus={tabs.value as SubmissionStatus}
        submissionMessage={selectedHistory?.submissionMessage}
      />

      <SharingDrawer
        controller={sharingDrawerController}
        sharing={selectedHistory as Sharing}
        submissionStatus={tabs.value as SubmissionStatus}
        submissionMessage={selectedHistory?.submissionMessage}
      />
    </Stack>
  );
}
