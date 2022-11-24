import React, { useRef, useState } from 'react';
import { AppWrapper } from './style';
import ReactDragResize from '../components/ReactDragResize/ReactDragResize.jsx';
// import ReactDragResize from '../../dist/index.js'

function App() {
  const ReactDrageResizeRef = useRef();

  const previousOperationStepHandel = () => {
    ReactDrageResizeRef.current.previousOperationStep();
    console.log(ReactDrageResizeRef.current.historySteps);
  };
  const nextOperationStepHandel = () => {
    ReactDrageResizeRef.current.nextOperationStep();
  };
  const goOperationStepStepHandel = () => {
    ReactDrageResizeRef.current.goOperationStep(-2);
  };

  return (
    <AppWrapper>
      {/* 内容区 */}
      <div className="left-content">
        <ReactDragResize style={{ backgroundColor: 'pink' }} w={200} h={200} historyStepsLength={30} ref={ReactDrageResizeRef} isConflictCheck>
          操作块之后可以回退
        </ReactDragResize>
        <ReactDragResize style={{ backgroundColor: 'pink' }} w={200} h={200} historyStepsLength={30} ref={ReactDrageResizeRef} isConflictCheck>
          操作块之后可以回退
        </ReactDragResize>
      </div>
      <div className="right-toolBar">
        <button type="input" onClick={previousOperationStepHandel}>上一步</button>
        <button onClick={nextOperationStepHandel}>下一步</button>
        <button onClick={goOperationStepStepHandel}>跳到前2步</button>
      </div>
    </AppWrapper>
  );
}

export default App;
