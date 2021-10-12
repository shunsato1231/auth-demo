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
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';

import { classes } from '../theme/default';
import { regex } from '../utils/regex';

export const Login: React.FC = (): JSX.Element => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useFormMui({ mode: 'onTouched' });

  const watchEmail = watch('email');
  const watchPassword = watch('password');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (
    data: {
      email?: string;
      password?: string;
    },
    e?: React.BaseSyntheticEvent
  ) => console.log(data, e);

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
          <form onSubmit={handleSubmit(onSubmit)}>
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
                  error={errors?.email ? true : false}
                  helperText={errors?.email?.message}
                  placeholder="Email"
                  label="Email"
                  fullWidth
                  {...register('email', {
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
                  error={errors?.password ? true : false}
                  helperText={errors?.password?.message}
                  label="Password"
                  placeholder="Password"
                  variant="outlined"
                  fullWidth
                  {...register('password', {
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
                          {showPassword ? <VisibilityOff /> : <Visibility />}
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
    </Container>
  );
};
