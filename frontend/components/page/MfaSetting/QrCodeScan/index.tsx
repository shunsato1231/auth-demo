import React from 'react';
import {
  Stack,
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  CircularProgress,
  accordionClasses,
  accordionSummaryClasses,
  accordionDetailsClasses,
} from '@mui/material';
import { ChevronRight, ArrowBackIosNew, CopyAll } from '@mui/icons-material';
import { CopyToClipBoard } from '~/components/ui/CopyToClipBoard';
import { theme } from '~/theme/default';
export interface QrCodeScanProps {
  qrCode: string;
  toForwardStep: () => void;
  toBackwardStep: () => void;
  toggleMfaSettingCode: (
    event: React.SyntheticEvent,
    expanded: boolean
  ) => void;
  mfaSettingCode: string;
}
export const QrCodeScan: React.FC<QrCodeScanProps> = ({
  qrCode,
  toForwardStep,
  toBackwardStep,
  toggleMfaSettingCode,
  mfaSettingCode,
}): JSX.Element => {
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
        下記のQRコードをスキャンしてください。
      </Typography>
      <Stack
        spacing={4}
        justifyContent="space-around"
        sx={{
          flexGrow: 0.5,
          my: 6,
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          {qrCode ? (
            <img src={qrCode} width={200} height={200} />
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 200,
                height: 200,
              }}>
              <CircularProgress size={80} />
            </Box>
          )}
        </Box>
        <Accordion
          elevation={0}
          onChange={toggleMfaSettingCode}
          expanded={mfaSettingCode !== ''}
          sx={{
            margin: 0,
            [':before']: {
              display: 'none',
            },
            [`.${accordionSummaryClasses.root}`]: {
              padding: 0,
              [`&.${accordionClasses.expanded}`]: {
                minHeight: 'auto',
              },
              [`.${accordionSummaryClasses.content}`]: {
                margin: 0,
                padding: 0,
              },
            },
            [`.${accordionDetailsClasses.root}`]: {
              padding: 0,
            },
          }}>
          <AccordionSummary
            sx={{
              my: 0,
              minHeight: 0,
              transitionDuration: '215ms',
            }}>
            <Typography
              variant="body2"
              component="p"
              color="primary"
              sx={{
                textDecoration: 'underline',
              }}>
              コードを表示する場合はこちらをクリックしてください。
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper
              variant="outlined"
              sx={{
                py: 2,
                px: 4,
                mt: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              {mfaSettingCode ? (
                <Typography
                  variant="body2"
                  component="span"
                  sx={{
                    flexShrink: 1,
                    flexGrow: 0,
                    minWidth: 0,
                    overflow: 'scroll',
                  }}>
                  {mfaSettingCode}
                </Typography>
              ) : (
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <CircularProgress
                    size={25}
                    sx={{
                      color: theme.palette.grey[300],
                    }}
                  />
                </Box>
              )}
              <CopyToClipBoard
                TooltipProps={{
                  placement: 'top',
                  arrow: true,
                  leaveDelay: 1500,
                }}
                successMessage="コードをコピーしました"
                errorMessage="コピーに失敗しました">
                {({ copy }) => (
                  <Button
                    disabled={!mfaSettingCode}
                    onClick={() => {
                      if (mfaSettingCode) {
                        copy(mfaSettingCode);
                      }
                    }}
                    variant="text"
                    sx={{
                      height: 'auto',
                      minWidth: 'auto',
                      flexShrink: 0,
                      flexGrow: 0,
                    }}>
                    <CopyAll />
                  </Button>
                )}
              </CopyToClipBoard>
            </Paper>
          </AccordionDetails>
        </Accordion>
      </Stack>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Button
          onClick={() => toBackwardStep()}
          variant="text"
          sx={{
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
        <Button
          onClick={() => toForwardStep()}
          variant="outlined"
          sx={{
            pr: 2,
            height: 36,
          }}>
          次のステップへ
          <ChevronRight
            sx={{
              fill: theme.palette.primary.light,
              ml: 1,
            }}
          />
        </Button>
      </Box>
    </Stack>
  );
};
