import React from 'react'

import { useCounterContext } from './testCounter.context'
const styles = require('./testCounter.style.styl')

interface DisplayProps {
    initialCount?: number
}

export const TestCounterDisplay: React.SFC<DisplayProps> = () => {

  const counterCtx = useCounterContext()

    return (
      <div 
           className={styles.counter}
          data-testid='display'
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
          className={styles.minusButton}
          onClick={() => counterCtx.decrement()}
      >
          -1
      </button>
      <button 
          data-testid='incrementButton'
          className={styles.plusButton}
          onClick={() => counterCtx.increment()}
      >
          +1
      </button>
    </div>
  )
}