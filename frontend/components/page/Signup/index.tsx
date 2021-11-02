import React from 'react';
import { useController } from 'react-hook-form';
import { useSignupPage } from './hook';
import {
  Box,
  Typography,
  Card,
  Stack,
  Button,
  TextField,
  Container,
} from '@mui/material';
import { ToggleTextField } from '~/components/ui/ToggleTextField';

export const Signup: React.FC = React.memo(() => {
  const {
    useSignupForm,
    emailControllerProps,
    passwordControllerProps,
    confirmPasswordControllerProps,
    signup,
  } = useSignupPage();

  const { handleSubmit } = useSignupForm;
  const {
    field: { ref: emailRef, ...emailInputProps },
    fieldState: { error: emailErrors },
  } = useController(emailControllerProps);
  const {
    field: { ref: passwordRef, ...passwordInputProps },
    fieldState: { error: passwordErrors },
  } = useController(passwordControllerProps);
  const {
    field: { ref: confirmPasswordRef, ...confirmPasswordInputProps },
    fieldState: { error: confirmPasswordErrors },
  } = useController(confirmPasswordControllerProps);

  return (
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
          width: ['100%', 580, 700],
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
          Signup
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
          <form onSubmit={handleSubmit(signup)}>
            <Stack
              spacing={{
                xs: 4,
                md: 6,
              }}>
              <TextField
                type="text"
                error={emailErrors ? true : false}
                helperText={emailErrors?.message}
                placeholder="Email"
                label="Email"
                fullWidth
                inputRef={emailRef}
                {...emailInputProps}
              />
              <ToggleTextField
                error={passwordErrors ? true : false}
                helperText={passwordErrors?.message}
                placeholder="Password"
                label="Password"
                fullWidth
                inputRef={passwordRef}
                {...passwordInputProps}
              />
              <ToggleTextField
                error={confirmPasswordErrors ? true : false}
                helperText={confirmPasswordErrors?.message}
                placeholder="Password"
                label="Password"
                fullWidth
                inputRef={confirmPasswordRef}
                {...confirmPasswordInputProps}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mt: 5,
                }}>
                Login
              </Button>
            </Stack>
          </form>
        </Card>
      </Box>
    </Container>
  );
});

Signup.displayName = 'Signup';
