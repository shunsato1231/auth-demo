import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '~/store/auth';
import {
  setLoading,
  setAlert,
  loadingSelector,
  messageSelector,
  severitySelector,
} from '~/store/alert';
import { Dispatch } from '~/store';

import { Backdrop, CircularProgress, Snackbar, Alert } from '@mui/material';

export const DefaultLayout: React.FC = ({ children }) => {
  const dispatch = useDispatch<Dispatch>();
  const auth = useSelector(authSelector);
  const loading = useSelector(loadingSelector);
  const message = useSelector(messageSelector);
  const severity = useSelector(severitySelector);
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = (_: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    dispatch(setLoading(auth.loading));
  }, [auth.loading, dispatch]);

  useEffect(() => {
    if (auth.alert.message) {
      setOpen(true);
      dispatch(setAlert(auth.alert));
    }
  }, [auth.alert, dispatch]);

  return (
    <>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}>
        <CircularProgress sx={{ color: 'white' }} />
      </Backdrop>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
      {children}
    </>
  );
};
