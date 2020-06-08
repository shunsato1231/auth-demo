import { useState } from 'react'

const useCounter = (): { count:number, increment:() => void, decrement: () => void } => {
    const [count, setCount] = useState(0)

    const increment = () => setCount(count + 1)
    const decrement = () => setCount(count - 1)

    return {
      count,
      increment,
      decrement
    }
}

export default useCounter