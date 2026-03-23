'use client';

import { Iconify } from 'src/shared/components/iconify';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

type Props = {
  text: string;
};

export function BulletList({ text }: Props) {
  return (
    <ListItem disablePadding alignItems="flex-start">
      <ListItemIcon sx={{ mr: 0.5 }}>
        <Iconify width={24} icon="bi:dot" />
      </ListItemIcon>

      <ListItemText primary={text} primaryTypographyProps={{ variant: 'body2', mt: 0.5 }} />
    </ListItem>
  );
}
