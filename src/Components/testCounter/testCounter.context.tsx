import React, { createContext, useContext } from 'react'
import useCounter from './testCounter.hook'
 
// set context type
type CounterContextType = {
  count: number
  increment: () => void
  decrement: () => void
}

// context default value
const defaultContext: CounterContextType = {
  count: 0,
  increment: () => {},
  decrement: () => {}
}

const CounterContext = createContext<CounterContextType>(defaultContext)
export const useCounterContext = () => useContext(CounterContext)

export const CounterProvider: React.SFC = ({children}) => {
    const ctx = useCounter();

    return (
        <CounterContext.Provider value={ctx}>
            {children}
        </CounterContext.Provider>
    )
}