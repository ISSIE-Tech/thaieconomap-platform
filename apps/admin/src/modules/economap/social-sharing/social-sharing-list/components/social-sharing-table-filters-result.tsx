import type { SocialSharingTableFilters } from '../types';

import { useCallback } from 'react';
import {
  ECONOMAP_STATUS,
  ECONOMAP_STATUS_TRANSLATIONS,
} from 'src/modules/economap/_config/economap-status.config';

import Chip from '@mui/material/Chip';
import type { Theme, SxProps } from '@mui/material/styles';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  onResetPage: () => void;
  filters: UseSetStateReturn<SocialSharingTableFilters>;
  sx?: SxProps<Theme>;
};

export default function SocialSharingTableFiltersResult({
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

      <FiltersBlock label="ชื่อ:" isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
