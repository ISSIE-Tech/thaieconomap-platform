'use client';

import type { FavoriteTiny } from './_types/favorites.type';
import type { TabValue } from './_constants/favourites-tabs';

import { maxLine } from 'src/theme/styles/mixins';
import { Image } from 'src/shared/components/image';
import { paths } from 'src/shared/routes/paths.config';
import { formatCreateDate } from 'src/shared/components/constants/date';
import { ImageDetailArrowRow } from 'src/shared/components/custom-list/image-detail-arrow-row';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

type Title = {
  en: string;
  th: string;
};

type Props = {
  tab: TabValue;
  title: Title;
  favorites: FavoriteTiny[];
  isLoading?: boolean;
  onClick: (id: string) => void;
  isPumpuang?: boolean;
};

export default function FavoritesList({
  tab,
  title,
  favorites,
  isLoading,
  onClick,
  isPumpuang = false,
}: Props) {
  return (
    <>
      <Typography variant="body1" fontWeight="bold" mt={4}>
        {title.th}
      </Typography>

      <Stack divider={<Divider />} flexGrow={1}>
        {isLoading && [...Array(3)].map((_, index) => <FavoriteSkeleton key={index} />)}

        {/* the newest is the first in list */}
        {[...favorites].reverse().map((favorite) => (
          <ImageDetailArrowRow
            key={favorite._id}
            name={favorite.name}
            time={
              (favorite.updatedAt && formatCreateDate(favorite.updatedAt)) ??
              (favorite.createdAt && formatCreateDate(favorite.createdAt)) ??
              favorite.address
            }
            imageUrl={favorite.imageUrl ?? ''}
            onClick={() => onClick(favorite._id)}
          />
        ))}

        {!isLoading && (!favorites || favorites.length === 0) && <NotFound title={title} />}
      </Stack>

      <Divider />
    </>
  );
}

// ----------------------------------------------------------------------

function FavoriteSkeleton() {
  return (
    <Stack direction="row" alignItems="center" spacing={2} py={2} width="100%">
      {/* Skeleton for map pin icon */}
      <Skeleton variant="circular" width={24} height={24} />

      <Stack width="50%" flexGrow={1}>
        {/* Skeleton for the name */}
        <Skeleton variant="text" width="80%" height={24} />

        <Stack direction="row" spacing={0.5}>
          {/* Skeleton for the address */}
          <Skeleton variant="text" width="100%" height={20} sx={maxLine({ line: 1 })} />
        </Stack>
      </Stack>

      {/* Skeleton for forward arrow icon */}
      <Skeleton variant="circular" width={24} height={24} />
    </Stack>
  );
}

// ----------------------------------------------------------------------

type NotFoundProps = {
  title: Title;
};

function NotFound({ title }: NotFoundProps) {
  const titlePathMap = {
    restaurants: paths.commercials.restaurants,
    businesses: paths.commercials.businesses,
    pumpuang: paths.commercials.pumpuang,
    items: paths.sharings,
  };

  const typeSafeTitle = title.en as keyof typeof titlePathMap;

  return (
    <Stack alignItems="center" spacing={1} pb={4}>
      <Image
        src="/assets/illustrations/onboarding.svg"
        alt="onboarding illustrations"
        width="80px"
        height="80px"
        mb={1}
      />
      <Typography variant="body2" fontWeight="bold" lineHeight={1}>
        ไม่มีข้อมูล{title.th}ที่ถูกใจในขณะนี้
      </Typography>
      <Link
        href={titlePathMap[typeSafeTitle] ?? titlePathMap.restaurants}
        fontSize={12}
        sx={{ lineHeight: 1 }}
      >
        เริ่มต้นค้นหา{title.th}ที่ถูกใจในชุมชนกับเรา
      </Link>
    </Stack>
  );
}
