import type { Theme } from 'src/theme/types';

import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material';
import Typography from '@mui/material/Typography';

import { Iconify } from '../iconify';

type Props = {
  icon: string;
  label: string;
  onClick: () => void;
  highlight?: boolean;
  iconSx?: SxProps<Theme>;
};

export function IconLabelButton({ icon, label, onClick, highlight = false, iconSx }: Props) {
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
