import React from 'react'
import { css } from '@emotion/core'

import { useCounterContext } from './testCounter.context'

interface DisplayProps {
    initialCount?: number
}

export const TestCounterDisplay: React.SFC<DisplayProps> = () => {
  const counterCtx = useCounterContext()

    return (
      <div 
          data-testid='display'
          css={counter}
      >
          {counterCtx.count}
      </div>
    )
}

export const TestCounterButton: React.SFC = () => {
  const counterCtx = useCounterContext()

  return (
    <div>
      <button 
          data-testid='decrementButton'
          css={minusButton}
          onClick={() => counterCtx.decrement()}
      >
          -1
      </button>
      <button 
          data-testid='incrementButton'
          css={plusButton}
          onClick={() => counterCtx.increment()}
      >
          +1
      </button>
    </div>
  )
}


const counter = css`
  font-size: 30px;
  font-weight: bold;
  margin: 30px 0;
`

const button = css`
  width: 100px;
  height: 40px;
  color: #fff;
  font-size: 14px;
  border: none;
  outline: none;
`

const plusButton = css`
  ${button};
  background: #23B036;
  border-radius: 0 5px 5px 0;
`

const minusButton = css`
  ${button};
  background: #D0111F;
  border-radius: 5px 0 0 5px;
`