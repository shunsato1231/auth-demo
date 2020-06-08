import React from 'react'
import {css} from '@emotion/core'
import { TestCounterDisplay, TestCounterButton } from './Components/testCounter/testCounter.conponent'
import { CounterProvider } from './Components/testCounter/testCounter.context'

const App: React.SFC = () => {
  return(
    <CounterProvider>
      <div css={wrapper}>
        <h2 css={heading}> count number </h2>
        <TestCounterDisplay/>
        <TestCounterButton/>
      </div>
    </CounterProvider>
  )
}

const wrapper = css`
  text-align: center;
`

const heading = css`
  margin 50px auto;
  font-size: 18px;
`

export default App
