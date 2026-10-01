'use client';

import type { ReactNode } from 'react';
import type { Commercial } from 'src/modules/commercials/_types/commercials.type';

import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMapStore } from 'src/shared/stores/map';
import { paths } from 'src/shared/routes/paths.config';
import { toast } from 'src/shared/components/snackbar';
import { Iconify } from 'src/shared/components/iconify';
import { LegalLinks } from 'src/modules/legal/legal-links';
import { EconomapHeader } from 'src/modules/economap-headers';
import { StatusPill } from 'src/shared/components/map-sidebar';
import { formatCoord } from 'src/shared/components/custom-buttons/action-btn';
import useGetCommercial from 'src/modules/commercials/_hooks/use-get-commercial';
import { useCommercialStore } from 'src/modules/commercials/_store/commercials.store';
import { PillButtonsContext } from 'src/shared/components/custom-buttons/icon-label-btn';
import { STATUS_TONE, commercialIcon } from 'src/modules/commercials/commercial-sidebar';
import { CommercialActionButtons } from 'src/modules/commercials/commercial-detail-drawer';
import { useTinyCommercialsFromUrl } from 'src/modules/commercials/_hooks/use-tiny-commercials-from-url';
import {
  CommercialCategory,
  CommercialWorkingStatus,
} from 'src/modules/commercials/_types/commercials.type';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { ShopLightbox } from './shop-lightbox';

const ShopMiniMap = dynamic(() => import('./shop-mini-map'), { ssr: false });

const border = '1px solid #EFF1F3';
const TINTS = ['#B9E1FF', '#DFE3E8', '#CBD1D7', '#60BCFF'];

const outlinedPill = {
  height: 44,
  borderRadius: '9999px',
  border: 2,
  borderColor: 'primary.lighter',
  color: 'primary.dark',
  fontWeight: 700,
  whiteSpace: 'nowrap',
};

const mapPath = (category: Commercial['category']) =>
  category === 'BUSINESS' ? paths.commercials.businesses : paths.commercials.restaurants;

// ----------------------------------------------------------------------

