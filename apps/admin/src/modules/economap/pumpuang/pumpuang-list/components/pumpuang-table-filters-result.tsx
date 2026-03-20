import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import {
  ECONOMAP_STATUS,
  ECONOMAP_STATUS_TRANSLATIONS,
} from 'src/modules/economap/_config/economap-status.config';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

import type { PumpuangTableFilters } from '../../type';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  onResetPage: () => void;
  filters: UseSetStateReturn<PumpuangTableFilters>;
  sx?: SxProps<Theme>;
};

export default function PumpuangTableFiltersResult({
  filters,
  onResetPage,
  totalResults,
  sx,
}: Props) {
  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: ECONOMAP_STATUS.APPROVED });
  }, [filters, onResetPage]);

  const handleRemoveName = useCallback(() => {
    onResetPage();
    filters.setState({ owner: '' });
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="สถานะ:" isShow={filters.state.status !== ECONOMAP_STATUS.APPROVED}>
        <Chip
          {...chipProps}
          label={ECONOMAP_STATUS_TRANSLATIONS[filters.state.status]}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      {/* <FiltersBlock label="ประเภท:" isShow={!!filters.state.category.length}>
    {filters.state.category.map((item) => (
      <Chip
        {...chipProps}
        key={item}
        label={item}
        onDelete={() => handleRemoveCategory(item)}
      />
    ))}
  </FiltersBlock> */}

      <FiltersBlock label="ชื่อ:" isShow={!!filters.state.owner}>
        <Chip {...chipProps} label={filters.state.owner} onDelete={handleRemoveName} />
      </FiltersBlock>
    </FiltersResult>
  );
}
