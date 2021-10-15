import React, { useState } from 'react';
import { useFormMui } from '~/hooks/FormMui/FormMui.hook';

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
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';

import { regex } from '~/utils/regex';
import { useAuthContext } from '~/hooks/Auth/Auth.context';
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Signin: React.FC = (): JSX.Element => {
  const auth = useAuthContext();

  const {
    handleSubmit: haldleSubmitSignin,
    register: registerSignin,
    reset: resetSigninInput,
    formState: { errors: signinErrors },
  } = useFormMui({ mode: 'onTouched' });
  const [showPassword, setShowPassword] = useState(false);
  const [resetSigninFlag, setResetSigninFlag] = useState<number>(0);
  const resetSignin = () => {
    resetSigninInput();
    setResetSigninFlag(resetSigninFlag + 1);
  };
  const onSignin = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    auth
      .signIn(email, password)
      .then(async () => {
        await sleep(700);
        resetSignin();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const {
    handleSubmit: haldleSubmitMfa,
    register: registerMfa,
    reset: resetMfaInput,
    clearErrors: clearErrorsMfa,
    setError: setErrorMfa,
    formState: { errors: mfaErrors },
  } = useFormMui({ mode: 'onTouched' });
  const [resetMfaFlag, setResetMfaFlag] = useState<number>(0);
  const resetMfa = () => {
    resetMfaInput();
    setResetMfaFlag(resetMfaFlag + 1);
  };
  const onMfaVerify = ({ code }: { code: string }) => {
    auth
      .verifiedMfa(code)
      .then(async () => {
        resetMfa();
      })
      .catch((err) => {
        resetMfa();
        setErrorMfa('code', {
          type: 'manual',
          message: err.error_user_message,
        });
      });
  };

  const mfaVerifyCancel = async () => {
    auth.signOut().then(async () => {
      resetMfa();
      clearErrorsMfa();
    });
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}>
      <Box
        sx={{
          display: 'flex',
          width: '200vw',
          transition: 'transform 0.7s ease 0.2s',
          transform: auth.flag.tokenVerified
            ? 'translateX(-100vw)'
            : 'translateX(0)',
        }}>
        <Container
          sx={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            px: {
              xs: 0,
            },
          }}>
          <Box
            sx={{
              width: ['100%', 700],
              mx: {
                xs: 4,
              },
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
                width: '100%',
                py: {
                  xs: 6,
                  md: 8,
                },
                px: {
                  xs: 4,
                  md: 6,
                },
              }}>
              <form
                key={resetSigninFlag}
                onSubmit={haldleSubmitSignin(onSignin)}>
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
            </Card>
          </Box>
        </Container>
        <Container
          sx={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            px: {
              xs: 4,
            },
          }}>
          <Box
            sx={{
              width: ['100%', 700],
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
                width: '100%',
                py: {
                  xs: 6,
                  md: 8,
                },
                px: {
                  xs: 4,
                  md: 6,
                },
              }}>
              <form key={resetMfaFlag} onSubmit={haldleSubmitMfa(onMfaVerify)}>
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
                      Verify
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={() => mfaVerifyCancel()}
                      sx={{
                        backgroundColor: 'primary.light',
                      }}>
                      別のアカウントでログインする
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
