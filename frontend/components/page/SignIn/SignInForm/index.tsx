import React from 'react';
import {
  useController,
  UseControllerProps,
  UseFormReturn,
} from 'react-hook-form';

import {
  Box,
  Typography,
  Card,
  Stack,
  Button,
  TextField,
  Container,
  Link,
} from '@mui/material';
import { ToggleTextField } from '~/components/ui/ToggleTextField';

export interface SignInFormProps {
  signIn: ({ email, password }: { email: string; password: string }) => void;
  emailControllerProps: UseControllerProps;
  passwordControllerProps: UseControllerProps;
  useSignInForm: UseFormReturn;
}

export const SignInForm: React.FC<SignInFormProps> = React.memo(
  ({
    signIn,
    emailControllerProps,
    passwordControllerProps,
    useSignInForm,
  }) => {
    const { handleSubmit } = useSignInForm;
    const {
      field: { ref: emailRef, ...emailInputProps },
      fieldState: { error: emailErrors },
    } = useController(emailControllerProps);
    const {
      field: { ref: passwordRef, ...passwordInputProps },
      fieldState: { error: passwordErrors },
    } = useController(passwordControllerProps);

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
            SignIn
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
            <form onSubmit={handleSubmit(signIn)}>
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
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    mt: 5,
                  }}>
                  SignIn
                </Button>
              </Stack>
            </form>
          </Card>
          <Link
            href="/signUp"
            variant="body2"
            sx={{
              display: 'table',
              mt: 4,
              ml: 'auto',
            }}>
            ユーザー登録はこちら
          </Link>
        </Box>
      </Container>
    );
  }
);

SignInForm.displayName = 'SignInForm';
