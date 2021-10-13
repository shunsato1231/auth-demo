import React, { useState } from 'react';
import { useFormMui } from '../hooks/FormMui/FormMui.hook';

import {
  Container,
  Typography,
  Box,
  Card,
  Grid,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Slide,
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';

import { classes } from '../theme/default';
import { regex } from '../utils/regex';
import { useAuthContext } from '../hooks/Auth/Auth.context';

export const Signin: React.FC = (): JSX.Element => {
  const auth = useAuthContext();

  const {
    handleSubmit: haldleSubmitSignin,
    register: registerSignin,
    formState: { errors: signinErrors },
    watch: watchSignin,
  } = useFormMui({ mode: 'onTouched' });
  const watchEmail = watchSignin('email');
  const watchPassword = watchSignin('password');
  const [showPassword, setShowPassword] = useState(false);
  const onSignin = (data: { email: string; password: string }) => {
    auth.signIn(data.email, data.password).catch((err) => {
      console.error(err);
    });
  };

  const {
    handleSubmit: haldleSubmitMfa,
    register: registerMfa,
    formState: { errors: mfaErrors },
    watch: watchMfa,
  } = useFormMui({ mode: 'onTouched' });
  const watchCode = watchMfa('code');
  const onMfaVerify = (data: { code: string }) => {
    auth.verifiedMfa(data.code).catch((err) => {
      console.error(err);
    });
  };

  const containerRef = React.useRef(null);

  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: {
          xs: 4,
        },
      }}
      ref={containerRef}>
      <Slide
        direction="left"
        in={!auth.flag.tokenVerified}
        container={containerRef.current}>
        <Box
          sx={{
            width: ['100%', 580],
            display: auth.flag.tokenVerified ? 'none' : 'block',
          }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            fontWeight="bold"
            sx={{
              color: 'primary.main',
              mb: 6,
            }}>
            Login
          </Typography>
          <Card
            variant="outlined"
            sx={{
              width: ['100%', 580],
            }}>
            <Box
              sx={{
                my: {
                  xs: 6,
                  md: 8,
                },
                mx: {
                  xs: 4,
                  md: 6,
                },
              }}>
              <form onSubmit={haldleSubmitSignin(onSignin)}>
                <Grid
                  container
                  direction="column"
                  rowSpacing={{
                    xs: 4,
                    md: 6,
                  }}>
                  <Grid item>
                    <TextField
                      type="text"
                      className={watchEmail ? classes.formFilled : ''}
                      error={signinErrors?.email ? true : false}
                      helperText={signinErrors?.email?.message}
                      placeholder="Email"
                      label="Email"
                      fullWidth
                      {...registerSignin('email', {
                        required: 'required email',
                        pattern: {
                          value: regex.email,
                          message: 'invalid email',
                        },
                      })}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type={showPassword ? 'text' : 'password'}
                      className={watchPassword ? classes.formFilled : ''}
                      error={signinErrors?.password ? true : false}
                      helperText={signinErrors?.password?.message}
                      label="Password"
                      placeholder="Password"
                      variant="outlined"
                      fullWidth
                      {...registerSignin('password', {
                        required: 'required password',
                        pattern: {
                          value: regex.password,
                          message: 'invalid password',
                        },
                      })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end">
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item marginTop={5}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth>
                      Login
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Card>
        </Box>
      </Slide>
      <Slide
        direction="left"
        in={auth.flag.tokenVerified}
        container={containerRef.current}>
        <Box
          sx={{
            display: !auth.flag.tokenVerified ? 'none' : 'block',
          }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            fontWeight="bold"
            sx={{
              color: 'primary.main',
              mb: 6,
            }}>
            Mfa verify
          </Typography>
          <Card
            variant="outlined"
            sx={{
              width: ['100%', 580],
            }}>
            <Box
              sx={{
                my: {
                  xs: 6,
                  md: 8,
                },
                mx: {
                  xs: 4,
                  md: 6,
                },
              }}>
              <form onSubmit={haldleSubmitMfa(onMfaVerify)}>
                <Grid
                  container
                  direction="column"
                  rowSpacing={{
                    xs: 4,
                    md: 6,
                  }}>
                  <Grid item>
                    <TextField
                      type="number"
                      className={watchCode ? classes.formFilled : ''}
                      error={mfaErrors?.code ? true : false}
                      helperText={mfaErrors?.code?.message}
                      placeholder="One time password"
                      label="One time password"
                      fullWidth
                      {...registerMfa('code', {
                        required: 'required code',
                        validate: (value) =>
                          value.length === 6 ||
                          'Please enter the code in 6 digits',
                      })}
                    />
                  </Grid>
                  <Grid item marginTop={5}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth>
                      Login
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={() => auth.signOut()}
                      sx={{
                        backgroundColor: 'primary.light',
                      }}>
                      別のアカウントでログインする
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Card>
        </Box>
      </Slide>
    </Container>
  );
};
