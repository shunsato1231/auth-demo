import React, { useState } from 'react'


const App: React.SFC = () => {
  const [index, setIndex] = useState<number>(0)
  const increment = () => {
    setIndex(index + 1)
  }

  return(
    <>
      <p>{index}</p>
      <button onClick={increment}>Add</button>
    </>
  )
}

export default App