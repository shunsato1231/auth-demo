import React from 'react'

import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import defaultTheme from './Theme/default'

import { TestCounterDisplay, TestCounterButton } from './Components/testCounter/testCounter.conponent'
import { CounterProvider } from './Components/testCounter/testCounter.context'

import styles from './App.style.styl'

const App: React.SFC = () => {

  return(
    <ThemeProvider theme={defaultTheme}>
      <CounterProvider>
        <CssBaseline />
        <div className={styles.wrapper}>
          <h2 className={styles.heading}> count number </h2>
          <TestCounterDisplay/>
          <TestCounterButton/>
        </div>
      </CounterProvider>
    </ThemeProvider>
  )
}

export default App
