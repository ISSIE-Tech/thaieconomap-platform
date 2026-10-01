'use client';

import type { ReactNode } from 'react';
import type { LatLngBounds, Map as LeafletMap } from 'leaflet';

import { useState, useEffect } from 'react';
import { toast } from 'src/shared/components/snackbar';
import { Iconify } from 'src/shared/components/iconify';
import { LegalLinks } from 'src/modules/legal/legal-links';
import { ShopLightbox } from 'src/modules/shop-page/shop-lightbox';
import useGetDistricts from 'src/shared/hooks/use-get-districts';
import { useGeolocationStore } from 'src/modules/geolocation/_store/geolocation.store';
import { PillButtonsContext } from 'src/shared/components/custom-buttons/icon-label-btn';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Building blocks for the desktop (md+) map screens: a 420px left sidebar holding
// either a result list or the selected item's detail, next to the map.

const border = '1px solid #EFF1F3';
const shadow = '0px 1px 10px 1px #4876D333';

// ----------------------------------------------------------------------

export type StatusTone = 'success' | 'error' | 'warning';

export function StatusPill({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <Box
      component="span"
      sx={{
        fontWeight: 700,
        borderRadius: '9999px',
        px: 1,
        whiteSpace: 'nowrap',
        bgcolor: `${tone}.lighter`,
        color: tone === 'warning' ? 'warning.dark' : `${tone}.main`,
      }}
    >
      {label}
    </Box>
  );
}

export function NewBadge({ label = 'ใหม่' }: { label?: string }) {
  return (
    <Box
      component="span"
      sx={{
        flexShrink: 0,
        fontSize: 11,
        fontWeight: 700,
        color: 'common.white',
        bgcolor: 'primary.main',
        borderRadius: '9999px',
        px: 1,
        py: '1px',
      }}
    >
      {label}
    </Box>
  );
}

// ----------------------------------------------------------------------

/** Scrollable left column of a desktop map screen. */
export function MapSidebar({ children }: { children: ReactNode }) {
  return (
    <Stack
      component="aside"
      sx={{
        minHeight: 0,
        height: '100%',
        borderRight: border,
        bgcolor: 'common.white',
        boxShadow: '0px 1px 10px 1px #4876D31A',
        position: 'relative',
        zIndex: 500,
      }}
    >
      {children}
      {/* legal links for desktop visitors (mobile has them in the menu drawer) */}
      <Box sx={{ flexShrink: 0, py: 1, borderTop: border }}>
        <LegalLinks fontSize={12} />
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type SearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  filterActive?: boolean;
  onFilterClick?: () => void;
  /** with a map, matching districts show under the input and fly the map there (mobile's district search) */
  map?: LeafletMap | null;
};

export function SidebarSearch({ value, onChange, placeholder, filterActive, onFilterClick, map }: SearchProps) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Stack
          component="label"
          direction="row"
          alignItems="center"
          spacing={1.25}
          sx={{
            flex: 1,
            height: 48,
            px: 1.75,
            border: 1,
            borderColor: 'grey.300',
            borderRadius: 1,
            '&:focus-within': { borderColor: 'primary.main' },
          }}
        >
          <Iconify icon="gravity-ui:magnifier" width={22} sx={{ color: 'grey.600' }} />
          <InputBase
            fullWidth
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            sx={{ fontSize: 15 }}
          />
        </Stack>

        {onFilterClick && (
          <IconButton
            title="ตัวกรอง"
            onClick={onFilterClick}
            sx={{
              position: 'relative',
              width: 48,
              height: 48,
              bgcolor: filterActive ? 'primary.main' : 'common.white',
              color: filterActive ? 'common.white' : 'grey.800',
              boxShadow: '0 3px 5px -1px rgba(145,158,171,0.2),0 6px 10px 0 rgba(145,158,171,0.14)',
              '&:hover': { bgcolor: filterActive ? 'primary.dark' : 'grey.100' },
            }}
          >
            <Iconify icon="mi:filter" width={24} />
            {filterActive && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: '#FFAC0B',
                  border: '1px solid white',
                }}
              />
            )}
          </IconButton>
        )}
      </Stack>

      {map && (
        <DistrictMatches
          query={value.trim()}
          onPick={(coord) => {
            map.flyTo(coord, 15);
            onChange('');
          }}
        />
      )}
    </Stack>
  );
}

