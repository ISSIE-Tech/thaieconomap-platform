import type { ReactNode } from 'react';

import { EconomapHeader } from 'src/modules/economap-headers';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { LEGAL } from './legal.constant';
import { LegalLinks } from './legal-links';

// ----------------------------------------------------------------------

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack minHeight="100vh" bgcolor={{ md: '#F5FBFF' }}>
      <EconomapHeader title={title} />

      <Box
        component="article"
        sx={{
          width: 1,
          maxWidth: 820,
          mx: 'auto',
          my: { md: 4 },
          px: { xs: 3, md: 6 },
          py: { xs: 2, md: 5 },
          bgcolor: 'common.white',
          borderRadius: { md: 2 },
          boxShadow: { md: '0px 1px 10px 1px #4876D31A' },
          lineHeight: 1.8,
        }}
      >
        <Typography component="h1" fontSize={{ xs: 24, md: 30 }} fontWeight={700} lineHeight={1.3}>
          {title}
        </Typography>
        <Typography color="grey.600" fontSize={14} mt={1}>
          มีผลบังคับใช้ตั้งแต่วันที่ {LEGAL.effectiveDate}
        </Typography>

        <Stack spacing={3} mt={4}>
          {children}
        </Stack>

        <Divider sx={{ my: 4 }} />
        <LegalLinks />
      </Box>
    </Stack>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack component="section" spacing={1.5}>
      <Typography component="h2" fontSize={19} fontWeight={700}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <Typography fontSize={15} lineHeight={1.9}>{children}</Typography>;
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <Box component="ul" sx={{ m: 0, pl: 3, listStyle: 'disc', '& li': { fontSize: 15, lineHeight: 1.9, mb: 0.5 } }}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Box>
  );
}

export function ContactBlock() {
  return (
    <List
      items={[
        `ผู้ให้บริการ: ${LEGAL.operator}`,
        `ที่อยู่: ${LEGAL.address}`,
        `อีเมล: ${LEGAL.email}`,
        `โทรศัพท์: ${LEGAL.phone}`,
        `เว็บไซต์: ${LEGAL.operatorWebsite}`,
      ]}
    />
  );
}
