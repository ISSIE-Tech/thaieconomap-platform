import Link from 'next/link';
import { paths } from 'src/shared/routes/paths.config';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const COLUMNS = [
  {
    title: 'บริการ',
    links: [
      { label: 'แผนที่ธุรกิจ', href: paths.commercials.restaurants },
      { label: 'งานและอาชีพ', href: paths.jobs },
      { label: 'ช่วยเหลือแบ่งปัน', href: paths.sharings },
      { label: 'ประกาศ', href: paths.announcements.root },
    ],
  },
  {
    title: 'เกี่ยวกับ',
    links: [
      { label: 'เกี่ยวกับเรา', href: paths.about },
      { label: 'ข้อกำหนดการใช้งาน', href: paths.legal.terms },
      { label: 'นโยบายความเป็นส่วนตัว', href: paths.legal.privacy },
    ],
  },
];

/** Desktop site footer, same look as the about page footer. */
export function SiteFooter() {
  return (
    <Box component="footer" sx={{ bgcolor: '#224680', color: '#a9c3dc', mt: 'auto' }}>
      <Box
        sx={{
          maxWidth: 1120,
          mx: 'auto',
          px: 5,
          pt: 6,
          pb: 3,
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr',
          gap: 4,
        }}
      >
        <Stack spacing={1.5}>
          <Typography fontWeight={700} fontSize={15} color="common.white">
            ThaiEconoMap — แผนที่เศรษฐกิจชุมชน
          </Typography>
          <Typography fontSize={14} lineHeight={1.75}>
            โครงสร้างพื้นฐานดิจิทัลเพื่อเศรษฐกิจฐานรากและสุขภาวะชุมชน ดำเนินการโดยสถาบันเอเชียศึกษา
            จุฬาลงกรณ์มหาวิทยาลัย
          </Typography>
        </Stack>

        {COLUMNS.map((col) => (
          <Stack key={col.title} component="nav" spacing={1.25}>
            <Typography fontWeight={700} fontSize={15} color="common.white">
              {col.title}
            </Typography>
            {col.links.map((link) => (
              <Box
                key={link.href}
                component={Link}
                href={link.href}
                sx={{
                  fontSize: 14,
                  color: '#c9dcef',
                  textDecoration: 'none',
                  '&:hover': { color: 'common.white' },
                }}
              >
                {link.label}
              </Box>
            ))}
          </Stack>
        ))}

        <Stack spacing={1.5}>
          <Typography fontWeight={700} fontSize={15} color="common.white">
            ดำเนินการและสนับสนุนโดย
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ bgcolor: 'common.white', borderRadius: 2, px: 2.5, py: 2, width: 'fit-content' }}
          >
            <Box
              component="img"
              src="/about/logo-thaihealth.png"
              alt="สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.)"
              height={44}
            />
            <Box
              component="img"
              src="/about/logo-ias.png"
              alt="สถาบันเอเชียศึกษา จุฬาลงกรณ์มหาวิทยาลัย"
              height={32}
            />
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          maxWidth: 1120,
          mx: 'auto',
          px: 5,
          py: 2.5,
          fontSize: 13,
          borderTop: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        © {new Date().getFullYear()} ThaiEconoMap · สถาบันเอเชียศึกษา จุฬาลงกรณ์มหาวิทยาลัย |
        สนับสนุนโดย สสส.
      </Box>
    </Box>
  );
}
