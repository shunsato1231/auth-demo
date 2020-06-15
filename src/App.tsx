import React from 'react'
import { TestCounterDisplay, TestCounterButton } from './Components/testCounter/testCounter.conponent'
import { CounterProvider } from './Components/testCounter/testCounter.context'

const styles = require('./App.style.styl')

const App: React.SFC = () => {

  return(
    <CounterProvider>
      <div className={styles.wrapper}>
        <h2 className={styles.heading}> count number </h2>
        <TestCounterDisplay/>
        <TestCounterButton/>
      </div>
    </CounterProvider>
  )
}

export default App
