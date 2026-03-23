import Box from '@mui/material/Box';
import type { SxProps } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles/createTheme';

type StatusTextProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
};

function StatusText({ sx, children }: StatusTextProps) {
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)', // Center horizontally
          px: 1,
          py: 0,
          width: 'max-content',
          minWidth: 'auto',
          bgcolor: '#2F9F5C',
          color: 'white',
          border: 1,
          borderColor: 'white',
          borderRadius: '9999px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'visible',
          display: 'flex',
          alignItems: 'center',
          gap: '1px',
          ...sx, // Apply any additional styles passed in via the sx prop
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default StatusText;
