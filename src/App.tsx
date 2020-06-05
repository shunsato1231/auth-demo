import React, { useState } from 'react'
import { css } from '@emotion/core'

const App: React.SFC = () => {
  const [index, setIndex] = useState<number>(0)
  const increment = () => {
    setIndex(index + 1)
  }

  return(
    <>
      <p css={counter}>{index}</p>
      <button css={button} onClick={increment}>Add</button>
    </>
  )
}
const counter = css`
  font-size 18px
`

const button = css`
  padding: 10px 20px;
  background: #333;
  color: #fff;
  font-size: 14px;
`

export default App