function DistrictMatches({ query, onPick }: { query: string; onPick: (coord: [number, number]) => void }) {
  const { data: districts } = useGetDistricts();
  if (!query) return null;

  const matches = (districts ?? []).filter((d) => `${d.districtType}${d.districtName}`.includes(query)).slice(0, 5);
  if (!matches.length) return null;

  return (
    <Stack sx={{ border: 1, borderColor: 'grey.200', borderRadius: 1, py: 0.5 }}>
      {matches.map((d) => (
        <ButtonBase
          key={d._id}
          onClick={() => onPick([d.latitude, d.longitude])}
          sx={{ justifyContent: 'flex-start', gap: 1, px: 1.5, py: 1, fontSize: 14, '&:hover': { bgcolor: '#F5FBFF' } }}
        >
          <Iconify icon="heroicons:map-pin" width={18} sx={{ color: 'primary.main', flexShrink: 0 }} />
          <Box component="span" sx={{ fontWeight: 700 }}>
            {d.districtType}
            {d.districtName}
          </Box>
          <Box component="span" sx={{ color: 'grey.600' }}>
            {d.provinceName}
          </Box>
        </ButtonBase>
      ))}
    </Stack>
  );
}

export function QuickChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        height: 32,
        px: 1.75,
        borderRadius: '9999px',
        fontSize: 14,
        fontWeight: 500,
        border: 1,
        bgcolor: selected ? 'primary.light' : 'common.white',
        color: selected ? 'common.white' : 'grey.800',
        borderColor: selected ? 'primary.light' : 'primary.lighter',
      }}
    >
      {label}
    </ButtonBase>
  );
}

/** `action` replaces the "in map area" hint, e.g. a toggle that lists beyond the map bounds */
export function ResultsHeader({ label, action }: { label: string; action?: ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline" px={2.5} pt={2} pb={1}>
      <Typography fontSize={16} fontWeight={700}>
        {label}
      </Typography>
      {action ?? (
        <Typography fontSize={12} color="grey.600">
          ในพื้นที่แผนที่
        </Typography>
      )}
    </Stack>
  );
}

export function ResultList({ children }: { children: ReactNode }) {
  return <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 1, pb: 2 }}>{children}</Box>;
}

export function EmptyResults({ onClear }: { onClear?: () => void }) {
  return (
    <Stack alignItems="center" spacing={1} py={6} px={3} textAlign="center">
      <Box component="img" src="/assets/illustrations/onboarding.svg" alt="" width={96} height={96} />
      <Typography fontWeight={700}>ไม่พบผลลัพธ์ในบริเวณนี้</Typography>
      {onClear && (
        <ButtonBase onClick={onClear} sx={{ color: 'primary.main', fontSize: 14 }}>
          ล้างตัวกรองและค้นหาใหม่
        </ButtonBase>
      )}
    </Stack>
  );
}

// ----------------------------------------------------------------------

type ResultRowProps = {
  name: string;
  imageUrl?: string;
  fallbackIcon: string;
  isNew?: boolean;
  // extra marker after the name, e.g. a partner logo
  badge?: ReactNode;
  subtitle?: string;
  status?: { label: string; tone: StatusTone };
  meta?: string;
  selected?: boolean;
  onClick: () => void;
  onHover?: (hovering: boolean) => void;
};