export function ShopPage({ id }: { id: string }) {
  const router = useRouter();
  const { data: shop } = useGetCommercial({ commercialId: id });
  const setSelectedId = useCommercialStore((state) => state.setSelectedId);
  const setLastSettings = useMapStore((state) => state.actions.setLastSettings);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!shop) {
    return (
      <Stack height="100vh">
        <EconomapHeader title="ข้อมูลร้าน" />
      </Stack>
    );
  }

  const coord = formatCoord(shop.location.coordinates);
  const category = CommercialCategory[shop.category];
  const district = shop.district?.districtName;
  const images = [shop.imageUrl, ...(shop.additionalImageUrl ?? [])].filter(Boolean);
  const types = shop.types?.map((t) => t.name).join(' · ');
  const status = shop.workingStatus && {
    label: CommercialWorkingStatus[shop.workingStatus],
    tone: STATUS_TONE[shop.workingStatus],
  };

  const backToMap = () => {
    // the map centers on the last viewed coord
    setLastSettings(mapPath(shop.category), coord, 17);
    setSelectedId(shop._id);
    router.push(mapPath(shop.category));
  };

  const share = () => {
    if (navigator.share) navigator.share({ title: shop.name, url: window.location.href }).catch(() => {});
    else navigator.clipboard?.writeText(window.location.href).then(() => toast.success('คัดลอกลิงก์แล้ว'));
  };

  const crumbs: { label: string; href?: string }[] = [
    { label: 'แผนที่ธุรกิจ', href: paths.commercials.restaurants },
    ...(shop.district?.provinceName ? [{ label: shop.district.provinceName }] : []),
    ...(district ? [{ label: `เขต${district}` }] : []),
    { label: category, href: mapPath(shop.category) },
    { label: shop.name },
  ];

  return (
    <Stack height="100vh" overflow="hidden">
      <EconomapHeader title="ข้อมูลร้าน" />

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Stack
          component="main"
          spacing={3.5}
          sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 5 }, pt: 3, pb: 8 }}
        >
          {/* breadcrumb */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
            <Stack component="nav" aria-label="breadcrumb" direction="row" alignItems="center" gap={1} flexWrap="wrap" fontSize={14} color="grey.600">
              {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <Stack key={c.label} direction="row" alignItems="center" gap={1}>
                    {c.href ? (
                      <Box component={Link} href={c.href} sx={{ color: 'grey.600' }}>
                        {c.label}
                      </Box>
                    ) : (
                      <Box component="span" sx={last ? { color: 'grey.900', fontWeight: 700 } : undefined}>
                        {c.label}
                      </Box>
                    )}
                    {!last && <Iconify icon="eva:arrow-ios-forward-fill" width={16} sx={{ color: 'grey.500' }} />}
                  </Stack>
                );
              })}
            </Stack>
            <Button
              onClick={backToMap}
              startIcon={<Iconify icon="solar:map-linear" width={20} />}
              sx={{ color: 'primary.dark', fontWeight: 700 }}
            >
              ดูบนแผนที่
            </Button>
          </Stack>

          {/* photo mosaic */}
          <Box
            sx={{
              position: 'relative',
              display: 'grid',
              gap: 1,
              borderRadius: 2,
              overflow: 'hidden',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
              gridTemplateRows: { xs: '240px', md: '200px 200px' },
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{
                  bgcolor: i === 0 ? 'primary.light' : TINTS[i - 1],
                  display: i === 0 ? 'grid' : { xs: 'none', md: 'grid' },
                  placeItems: 'center',
                  ...(i === 0 && { gridRow: { md: 'span 2' } }),
                }}
              >
                {images[i] ? (
                  <Box
                    component="img"
                    src={images[i]}
                    alt=""
                    onClick={() => setLightbox(i)}
                    sx={{ width: 1, height: 1, objectFit: 'cover', cursor: 'zoom-in' }}
                  />
                ) : (
                  i === 0 && <Iconify icon={commercialIcon(shop.category)} width={72} sx={{ color: 'common.white', opacity: 0.9 }} />
                )}
              </Box>
            ))}
            {images.length > 1 && (
              <Button
                onClick={() => setLightbox(0)}
                startIcon={<Iconify icon="solar:gallery-linear" width={18} />}
                sx={{
                  position: 'absolute',
                  right: 16,
                  bottom: 16,
                  height: 36,
                  px: 2,
                  borderRadius: '9999px',
                  bgcolor: 'common.white',
                  color: 'grey.900',
                  fontWeight: 700,
                  boxShadow: '0px 1px 10px 1px #4876D333',
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                ดูรูปทั้งหมด ({images.length})
              </Button>
            )}
          </Box>

          <ShopLightbox images={images} index={lightbox} onChange={setLightbox} />

          {/* title + actions */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1fr) auto' },
              gap: 3,
              alignItems: 'end',
              pb: 3.5,
              borderBottom: border,
            }}
          >
            <Stack spacing={1}>
              {shop.isNewlyOpened && (
                <Box
                  component="span"
                  sx={{
                    alignSelf: 'flex-start',
                    bgcolor: 'primary.main',
                    color: 'common.white',
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: '9999px',
                    px: 1.5,
                    py: '3px',
                  }}
                >
                  ร้านใหม่แกะกล่อง
                </Box>
              )}
              <Typography component="h1" sx={{ m: 0, fontSize: { xs: 28, md: 36 }, lineHeight: 1.25, fontWeight: 700 }}>
                {shop.name}
              </Typography>
              <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap" fontSize={16}>
                <span>{category}</span>
                {status && <StatusPill {...status} />}
                {district && (
                  <Box component="span" color="grey.600">
                    เขต{district} {shop.district.provinceName}
                  </Box>
                )}
              </Stack>
              {types && (
                <Typography fontSize={15} fontWeight={500} color="primary.dark">
                  {types}
                </Typography>
              )}
            </Stack>

            <PillButtonsContext.Provider value>
              <Stack direction="row" gap={1} flexWrap="wrap" justifyContent={{ md: 'flex-end' }}>
                <CommercialActionButtons commercial={shop} />
                <Button onClick={share} startIcon={<Iconify icon="solar:share-linear" width={20} />} sx={{ ...outlinedPill, px: 2.25 }}>
                  แชร์
                </Button>
              </Stack>
            </PillButtonsContext.Provider>
          </Box>

          {/* body */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1fr) 380px' },
              gap: { xs: 4, md: 6 },
              alignItems: 'start',
            }}
          >
            <Stack spacing={4}>
              {!!shop.displayOpening?.length && (
                <Section title="เวลาทำการ">
                  <Box sx={{ border, borderRadius: 1.5, overflow: 'hidden' }}>
                    {shop.displayOpening.map((opening) => (
                      <Box
                        key={opening.days}
                        sx={{ display: 'grid', gridTemplateColumns: '140px 1fr', px: 2, py: 1.25, fontSize: 15, borderBottom: border, '&:last-of-type': { borderBottom: 0 } }}
                      >
                        <span>{opening.days}</span>
                        <span>{opening.time.map((t) => `${t.open} - ${t.close}`).join(', ')}</span>
                      </Box>
                    ))}
                  </Box>
                </Section>
              )}

              <Section title="ข้อมูลร้านค้า">
                {shop.moreInfo && (
                  <Stack direction="row" spacing={1.25} fontSize={15} lineHeight={1.8}>
                    <Iconify icon="fluent:info-24-regular" width={22} sx={{ flexShrink: 0, mt: 0.5, color: 'grey.700' }} />
                    <Box component="p" sx={{ m: 0, whiteSpace: 'pre-line' }}>
                      {shop.moreInfo}
                    </Box>
                  </Stack>
                )}
                {shop.commercialOwner && (
                  <Stack direction="row" alignItems="center" spacing={1.5} pt={1}>
                    <Box component="img" src="/assets/illustrations/default-profile.svg" alt="" sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'grey.200' }} />
                    <Stack>
                      <Typography fontSize={15} fontWeight={500}>
                        คุณ{shop.commercialOwner}
                      </Typography>
                      <Typography fontSize={12} color="grey.500">
                        เจ้าของร้าน
                      </Typography>
                    </Stack>
                  </Stack>
                )}
              </Section>

              {images.length > 1 && (
                <Section title={`รูปภาพ${category}`} id="gallery">
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(4, minmax(0,1fr))' }, gap: 1 }}>
                    {images.map((src, i) => (
                      <Box
                        key={src}
                        component="img"
                        src={src}
                        alt=""
                        loading="lazy"
                        onClick={() => setLightbox(i)}
                        sx={{ width: 1, aspectRatio: '4/3', objectFit: 'cover', borderRadius: 1, display: 'block', cursor: 'zoom-in' }}
                      />
                    ))}
                  </Box>
                </Section>
              )}
            </Stack>

            <Stack
              component="aside"
              sx={{ position: { md: 'sticky' }, top: 24, border, borderRadius: 2, overflow: 'hidden', boxShadow: '0px 1px 10px 1px #4876D31A' }}
            >
              <Box sx={{ height: 220, bgcolor: 'grey.200', display: 'flex' }}>
                <ShopMiniMap coord={coord} />
              </Box>
              <Stack spacing={1.75} p={2.5}>
                {shop.address && (
                  <Stack direction="row" spacing={1.25} fontSize={15} lineHeight={1.6}>
                    <Iconify icon="heroicons:map-pin" width={22} sx={{ flexShrink: 0, mt: '2px', color: 'grey.700' }} />
                    <span>{shop.address}</span>
                  </Stack>
                )}
                {shop.phoneNumber && (
                  <Stack direction="row" spacing={1.25} fontSize={15}>
                    <Iconify icon="ic:round-phone" width={22} sx={{ flexShrink: 0, color: 'grey.700' }} />
                    <Box component="a" href={`tel:${shop.phoneNumber}`} sx={{ color: 'inherit' }}>
                      {shop.phoneNumber}
                    </Box>
                  </Stack>
                )}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Button
                    variant="contained"
                    href={`https://www.google.com/maps/search/?api=1&query=${coord[0]}%2C${coord[1]}`}
                    target="_blank"
                    startIcon={<Iconify icon="bi:sign-turn-right-fill" width={18} />}
                    sx={{ height: 44, borderRadius: '9999px', fontWeight: 700 }}
                  >
                    นำทาง
                  </Button>
                  <Button
                    onClick={() =>
                      navigator.clipboard
                        ?.writeText(shop.address || `${coord[0]}, ${coord[1]}`)
                        .then(() => toast.success('คัดลอกที่อยู่แล้ว'))
                    }
                    startIcon={<Iconify icon="solar:copy-linear" width={18} />}
                    sx={outlinedPill}
                  >
                    คัดลอกที่อยู่
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Nearby shop={shop} />
        </Stack>

        <Box component="footer" sx={{ borderTop: border, bgcolor: '#F5FBFF' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={3}
            flexWrap="wrap"
            sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 5 }, py: 3.5 }}
          >
            <Stack spacing={0.75}>
              <Box component="img" src="/assets/icons/logo-full.svg" alt="Thai Economap" sx={{ height: 22, alignSelf: 'flex-start' }} />
              <Typography fontSize={13} color="grey.600">
                Super map of economic data in Thailand
              </Typography>
              <LegalLinks justifyContent="flex-start" />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} fontSize={14}>
              <span>Powered by</span>
              <Box component="img" src="/assets/images/chula.png" alt="Chula" sx={{ height: 40 }} />
              <Iconify icon="ri:close-line" width={16} />
              <Box component="img" src="/assets/images/thai-health.png" alt="ThaiHealth" sx={{ height: 40 }} />
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Section({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  return (
    <Stack component="section" id={id} spacing={1.5} sx={{ scrollMarginTop: 24 }}>
      <Typography component="h2" sx={{ m: 0, fontSize: 20, fontWeight: 700 }}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

function Nearby({ shop }: { shop: Commercial }) {
  const { data } = useTinyCommercialsFromUrl(shop.category);
  const district = shop.district?.districtName;

  const others = (data ?? []).filter((c) => c._id !== shop._id);
  const nearby = [
    ...others.filter((c) => c.district?.districtName === district),
    ...others.filter((c) => c.district?.districtName !== district),
  ].slice(0, 4);

  if (!nearby.length) return null;

  const category = CommercialCategory[shop.category];

  return (
    <Stack component="section" spacing={2} sx={{ pt: 3.5, borderTop: border }}>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography component="h2" sx={{ m: 0, fontSize: 20, fontWeight: 700 }}>
          {category}อื่นๆ {district ? `ในเขต${district}` : 'ใกล้เคียง'}
        </Typography>
        <Box component={Link} href={mapPath(shop.category)} sx={{ fontSize: 14, fontWeight: 700 }}>
          ดูทั้งหมดบนแผนที่
        </Box>
      </Stack>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(4, minmax(0,1fr))' }, gap: 2.5 }}>
        {nearby.map((c) => (
          <Stack key={c._id} component={Link} href={paths.shop(c._id)} spacing={1} sx={{ color: 'grey.900', textDecoration: 'none', minWidth: 0 }}>
            <Box sx={{ aspectRatio: '4/3', borderRadius: 1.5, overflow: 'hidden', bgcolor: 'primary.light', display: 'grid', placeItems: 'center' }}>
              {c.imageUrl ? (
                <Box component="img" src={c.imageUrl} alt="" loading="lazy" sx={{ width: 1, height: 1, objectFit: 'cover' }} />
              ) : (
                <Iconify icon={commercialIcon(c.category)} width={36} sx={{ color: 'common.white', opacity: 0.9 }} />
              )}
            </Box>
            <Typography fontSize={15} fontWeight={700} noWrap>
              {c.name}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} fontSize={13} color="grey.600" minWidth={0}>
              {c.workingStatus && (
                <StatusPill label={CommercialWorkingStatus[c.workingStatus]} tone={STATUS_TONE[c.workingStatus]} />
              )}
              <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.types?.map((t) => t.name).join(', ')}
              </Box>
            </Stack>
          </Stack>
        ))}
      </Box>
    </Stack>
  );
}
