import type { ReactNode } from 'react';
import type { SiteContentStrings } from 'src/modules/site-content/get-site-content';

import Link from 'next/link';
import { EconomapHeader } from 'src/modules/economap-headers';
import { CookieSettingsButton } from 'src/modules/consent/cookie-consent';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { LegalLinks } from './legal-links';

// ----------------------------------------------------------------------

/** Terms / privacy page. Title, effective date and body come from the admin CMS (Thai copy). */
export function LegalPage({ content }: { content: SiteContentStrings }) {
  const title = content.title?.th ?? '';

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
          มีผลบังคับใช้ตั้งแต่วันที่ {content.effectiveDate?.th}
        </Typography>

        <Stack spacing={3} mt={4}>
          <LegalBody markdown={content.body?.th ?? ''} />
        </Stack>

        <Divider sx={{ my: 4 }} />
        <LegalLinks />
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

/**
 * The small markdown subset the CMS editor documents: blank-line separated blocks,
 * "## " section headings, "- " list items, [text](url) links, and a
 * [[cookie-settings]] line for the cookie preferences button.
 */
function LegalBody({ markdown }: { markdown: string }) {
  const sections: { title?: string; blocks: string[] }[] = [{ blocks: [] }];

  markdown
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .forEach((block) => {
      if (block.startsWith('## ')) sections.push({ title: block.slice(3).trim(), blocks: [] });
      else sections[sections.length - 1].blocks.push(block);
    });

  return sections.map(({ title, blocks }, i) => {
    const body = blocks.map((block, j) => <Block key={j} block={block} />);
    return title ? (
      <Section key={i} title={title}>
        {body}
      </Section>
    ) : (
      body
    );
  });
}

function Block({ block }: { block: string }) {
  if (block === '[[cookie-settings]]') return <CookieSettingsButton />;

  const lines = block.split('\n').map((l) => l.trim());
  if (lines.every((l) => l.startsWith('- '))) return <List items={lines.map((l) => inline(l.slice(2)))} />;

  return <P>{inline(lines.join(' '))}</P>;
}

const SAFE_HREF = /^(\/|https?:\/\/|mailto:|tel:)/;

function inline(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)\s]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (!m || !SAFE_HREF.test(m[2])) return part;
    const [, label, href] = m;
    return href.startsWith('/') ? (
      <Link key={i} href={href}>
        {label}
      </Link>
    ) : (
      <a key={i} href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  });
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack component="section" spacing={1.5}>
      <Typography component="h2" fontSize={19} fontWeight={700}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

function P({ children }: { children: ReactNode }) {
  return <Typography fontSize={15} lineHeight={1.9}>{children}</Typography>;
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <Box component="ul" sx={{ m: 0, pl: 3, listStyle: 'disc', '& li': { fontSize: 15, lineHeight: 1.9, mb: 0.5 } }}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Box>
  );
}
