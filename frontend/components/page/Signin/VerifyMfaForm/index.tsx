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
} from '@mui/material';

export interface VerifyMfaFormProps {
  verifyMfa: ({ code }: { code: string }) => void;
  cancelVerifyMfa: () => Promise<void>;
  codeControllerProps: UseControllerProps;
}

export const VerifyMfaForm: React.FC<VerifyMfaFormProps> = React.memo(
  ({ verifyMfa, cancelVerifyMfa, codeControllerProps }) => {
    const { handleSubmit } = useFormContext();
    const {
      field: { ref, ...inputProps },
      fieldState: { error },
    } = useController(codeControllerProps);

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
            xs: 0,
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
            <form onSubmit={handleSubmit(verifyMfa)}>
              <Stack
                spacing={{
                  xs: 4,
                  md: 6,
                }}>
                <TextField
                  type="number"
                  error={error ? true : false}
                  helperText={error?.message}
                  placeholder="One time password"
                  label="One time password"
                  fullWidth
                  inputRef={ref}
                  {...inputProps}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth>
                  Verify
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => cancelVerifyMfa()}
                  sx={{
                    backgroundColor: 'primary.light',
                  }}>
                  別のアカウントでログインする
                </Button>
              </Stack>
            </form>
          </Card>
        </Box>
      </Container>
    );
  }
);

VerifyMfaForm.displayName = 'VerifyMfaForm';
