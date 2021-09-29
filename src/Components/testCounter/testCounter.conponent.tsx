import React from 'react'

import { useCounterContext } from './testCounter.context'
import styles from './testCounter.style.styl'

import Button from '@mui/material/Button'

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
      <Button 
          data-testid='decrementButton'
          onClick={() => counterCtx.decrement()}
          variant="contained"
          sx={{
            mr: 1
          }}
      >
          -1
      </Button>
      <Button 
          data-testid='incrementButton'
          onClick={() => counterCtx.increment()}
          variant="contained"
          sx={{
            ml: 0
          }}
      >
          +1
      </Button>
    </div>
  )
}