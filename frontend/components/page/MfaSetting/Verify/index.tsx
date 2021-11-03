import React from 'react';
import {
  UseControllerProps,
  UseFormReturn,
  useController,
} from 'react-hook-form';
import { Stack, Button, Typography, TextField } from '@mui/material';
import { ArrowBackIosNew } from '@mui/icons-material';
import { theme } from '~/theme/default';
export interface VerifyProps {
  useVerifyForm: UseFormReturn;
  toBackwardStep: () => void;
  verify: ({ code1, code2 }: { code1: string; code2: string }) => void;
  code1ControllerProps: UseControllerProps;
  code2ControllerProps: UseControllerProps;
}
export const Verify: React.FC<VerifyProps> = React.memo(
  ({
    useVerifyForm,
    toBackwardStep,
    code1ControllerProps,
    code2ControllerProps,
    verify,
  }): JSX.Element => {
    const { handleSubmit } = useVerifyForm;
    const {
      field: { ref: code1Ref, ...code1InputProps },
      fieldState: { error: code1Errors },
    } = useController(code1ControllerProps);
    const {
      field: { ref: code2Ref, ...code2InputProps },
      fieldState: { error: code2Errors },
    } = useController(code2ControllerProps);
    return (
      <Stack
        justifyContent="space-between"
        sx={{
          width: '100%',
          height: '100%',
          py: {
            xs: 6,
            md: 8,
          },
          px: {
            xs: 4,
            md: 6,
          },
        }}
        component="section">
        <Typography
          variant="subtitle1"
          component="h1"
          sx={{
            fontWeight: 600,
            textAlign: 'center',
          }}>
          連続する2つのワンタイムパスワードを入力してください。
        </Typography>
        <form onSubmit={handleSubmit(verify)}>
          <Stack
            justifyContent="space-around"
            sx={{
              flexGrow: 0.5,
              my: 6,
            }}>
            <TextField
              type="text"
              error={code1Errors ? true : false}
              helperText={code1Errors?.message}
              placeholder="Enter One Time Password 1"
              label="1つめのパスワード"
              fullWidth
              inputRef={code1Ref}
              {...code1InputProps}
              sx={{
                mb: 4,
              }}
            />
            <TextField
              type="text"
              error={code2Errors ? true : false}
              helperText={code2Errors?.message}
              placeholder="Enter One Time Password 2"
              label="2つめのパスワード"
              fullWidth
              inputRef={code2Ref}
              {...code2InputProps}
              sx={{
                mb: 4,
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                my: 6,
              }}>
              認証する
            </Button>
          </Stack>
        </form>
        <Button
          onClick={() => toBackwardStep()}
          variant="text"
          sx={{
            mr: 'auto',
            px: 0,
            minWidth: 'auto',
          }}>
          <ArrowBackIosNew
            sx={{
              fill: theme.palette.grey[300],
              fontSize: 30,
            }}
          />
        </Button>
      </Stack>
    );
  }
);

Verify.displayName = 'Verify';
