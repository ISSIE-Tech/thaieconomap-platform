'use client';

import type { ReactNode } from 'react';

import { useIsDesktop } from 'src/shared/hooks/use-is-desktop';
import { SiteFooter, DesktopHeader } from 'src/modules/economap-headers';
import FormButton from 'src/shared/components/custom-buttons/form-button';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

// ----------------------------------------------------------------------

const card = { bgcolor: 'common.white', borderRadius: 2, boxShadow: '0px 1px 10px 1px #4876D31A' };

/** Two columns on desktop, one on mobile. Give full-width fields `fullRowSx`. */
export const fieldGridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
  gap: 2,
} as const;

export const fullRowSx = { gridColumn: '1 / -1' } as const;

/** Mobile-only section heading; desktop shows the step title in the card header. */
export const mobileHeadingSx = { ...fullRowSx, display: { md: 'none' } } as const;

// ----------------------------------------------------------------------

type ShellProps = {
  /** desktop page title, e.g. "ลงทะเบียนร้านอาหาร" */
  title: string;
  illustration: string;
  steps: string[];
  step: number;
  /** the existing mobile header + progress bar */
  mobileHeader: ReactNode;
  /** replaces the form once submitted */
  success?: ReactNode;
  children: ReactNode;
};

/** Multi-step form page. Mobile: unchanged full-screen flow. Desktop: site nav, stepper | form card filling the screen, footer below the fold. */
export function FormWizardShell({
  title,
  illustration,
  steps,
  step,
  mobileHeader,
  success,
  children,
}: ShellProps) {
  const isDesktop = useIsDesktop();

  if (!isDesktop)
    return (
      success || (
        <Stack sx={{ minHeight: '100vh' }}>
          {mobileHeader}
          <Box sx={{ flexGrow: 1, m: '20px', pb: '100px' }}>{children}</Box>
        </Stack>
      )
    );

  return (
    <Stack height="100vh" overflow="hidden" bgcolor="common.white">
      <DesktopHeader />

      <Stack sx={{ flex: 1, minHeight: 0, overflowY: 'auto', bgcolor: '#F5FBFF' }}>
        {/* both branches fill at least one screen, so the footer only shows once you scroll */}
        {success ? (
          <Box sx={{ flex: '1 0 100%', display: 'grid', placeItems: 'center', p: 4 }}>
            <Box sx={{ ...card, width: 560, maxWidth: '100%', p: 5 }}>{success}</Box>
          </Box>
        ) : (
          <Box
            sx={{
              flex: '1 0 100%',
              width: '100%',
              maxWidth: 1600,
              mx: 'auto',
              px: { md: 3, lg: 5 },
              py: 3,
              display: 'grid',
              gridTemplateColumns: { md: '280px minmax(0, 1fr)', lg: '300px minmax(0, 1fr)' },
              gap: 3,
            }}
          >
            <Stack
              component="aside"
              spacing={3}
              sx={{ ...card, p: 3, position: 'sticky', top: 24, alignSelf: 'start' }}
            >
              <Box
                sx={{
                  height: 150,
                  borderRadius: 2,
                  bgcolor: 'primary.lighter',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <Box component="img" src={illustration} alt="" sx={{ height: 170 }} />
              </Box>

              <Stack spacing={0.5}>
                <Typography component="h1" fontSize={20} fontWeight={700}>
                  {title}
                </Typography>
                <Typography fontSize={13} color="grey.600">
                  กรอกข้อมูลให้ครบ {steps.length} ขั้นตอน ทีมงานจะตรวจสอบก่อนเผยแพร่
                </Typography>
              </Stack>

              <Stepper activeStep={step} orientation="vertical">
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Stack>

            <Stack
              component="section"
              sx={{ ...card, minWidth: 0, overflow: 'hidden', alignSelf: 'start' }}
            >
              <LinearProgress
                variant="determinate"
                value={((step + 1) / steps.length) * 100}
                sx={{ height: 4, borderRadius: 0 }}
              />
              <Stack spacing={3} sx={{ px: 4, py: 3.5 }}>
                <Stack spacing={0.25}>
                  <Typography fontSize={13} fontWeight={600} color="primary.main">
                    ขั้นตอนที่ {step + 1} จาก {steps.length}
                  </Typography>
                  <Typography component="h2" fontSize={22} fontWeight={700}>
                    {steps[step]}
                  </Typography>
                </Stack>
                <Box>{children}</Box>
              </Stack>
            </Stack>
          </Box>
        )}

        <SiteFooter />
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type ActionsProps = {
  label: string;
  onNext: () => void;
  loading?: boolean;
  /** desktop only; mobile goes back with the header's back button */
  onBack?: () => void;
  onCancel?: () => void;
};

/** Mobile: full-width stacked buttons. Desktop: back on the left, cancel + next on the right. */
export function FormActions({ label, onNext, loading, onBack, onCancel }: ActionsProps) {
  return (
    <Stack
      useFlexGap
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ md: 'center' }}
      gap={{ xs: 2.5, md: 1.5 }}
      sx={{
        mt: { xs: 5, md: 4 },
        pt: { md: 3 },
        borderTop: { md: '1px solid' },
        borderColor: { md: 'grey.200' },
      }}
    >
      {onBack && (
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={loading}
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
            height: 44,
            px: 3,
            borderRadius: '9999px',
          }}
        >
          ย้อนกลับ
        </Button>
      )}

      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} />

      {onCancel && (
        <Button
          variant="contained"
          onClick={onCancel}
          disabled={loading}
          sx={{
            order: { xs: 1, md: 0 },
            py: { xs: 1.5, md: 0 },
            height: { md: 44 },
            px: 3,
            borderRadius: { xs: 4, md: '9999px' },
            color: 'error.main',
            bgcolor: { md: 'transparent' },
            boxShadow: { md: 'none' },
            '&:disabled': { color: 'error.main', bgcolor: 'common.background' },
          }}
        >
          ยกเลิก
        </Button>
      )}

      <FormButton
        onClick={onNext}
        label={label}
        loading={loading}
        sx={{
          mt: 0,
          width: { xs: '100%', md: 'auto' },
          minWidth: { md: 200 },
          height: { md: 44 },
          py: { md: 0 },
          borderRadius: { xs: 4, md: '9999px' },
        }}
      />
    </Stack>
  );
}
