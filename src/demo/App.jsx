import React, { useRef, useState } from 'react'
import { AppWrapper } from './style'
import ReactDragResize from '../components/ReactDragResize/ReactDragResize'
// import ReactDragResize from '../../dist/index.js'

function App () {
  const ReactDrageResizeRef = useRef()
  const [keyDirectionId, setKeyDirectionId] = useState('ljh')
  const [directionStepNum, setDirectionStepNum] = useState(1)

  return (
    <AppWrapper>
      {/* 内容区 */}
      <div className="left-content">
        <ReactDragResize.Group directionStep={ directionStepNum } keyDirection={keyDirectionId} defaultActive="ljh">
          <ReactDragResize
            comid="ljh"
            parentLimitation={true}
            style={{ backgroundColor: 'pink' }}
            w={200}
            h={200}
            isConflictCheck
          >
            我们是一个组
          </ReactDragResize>
          <ReactDragResize
          comid="ljh2"
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
          comid="ljh3"
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


        <ReactDragResize
          keyDirection={true}
          style={{ backgroundColor: 'pink' }}
          w={200}
          h={200}
          x={300}
          y={300}
          isConflictCheck
        >
          我是一个孤独的人
        </ReactDragResize>
      </div>
      <div className="right-toolBar">
        <button onClick={() => {
          setKeyDirectionId('ljh3')
        }}>变换</button>
        <button onClick={() => { setDirectionStepNum(directionStepNum + 5) }}>增加步数</button>
        {/* <button type="input" onClick={previousOperationStepHandel}>上一步</button>
        <button onClick={nextOperationStepHandel}>下一步</button>
        <button onClick={goOperationStepStepHandel}>跳到前2步</button> */}
      </div>
    </AppWrapper>
  )
}

export default App