export function ResultRow({
  name,
  imageUrl,
  fallbackIcon,
  isNew,
  badge,
  subtitle,
  status,
  meta,
  selected,
  onClick,
  onHover,
}: ResultRowProps) {
  return (
    <ButtonBase
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      sx={{
        width: '100%',
        display: 'flex',
        gap: 1.75,
        p: 1.5,
        borderRadius: 1.5,
        textAlign: 'left',
        bgcolor: selected ? '#F5FBFF' : 'common.white',
        '&:hover': { bgcolor: '#F5FBFF' },
      }}
    >
      <Thumb imageUrl={imageUrl} fallbackIcon={fallbackIcon} sx={{ width: 88, height: 66, borderRadius: 1 }} />

      <Stack flex={1} minWidth={0} spacing={0.25}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography fontSize={15} fontWeight={700} noWrap>
            {name}
          </Typography>
          {isNew && <NewBadge />}
          {badge}
        </Stack>
        {subtitle && (
          <Typography fontSize={13} fontWeight={500} color="primary.dark" noWrap>
            {subtitle}
          </Typography>
        )}
        {(status || meta) && (
          <Stack direction="row" alignItems="center" spacing={1} fontSize={13} color="grey.600">
            {status && <StatusPill {...status} />}
            {meta && (
              <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {meta}
              </Box>
            )}
          </Stack>
        )}
      </Stack>

      <Iconify icon="material-symbols-light:arrow-forward-ios" width={20} sx={{ color: 'grey.500', flexShrink: 0 }} />
    </ButtonBase>
  );
}

function Thumb({ imageUrl, fallbackIcon, sx }: { imageUrl?: string; fallbackIcon: string; sx: object }) {
  // broken urls (deleted/expired uploads) fall back to the icon instead of the browser's broken-image glyph
  const [failedUrl, setFailedUrl] = useState<string>();

  return (
    <Box
      sx={{
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'primary.light',
        ...sx,
      }}
    >
      {imageUrl && imageUrl !== failedUrl ? (
        <Box
          component="img"
          src={imageUrl}
          alt=""
          loading="lazy"
          onError={() => setFailedUrl(imageUrl)}
          sx={{ position: 'absolute', inset: 0, width: 1, height: 1, objectFit: 'cover' }}
        />
      ) : (
        <Iconify icon={fallbackIcon} width={28} sx={{ color: 'common.white', opacity: 0.9 }} />
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

type DetailPanelProps = {
  onBack: () => void;
  backLabel?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function DetailPanel({ onBack, backLabel = 'กลับไปผลการค้นหา', children, footer }: DetailPanelProps) {
  const share = () => {
    if (navigator.share) navigator.share({ url: window.location.href }).catch(() => {});
    else navigator.clipboard?.writeText(window.location.href);
  };

  return (
    <Stack minHeight={0} height="100%">
      <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0, height: 56, pl: 1, pr: 1.5, borderBottom: border }}>
        <Button
          onClick={onBack}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={22} />}
          sx={{ borderRadius: '9999px', color: 'primary.dark', fontWeight: 700, whiteSpace: 'nowrap' }}
        >
          {backLabel}
        </Button>
        <Stack direction="row" spacing={0.5} ml="auto !important">
          <IconButton title="แชร์" onClick={share} sx={{ color: 'grey.700' }}>
            <Iconify icon="solar:share-linear" width={20} />
          </IconButton>
          <IconButton title="ปิด" onClick={onBack} sx={{ color: 'grey.700' }}>
            <Iconify icon="ri:close-line" width={22} />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>{children}</Box>

      {footer && <Box sx={{ flexShrink: 0, px: 3, pt: 1.5, pb: 2, borderTop: border }}>{footer}</Box>}
    </Stack>
  );
}

type DetailHeroProps = {
  imageUrl?: string;
  /** extra photos: a thumbnail strip under the hero; any photo opens the lightbox */
  moreImages?: string[];
  fallbackIcon: string;
  badge?: string;
};

export function DetailHero({ imageUrl, moreImages, fallbackIcon, badge }: DetailHeroProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const images = [imageUrl, ...(moreImages ?? [])].filter((url): url is string => !!url);
  const strip = images.slice(1, 5);
  const hidden = images.length - 1 - strip.length;

  return (
    <Box position="relative">
      <ButtonBase disabled={!images.length} onClick={() => setLightbox(0)} sx={{ display: 'block', width: 1 }}>
        <Thumb imageUrl={images[0]} fallbackIcon={fallbackIcon} sx={{ height: 168, width: 1 }} />
      </ButtonBase>
      {!!strip.length && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 0.75, px: 2.5, pt: 1 }}>
          {strip.map((url, i) => (
            <ButtonBase
              key={url}
              onClick={() => setLightbox(i + 1)}
              sx={{ position: 'relative', borderRadius: 1, overflow: 'hidden' }}
            >
              <Thumb imageUrl={url} fallbackIcon={fallbackIcon} sx={{ height: 56, width: 1 }} />
              {i === strip.length - 1 && hidden > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'rgba(9, 15, 20, 0.5)',
                    color: 'common.white',
                    fontWeight: 700,
                  }}
                >
                  +{hidden}
                </Box>
              )}
            </ButtonBase>
          ))}
        </Box>
      )}
      <ShopLightbox images={images} index={lightbox} onChange={setLightbox} />
      {badge && (
        <Box
          component="span"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: 'common.white',
            color: 'primary.dark',
            fontSize: 12,
            fontWeight: 700,
            borderRadius: '9999px',
            px: 1.5,
            py: '3px',
          }}
        >
          {badge}
        </Box>
      )}
    </Box>
  );
}

