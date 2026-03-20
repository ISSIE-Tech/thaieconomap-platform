import Button from '@mui/material/Button';

import { common, primary } from 'src/theme/core';

type Props = {
  onClick: () => void;
};

const DateTimeButton = ({ onClick }: Props) => (
  <Button
    variant="contained"
    type="button"
    sx={{
      py: 1.5,
      px: 2.5,
      borderRadius: 4,
      width: '100%',
      marginTop: '40px',
      '&:hover': {
        bgcolor: primary.lighter,
      },
      '&:active': {
        bgcolor: primary.main,
      },
      '&:focus': {
        bgcolor: common.lighter,
      },
    }}
    onClick={onClick}
  >
    + เพิ่มวันทำการ
  </Button>
);

export default DateTimeButton;
