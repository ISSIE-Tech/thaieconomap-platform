import type { JobPostActioner } from '../../types';

import { Typography } from '@mui/material';

import { CSC_ROLE_TRANSLATIONS } from '../../types';

type Props = {
  actioner?: JobPostActioner;
};

/** name over role, matching how commercial shows who created or edited a row */
export function JobActioner({ actioner }: Props) {
  if (!actioner) {
    return <Typography variant="body2">-</Typography>;
  }

  return (
    <>
      <Typography variant="body2">{actioner.name}</Typography>
      <Typography variant="caption" color="text.secondary">
        {CSC_ROLE_TRANSLATIONS[actioner.role] ?? actioner.role}
      </Typography>
    </>
  );
}
