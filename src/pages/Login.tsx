import React from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  Grid,
  TextField,
  Button
} from '@mui/material'

export const Login: React.FC = (): JSX.Element => {
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
        }
      }}
    >
      <Typography
        variant='h4'
        component='h1'
        align='center'
        fontWeight='bold'
        sx={{
          color: 'primary.main',
          mb: 6
        }}
      >
        Login
      </Typography>
      <Card
        variant='outlined'
        sx={{
          width: ['100%', 580]
        }}
      >
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
          }}
        >
          <Grid
            container
            direction='column'
            rowSpacing={{
              xs: 4,
              md: 6
            }}
          >
            <Grid item>
              <TextField
                placeholder='User ID'
                label="User ID"
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label='Password'
                placeholder='Password'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid
              item
              marginTop={5}
            >
              <Button
                variant='contained'
                size='large'
                fullWidth
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Container>
  )
}