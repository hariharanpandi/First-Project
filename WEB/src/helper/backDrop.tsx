import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import _, { isBoolean } from 'lodash';

interface CustomBackdropProps {
  open: boolean;
}

export const CustomBackdrop = ({ open }: CustomBackdropProps) => {
  return (
    <Backdrop open={
      !_.isNil(open) && isBoolean(open) ? open : false
    } sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
