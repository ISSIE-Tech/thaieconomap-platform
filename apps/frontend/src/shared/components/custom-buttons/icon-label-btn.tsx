import type { Theme } from 'src/theme/types';

import { useContext, createContext } from 'react';

import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import type { SxProps } from '@mui/material';
import Typography from '@mui/material/Typography';

import { Iconify } from '../iconify';

/** Inside a provider set to true, action buttons render as full-width pills (desktop panels). */
export const PillButtonsContext = createContext(false);

type Props = {
  icon: string;
  label: string;
  onClick: () => void;
  highlight?: boolean;
  iconSx?: SxProps<Theme>;
};

export function IconLabelButton({ icon, label, onClick, highlight = false, iconSx }: Props) {
  const pill = useContext(PillButtonsContext);

  if (pill)
    return (
      <Button
        onClick={onClick}
        startIcon={<Iconify width={20} icon={icon} />}
        sx={{
          height: 44,
          borderRadius: '9999px',
          border: 2,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          ...(highlight
            ? {
                bgcolor: 'primary.main',
                borderColor: 'primary.main',
                color: 'common.white',
                '&:hover': { bgcolor: 'primary.dark', borderColor: 'primary.dark' },
              }
            : { bgcolor: 'common.white', borderColor: 'primary.lighter', color: 'primary.dark' }),
        }}
      >
        {label}
      </Button>
    );

  const stackStyle = highlight
    ? { bgcolor: (theme: Theme) => theme.palette.primary.main }
    : {
        bgcolor: 'white',
        border: 2,
        borderColor: (theme: Theme) => theme.palette.primary.lighter,
      };
  const iconStyle = highlight
    ? { color: 'white', ...iconSx }
    : { color: (theme: Theme) => theme.palette.primary.main, ...iconSx };

  return (
    <Stack sx={{ alignItems: 'center' }}>
      <Fab color="default" size="small" sx={stackStyle} onClick={onClick}>
        <Iconify width={24} icon={icon} sx={iconStyle} />
      </Fab>

      <Typography
        color={highlight ? 'primary' : 'textSecondary'}
        fontWeight={highlight ? 'bold' : 'normal'}
        variant={highlight ? 'body2' : 'caption'}
        py={highlight ? 0 : 0.5}
      >
        {label}
      </Typography>
    </Stack>
  );
}
