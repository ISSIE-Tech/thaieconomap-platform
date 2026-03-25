import type { GeoJsonLineString } from '../../type';

import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

type Props = {
  sessions: GeoJsonLineString[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export default function TrackingSessionList({ sessions, selectedIndex, onSelect }: Props) {
  return (
    <Card>
      <CardHeader title="ช่วงเวลา" subheader={`${sessions.length} ช่วงเวลา`} />
      <Divider />
      <List sx={{ maxHeight: 500, overflow: 'auto' }}>
        {sessions.map((session, index) => (
          <ListItemButton
            key={index}
            selected={selectedIndex === index}
            onClick={() => onSelect(index)}
            sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <ListItemText
              primary={`ช่วงเวลาที่ ${index + 1}`}
              secondary={
                <Typography variant="caption" component="span" display="block">
                  จุดติดตาม: {session.coordinates?.length || 0} จุด
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Card>
  );
}