type DetailTitleProps = {
  name?: string;
  subtitle?: string;
  status?: { label: string; tone: StatusTone };
  extra?: string;
  types?: string;
};

export function DetailTitle({ name, subtitle, status, extra, types }: DetailTitleProps) {
  return (
    <Stack spacing={0.75} px={3} pt={2.5} pb={2}>
      <Typography fontSize={22} fontWeight={700} lineHeight={1.3}>
        {name}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1.25} fontSize={14} flexWrap="wrap">
        {subtitle && <span>{subtitle}</span>}
        {status && <StatusPill {...status} />}
        {extra && (
          <Box component="span" color="grey.600">
            {extra}
          </Box>
        )}
      </Stack>
      {types && (
        <Typography fontSize={14} fontWeight={500} color="primary.dark">
          {types}
        </Typography>
      )}
    </Stack>
  );
}

/** 2-column grid; action buttons (CallButton, FavoriteButton, ...) inside render as pills. */
export function DetailActions({ children }: { children: ReactNode }) {
  return (
    <PillButtonsContext.Provider value>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 1,
          px: 3,
          pb: 2.5,
          borderBottom: border,
        }}
      >
        {children}
      </Box>
    </PillButtonsContext.Provider>
  );
}

export function DetailBlock({ icon, title, children }: { icon: string; title?: string; children: ReactNode }) {
  return (
    <Stack direction="row" spacing={1.75} sx={{ px: 3, py: 1.75, borderBottom: border }}>
      <Iconify icon={icon} width={22} sx={{ flexShrink: 0, color: 'primary.main', mt: '1px' }} />
      <Stack flex={1} minWidth={0} spacing={0.25}>
        {title && (
          <Typography fontSize={12} fontWeight={500} color="grey.600">
            {title}
          </Typography>
        )}
        {children}
      </Stack>
    </Stack>
  );
}

