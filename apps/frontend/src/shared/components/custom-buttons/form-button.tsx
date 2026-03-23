import { common, primary } from 'src/theme/core';

import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import type { Theme, SxProps } from '@mui/material/styles';

type Props = {
  onClick: () => void;
  label: string;
  loading?: boolean;
  sx?: SxProps<Theme>;
};

const FormButton = ({ onClick, label, loading, sx }: Props) => (
  <>
    {loading ? (
      <LoadingButton
        loading
        variant="contained"
        sx={{
          py: 1.5,
          px: 2.5,
          borderRadius: 4,
          width: '100%',
          marginTop: '40px',
          bgcolor: primary.main,
          ...sx,
        }}
      >
        {label}
      </LoadingButton>
    ) : (
      <Button
        onClick={onClick}
        variant="contained"
        sx={{
          py: 1.5,
          px: 2.5,
          borderRadius: 4,
          width: '100%',
          marginTop: '40px',
          bgcolor: primary.main,
          color: common.white,
          '&:hover': {
            bgcolor: primary.dark,
          },
          '&:active': {
            bgcolor: primary.main,
          },
          '&:focus': {
            bgcolor: primary.main,
          },
          ...sx,
        }}
      >
        {label}
      </Button>
    )}
  </>
);

export default FormButton;
