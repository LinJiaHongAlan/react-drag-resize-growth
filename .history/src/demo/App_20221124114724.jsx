import React, { useRef, useState } from 'react'
import { AppWrapper } from './style'
import ReactDragResize from '../components/ReactDragResize/ReactDragResize.jsx'
// import ReactDragResize from '../../dist/index.js'

function App() {
  const [width, setwidth] = useState(800)

  const ReactDrageResizeRef = useRef()

  const previousOperationStepHandel = () =>{
    ReactDrageResizeRef.current.previousOperationStep()
    console.log(ReactDrageResizeRef.current.historySteps)
  }
  const nextOperationStepHandel = () =>{
    ReactDrageResizeRef.current.nextOperationStep()
  }
  const goOperationStepStepHandel = () =>{
    ReactDrageResizeRef.current.goOperationStep(-2)
  }

  return (
    <AppWrapper>
      {/* 内容区 */}
      {/* top: 30px;
      bottom: 30px;
      left: 30px;
      right: 300px;
      -webkit-box-shadow: 0 0 2px #aaa;
      box-shadow: 0 0 2px #aaa;
      background-color: #fff; */}
      <div className='left-content'>

      </div>
      <div className='right-toolBar'>

      </div>
      <div style={{ position: 'absolute', top: '200px', right: '200px' }}>
        <button onClick={previousOperationStepHandel}>上一步</button>
        <button onClick={nextOperationStepHandel}>下一步</button>
        <button onClick={goOperationStepStepHandel}>跳到前2步</button>
      </div>

      <ReactDragResize style={{backgroundColor: 'pink'}} w={200} h={200} historyStepsLength={30} ref={ReactDrageResizeRef} isConflictCheck={true}>
        操作块之后可以回退
      </ReactDragResize>
    </AppWrapper>
  );
}

export default App;
