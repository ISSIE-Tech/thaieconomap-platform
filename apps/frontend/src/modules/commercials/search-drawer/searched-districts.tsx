'use client';

import type { District } from '../_types/commercials.type';
import type { ListChildComponentProps } from 'react-window';

import Image from 'next/image';
import { useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import { Iconify } from 'src/shared/components/iconify';

import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import useGetDistricts from '../../../shared/hooks/use-get-districts';

type Props = {
  searchedInput: string;
  onDistrictClick: (district: District) => void;
};

const splitDistrictName = (district: District, searchedInput: string) => {
  const fullDistrict = `${district.districtType}${district.districtName}`;
  const index = fullDistrict.indexOf(searchedInput);

  const before = fullDistrict.substring(0, index);
  const searchedWord = fullDistrict.substring(index, index + searchedInput.length);
  const after = fullDistrict.substring(index + searchedInput.length);

  return { before, searchedWord, after };
};

export function SearchedDistrict({ searchedInput, onDistrictClick }: Props) {
  const { data: districts } = useGetDistricts();

  const filteredDistricts = useMemo(() => {
    const searchedDistricts = districts?.filter((district) => {
      const fullDistrict = `${district.districtType}${district.districtName}`;
      return fullDistrict.includes(searchedInput);
    });

    return searchedDistricts?.map((district) => {
      const splittedDistrict = splitDistrictName(district, searchedInput);
      return { ...district, ...splittedDistrict };
    });
  }, [districts, searchedInput]);

  if (filteredDistricts?.length === 0) return <DistrictNotFound />;

  return (
    <FixedSizeList
      height={1000} // Set the height of the list container
      width="100%" // Full width of the parent container
      itemSize={60} // Height of each row (adjust as needed)
      itemCount={filteredDistricts?.length ?? 0}
      itemData={filteredDistricts} // Pass the filtered data to render rows
    >
      {({ index, style }) =>
        renderRow({ index, style, data: filteredDistricts ?? [], onDistrictClick })
      }
    </FixedSizeList>
  );
}

// ----------------------------------------------------------------------

type RowProps = ListChildComponentProps & {
  data: District[];
  onDistrictClick: (district: District) => void;
};

function renderRow({ index, style, data, onDistrictClick }: RowProps) {
  const district = data[index]; // Get the district data for this row

  return (
    <ListItem style={style} key={district._id} component="div" disablePadding>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        py={2}
        sx={{ cursor: 'pointer' }}
        onClick={() => onDistrictClick(district)}
      >
        <Stack width={24} justifyContent="center" alignItems="center">
          <Iconify width={24} icon="heroicons:map-pin" />
        </Stack>
        <Stack direction="row">
          <Typography>{district.before}</Typography>
          <Typography fontWeight="700">{district.searchedWord}</Typography>
          <Typography mr={0.5}>{district.after}</Typography>
          <Typography>{district.provinceName}</Typography>
        </Stack>
      </Stack>
    </ListItem>
  );
}

// ----------------------------------------------------------------------

function DistrictNotFound() {
  return (
    <Stack alignItems="center" spacing={1}>
      <Image
        src="/assets/illustrations/not-found.svg"
        alt="search not found illustrations"
        width="216"
        height="216"
      />
      <Typography variant="body1" fontWeight="bold">
        ไม่พบผลการค้นหา
      </Typography>
    </Stack>
  );
}
