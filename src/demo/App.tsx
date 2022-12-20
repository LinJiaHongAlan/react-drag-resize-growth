import React, { useState } from 'react'
import { AppWrapper } from './style'
// import ReactDragResize from '../../dist/index'
import ReactDragResize from '../components/ReactDragResize/ReactDragResize'


function App () {

  return (
    <AppWrapper>
      {/* 内容区 */}
      <div className="left-content">
        {/* <ReactDragResize.Group directionStep={ directionStepNum } keyDirection={keyDirectionId} defaultActive="ljh">
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
        </ReactDragResize.Group> */}

        <ReactDragResize
          keyDirection
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
      <div className='right-toolBar'>

      </div>
    </AppWrapper>
  )
}

export default App
