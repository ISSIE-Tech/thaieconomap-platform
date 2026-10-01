'use client';

import type { SiteContentKey, SiteContentStrings } from './site-contents.service';

import { useMemo, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { fDateTime } from 'src/utils/format-time';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import ABOUT_LABELS from './about-labels.json';
import { useGetSiteContent, useUpdateSiteContent } from './site-contents.service';

// ----------------------------------------------------------------------

const LEGAL_LABELS: Record<string, string> = {
  title: 'หัวข้อ',
  effectiveDate: 'วันที่มีผลบังคับใช้ (เช่น 29 กันยายน 2569)',
  body: 'เนื้อหา',
};

const LEGAL_BODY_HELP =
  'เว้นบรรทัดว่างระหว่างย่อหน้า · "## " ขึ้นต้นหัวข้อ · "- " ขึ้นต้นรายการ · [ข้อความ](/privacy) สร้างลิงก์ · บรรทัด [[cookie-settings]] แสดงปุ่มตั้งค่าคุกกี้';

const sectionOf = (key: string) => key.split('.')[0];

// ----------------------------------------------------------------------

/**
 * Edits every string of one CMS-managed page. The about page is bilingual (Thai | English,
 * grouped by page section); terms and privacy are Thai only, with a markdown-style body.
 */
export function SiteContentEditor({ pageKey }: { pageKey: SiteContentKey }) {
  const isAbout = pageKey === 'about';
  const { data, isLoading, isError } = useGetSiteContent(pageKey);
  const update = useUpdateSiteContent(pageKey);

  const [draft, setDraft] = useState<SiteContentStrings>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (data) setDraft(data.strings);
  }, [data]);

  const dirty = useMemo(
    () => !!data && Object.keys(draft).some((k) => draft[k] !== data.strings[k]),
    [data, draft]
  );

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const groups = useMemo(() => {
    const q = search.trim().toLowerCase();
    const keys = Object.keys(draft).filter(
      (k) =>
        !q ||
        k.toLowerCase().includes(q) ||
        draft[k].th.toLowerCase().includes(q) ||
        draft[k].en.toLowerCase().includes(q)
    );
    if (!isAbout) return [{ section: '', keys }];
    const sections = keys.map(sectionOf).filter((s, i, all) => all.indexOf(s) === i);
    return sections.map((section) => ({ section, keys: keys.filter((k) => sectionOf(k) === section) }));
  }, [draft, search, isAbout]);

  const setValue = (key: string, lang: 'th' | 'en', value: string) =>
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: value } }));

  const handleSave = () =>
    update.mutate(draft, {
      onSuccess: () => toast.success('บันทึกเนื้อหาแล้ว'),
      onError: () => toast.error('บันทึกไม่สำเร็จ'),
    });

  if (isLoading) return <Typography color="text.secondary">กำลังโหลด…</Typography>;
  if (isError || !data) return <Typography color="error">โหลดเนื้อหาไม่สำเร็จ</Typography>;

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader
          title={dirty ? 'มีการแก้ไขที่ยังไม่ได้บันทึก' : 'เนื้อหาเป็นปัจจุบัน'}
          subheader={data.updatedAt ? `บันทึกล่าสุด ${fDateTime(data.updatedAt)}` : 'ยังใช้เนื้อหาตั้งต้น'}
          action={
            <LoadingButton
              variant="contained"
              loading={update.isPending}
              disabled={!dirty}
              onClick={handleSave}
              startIcon={<Iconify icon="eva:save-fill" />}
            >
              บันทึก
            </LoadingButton>
          }
          sx={{ pb: 3 }}
        />
        {isAbout && (
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาข้อความ…"
            size="small"
            sx={{ mx: 3, mb: 3, width: 'calc(100% - 48px)' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" />
                </InputAdornment>
              ),
            }}
          />
        )}
      </Card>

      {groups.map(({ section, keys }) => (
        <Card key={section || 'all'}>
          {isAbout && (
            <CardHeader
              title={(ABOUT_LABELS.sections as Record<string, string>)[section] ?? section}
            />
          )}
          <Stack spacing={3} sx={{ p: 3 }} divider={<Divider flexItem />}>
            {keys.map((key) => {
              const value = draft[key];
              const edited = value !== data.strings[key];
              const label = isAbout
                ? (ABOUT_LABELS.hints as Record<string, string>)[key] ?? key
                : LEGAL_LABELS[key] ?? key;
              const multiline = key === 'body' || value.th.length > 60 || value.en.length > 60;

              return (
                <Stack key={key} spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle2">{label}</Typography>
                    {isAbout && (
                      <Typography variant="caption" color="text.disabled">
                        {key}
                      </Typography>
                    )}
                    {/<\/?(em|strong|br)/.test(value.th + value.en) && (
                      <Chip size="small" color="warning" variant="soft" label="HTML" />
                    )}
                    {edited && <Chip size="small" color="info" variant="soft" label="แก้ไขแล้ว" />}
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label={isAbout ? 'ไทย' : undefined}
                      value={value.th}
                      onChange={(e) => setValue(key, 'th', e.target.value)}
                      multiline={multiline}
                      minRows={key === 'body' ? 20 : undefined}
                      helperText={key === 'body' ? LEGAL_BODY_HELP : undefined}
                    />
                    {isAbout && (
                      <TextField
                        fullWidth
                        label="English"
                        value={value.en}
                        onChange={(e) => setValue(key, 'en', e.target.value)}
                        multiline={multiline}
                      />
                    )}
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Card>
      ))}

      {isAbout && (
        <Typography variant="caption" color="text.secondary">
          ข้อความที่มีป้าย HTML ใช้แท็ก &lt;em&gt; (ตัวเน้นสีชมพู), &lt;strong&gt; และ &lt;br&gt; ได้ —
          แท็กอื่นจะแสดงเป็นข้อความธรรมดา ช่องภาษาอังกฤษที่เว้นว่างจะแสดงข้อความภาษาไทยแทน
        </Typography>
      )}
    </Stack>
  );
}
