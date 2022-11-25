import React, { useRef, useState } from 'react'
import { AppWrapper } from './style'
import ReactDragResize from '../components/ReactDragResize/ReactDragResize'
// import ReactDragResize from '../../dist/index.js'

function App () {
  const ReactDrageResizeRef = useRef()

  const previousOperationStepHandel = () => {
    ReactDrageResizeRef.current.previousOperationStep()
    console.log(ReactDrageResizeRef.current.historySteps)
  }
  const nextOperationStepHandel = () => {
    ReactDrageResizeRef.current.nextOperationStep()
  }
  const goOperationStepStepHandel = () => {
    ReactDrageResizeRef.current.goOperationStep(-2)
  }

  return (
    <AppWrapper>
      {/* 内容区 */}
      <div className="left-content">
        <ReactDragResize.Group>
          <ReactDragResize
            style={{ backgroundColor: 'pink' }}
            w={200}
            h={200}
            isConflictCheck
          >
            我们是一个组
          </ReactDragResize>

          <ReactDragResize
            style={{ backgroundColor: 'pink' }}
            w={200}
            h={200}
            x={300}
            y={300}
            isConflictCheck
          >
            我们是一个组
          </ReactDragResize>
          <ReactDragResize
            style={{ backgroundColor: 'pink' }}
            w={200}
            h={200}
            x={300}
            y={300}
            isConflictCheck
          >
            我们是一个组
          </ReactDragResize>
        </ReactDragResize.Group>
      </div>
      <div className="right-toolBar">
        {/* <button type="input" onClick={previousOperationStepHandel}>上一步</button>
        <button onClick={nextOperationStepHandel}>下一步</button>
        <button onClick={goOperationStepStepHandel}>跳到前2步</button> */}
      </div>
    </AppWrapper>
  )
}

export default App