export function DetailLine({ k, v }: { k?: string; v: ReactNode }) {
  return (
    <Stack direction="row" spacing={1.5} fontSize={14} lineHeight={1.7}>
      {k && (
        <Box component="span" sx={{ width: 104, flexShrink: 0, fontWeight: 700 }}>
          {k}
        </Box>
      )}
      <Box component="span" sx={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>
        {v}
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

/**
 * Locate (every screen size) + zoom (desktop; phones pinch), bottom-right over the map.
 * Locate asks the browser for a fresh position, so it re-prompts whenever the browser still
 * allows a prompt (e.g. the page-load prompt was dismissed rather than blocked).
 */
export function MapControls({ map, zoom = true }: { map: LeafletMap | null; zoom?: boolean }) {
  const setGeolocation = useGeolocationStore((state) => state.setGeolocation);
  const [locating, setLocating] = useState(false);
  const round = { width: 48, height: 48, bgcolor: 'common.white', '&:hover': { bgcolor: 'grey.100' } };

  const locate = () => {
    if (!navigator.geolocation) {
      toast.warning('อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position: [number, number] = [coords.latitude, coords.longitude];
        setGeolocation(position);
        map?.flyTo(position, Math.max(map.getZoom(), 16));
        setLocating(false);
      },
      (error) => {
        setLocating(false);

        if (error.code !== error.PERMISSION_DENIED) {
          toast.warning('ไม่สามารถระบุตำแหน่งของคุณได้', { description: 'กรุณาลองใหม่อีกครั้ง' });
          return;
        }

        // Browsers never re-prompt once the user blocked it - only the site settings can undo it.
        // Locate as soon as they flip it back on, so they don't have to tap again.
        toast.warning('ยังไม่ได้อนุญาตให้เข้าถึงตำแหน่ง', {
          description:
            'กดไอคอนแม่กุญแจหรือการตั้งค่าข้างช่อง URL แล้วเปิด "ตำแหน่ง" ระบบจะระบุตำแหน่งให้อัตโนมัติ',
        });
        navigator.permissions
          ?.query({ name: 'geolocation' })
          .then((status) => {
            status.onchange = () => {
              if (status.state === 'granted') locate();
            };
          })
          .catch(() => {});
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <Stack spacing={1.5} sx={{ position: 'absolute', right: 16, bottom: 32, zIndex: 1000 }}>
      <IconButton
        title="ตำแหน่งของฉัน"
        aria-label="ตำแหน่งของฉัน"
        onClick={locate}
        disabled={locating}
        sx={{ ...round, color: 'primary.main', boxShadow: shadow, '&.Mui-disabled': { bgcolor: 'common.white' } }}
      >
        {locating ? <CircularProgress size={22} /> : <Iconify icon="mdi:crosshairs-gps" width={24} />}
      </IconButton>
      {zoom && (
        <Stack sx={{ borderRadius: '9999px', bgcolor: 'common.white', boxShadow: shadow, overflow: 'hidden' }}>
          <IconButton aria-label="ซูมเข้า" onClick={() => map?.zoomIn()} sx={{ ...round, borderRadius: 0, color: 'grey.800' }}>
            <Iconify icon="ic:round-add" width={24} />
          </IconButton>
          <Box sx={{ height: '1px', bgcolor: 'grey.200', mx: 1.25 }} />
          <IconButton aria-label="ซูมออก" onClick={() => map?.zoomOut()} sx={{ ...round, borderRadius: 0, color: 'grey.800' }}>
            <Iconify icon="ic:round-remove" width={24} />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
}

/** Current viewport of `map`, refreshed on every pan/zoom. */
export function useMapBounds(map: LeafletMap | null) {
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  useEffect(() => {
    // On a route change the old map is removed in the same commit this effect runs in,
    // before MapSetter's cleanup clears the store; a removed map has no panes left.
    if (!map?.getPane('mapPane')) return undefined;
    const update = () => setBounds(map.getBounds());
    update();
    map.on('moveend', update);
    return () => {
      map.off('moveend', update);
    };
  }, [map]);

  return bounds;
}

/** Keeps items whose [lat, lng] is inside `bounds` (all of them until the map reports one). */
export function inBounds<T>(items: T[], bounds: LatLngBounds | null, coord: (item: T) => [number, number]) {
  return bounds ? items.filter((item) => bounds.contains(coord(item))) : items;
}
