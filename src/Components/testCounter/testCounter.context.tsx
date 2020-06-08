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

type Props = {
    children: React.ReactNode
}
export const CounterProvider: React.FC<Props> = (props) => {
    const ctx = useCounter();

    return (
        <CounterContext.Provider value={ctx}>
            {props.children}
        </CounterContext.Provider>
    )
}