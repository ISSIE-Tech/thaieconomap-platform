import type { ECONOMAP_STATUS } from '../../_config/economap-status.config';

export type CommercialTableFilters = {
  status: ECONOMAP_STATUS;
  category: string[];
  name: string;
};
