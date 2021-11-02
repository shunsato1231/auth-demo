import React from 'react';
import {
  UseControllerProps,
  useFormContext,
  useController,
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

export interface SigninFormProps {
  signin: ({ email, password }: { email: string; password: string }) => void;
  emailControllerProps: UseControllerProps;
  passwordControllerProps: UseControllerProps;
}

export const SigninForm: React.FC<SigninFormProps> = React.memo(
  ({ signin, emailControllerProps, passwordControllerProps }) => {
    const { handleSubmit } = useFormContext();
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
            Signin
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
            <form onSubmit={handleSubmit(signin)}>
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
                  Login
                </Button>
              </Stack>
            </form>
          </Card>
          <Link
            href="/signup"
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

SigninForm.displayName = 'SigninForm';
