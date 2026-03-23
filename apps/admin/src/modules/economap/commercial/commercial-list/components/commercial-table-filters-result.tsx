import type { CommercialTableFilters } from '../types';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';
import type { Theme, SxProps } from '@mui/material/styles';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { FiltersBlock } from 'src/components/filters-result/filters-block';
import { chipProps, FiltersResult } from 'src/components/filters-result/filters-result';

import {
  ECONOMAP_STATUS,
  ECONOMAP_STATUS_TRANSLATIONS,
} from '../../../_config/economap-status.config';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  onResetPage: () => void;
  filters: UseSetStateReturn<CommercialTableFilters>;
  sx?: SxProps<Theme>;
};

export function CommercialTableFiltersResult({ filters, onResetPage, totalResults, sx }: Props) {
  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: ECONOMAP_STATUS.APPROVED });
  }, [filters, onResetPage]);

  const handleRemoveCategory = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.category.filter((item) => item !== inputValue);

      onResetPage();
      filters.setState({ category: newValue });
    },
    [filters, onResetPage]
  );

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
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

      <FiltersBlock label="ประเภท:" isShow={!!filters.state.category.length}>
        {filters.state.category.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveCategory(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="ชื่อ:" isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
