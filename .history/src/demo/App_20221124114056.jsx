import React, { useRef, useState } from 'react'
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
    <div style={{width: '100%', height: '100%'}} className="App">
      {/* 内容区 */}
      <div className=''="left-content">

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

    </div>
  );
}

export default App;
