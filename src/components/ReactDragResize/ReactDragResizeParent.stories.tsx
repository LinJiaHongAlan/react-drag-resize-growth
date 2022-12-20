import React, { useRef } from 'react';
import ReactDragResize from './ReactDragResize';

export default {
  title: 'ReactDragResize/父级',
  decorators: [
    (Story) => (
      <div style={{ height: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

const Template = () => {
  return (
    <div style={{border: '1px solid #ccc', width: '400px', height: '500px', position: 'relative'}}>
      <ReactDragResize
        parentLimitation={true}
        comid="id1"
        style={{ backgroundColor: 'pink' }}>
          我出不去
      </ReactDragResize>
    </div>
  )
}
export const 限制盒子拖动范围 = Template.bind({});

const Template2 = () => {
  return (
    <div style={{border: '1px solid #ccc', width: '100%', height: '100%', position: 'relative'}}>
      <ReactDragResize
        snapToGrid={true}
        parentLimitation={true}
        gridX={20}
        gridY={20}
        comid="id1"
        style={{ backgroundColor: 'pink' }}>
          我只能按20 * 20移动
      </ReactDragResize>
    </div>
  )
}
export const 限制拖动的最小距离 = Template2.bind({});


const Template3 = () => {
  return (
    <div style={{border: '1px solid #ccc', width: '100%', height: '100%', position: 'relative'}}>
      <ReactDragResize
        isConflictCheck={true}
        comid="id1"
        style={{ backgroundColor: 'pink' }}>
          我只能按20 * 20移动
      </ReactDragResize>
      <ReactDragResize
        comid="id2"
        x={200}
        y={200}
        isConflictCheck={true}
        style={{ backgroundColor: 'pink' }}>
          我只能按20 * 20移动
      </ReactDragResize>
    </div>
  )
}
export const 冲突检测 = Template3.bind({});


const Template4 = () => {
  const ReactDrageResizeRef = useRef();

  const previousOperationStepHandel = () =>{
    ReactDrageResizeRef.current.previousOperationStep()
  }
  const nextOperationStepHandel = () =>{
    ReactDrageResizeRef.current.nextOperationStep()
  }
  const goOperationStepStepHandel = () =>{
    ReactDrageResizeRef.current.goOperationStep(-2)
  }
  const getHistoryStepsHandel = () =>{
    console.log(ReactDrageResizeRef.current.historySteps)
  }


  return (
    <div style={{width: '100%', height: '100%', position: 'relative', display: 'flex'}}>
      <div style={{width: 'calc(100% - 100px)', height: '100%', border: '1px solid #ccc'}}>
        <ReactDragResize
          ref={ReactDrageResizeRef}
          comid="id1"
          historyStepsLength={30}
          style={{ backgroundColor: 'pink' }}>
            我只能按20 * 20移动
        </ReactDragResize>
      </div>
      <div style={{width: '100px', height: '100%'}}>
        <button onClick={previousOperationStepHandel}>上一步</button>
        <button onClick={nextOperationStepHandel}>下一步</button>
        <button onClick={goOperationStepStepHandel}>跳到前2步</button>
        <button onClick={getHistoryStepsHandel}>获取信息</button>
      </div>
    </div>
  )
}
export const 历史回退 = Template4.bind({});
