import { useMemo } from 'react';

import { CommercialCategory, type CommercialTiny } from '../_types/commercials.type';

type Props = {
  tinyCommercials: CommercialTiny[];
  // e.g. ['13,108', '14,120']
  uniqueLatLngs: string[];
};

const useCoordCommercialMap = ({ tinyCommercials, uniqueLatLngs }: Props) => {
  const overlappingCommercials = useMemo(() => {
    // find commercial from coordinate
    const coordCommercialMap = tinyCommercials?.reduce(
      // make this more simple, if the key doesn't exist init it
      (hashMap, commercial) => {
        const key = `${commercial.location.coordinates}`;

        // Initialize the array if it doesn't exist, then add the commercial
        hashMap[key] = [...(hashMap[key] ?? []), commercial];
        return hashMap;
      },
      {} as Record<string, CommercialTiny[]>
    );

    return uniqueLatLngs.map((id) => coordCommercialMap && coordCommercialMap[id]).flat();
  }, [uniqueLatLngs, tinyCommercials]);

  // ร้านอาหาร or ธุรกิจ
  const category =
    overlappingCommercials[0] && CommercialCategory[overlappingCommercials[0].category];

  return { overlappingCommercials, category };
};

export default useCoordCommercialMap;
