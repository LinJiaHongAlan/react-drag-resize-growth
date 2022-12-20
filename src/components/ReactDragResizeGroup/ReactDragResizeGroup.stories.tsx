import React, { useState } from 'react';
import ReactDragResize from '../ReactDragResize/ReactDragResize';
import ReactDragResizeGroup from './ReactDragResizeGroup'

export default {
  title: 'ReactDragResize/引入组',
  component: ReactDragResizeGroup,
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
    <div style={{border: '1px solid #ccc', width: '100%', height: '100%', position: 'relative'}}>
      <ReactDragResizeGroup>
        <ReactDragResize
          comid="id1"
          style={{ backgroundColor: '#e1c0ff' }}>
            我是组成员1,我们之间只能有一个激活
        </ReactDragResize>
        <ReactDragResize
          x={300}
          y={10}
          comid="id2"
          style={{ backgroundColor: '#ffc0f1' }}>
            我是组成员2,我们之间只能有一个激活
        </ReactDragResize>
        <ReactDragResize
          comid="id3"
          x={10}
          y={300}
          style={{ backgroundColor: '#c0f6ff' }}>
            我是组成员3,我们之间只能有一个激活
        </ReactDragResize>
      </ReactDragResizeGroup>
      <ReactDragResize
          comid="id3"
          x={300}
          y={300}
          style={{ backgroundColor: 'red' }}>
            我不是组的成员，不受约束
        </ReactDragResize>
    </div>
  )
}
export const 激活状态互斥 = Template.bind({});


const Template1 = () => {
  return (
    <div style={{border: '1px solid #ccc', width: '100%', height: '100%', position: 'relative'}}>
      <ReactDragResizeGroup
        keyDirection={true}
        directionStep={1}
        shiftDirectionStep={10}>
        <ReactDragResize
          comid="id1"
          style={{ backgroundColor: '#e1c0ff' }}>
            激活状态下受键盘控制,按住shift移动距离为10
        </ReactDragResize>
        <ReactDragResize
          x={300}
          y={10}
          comid="id2"
          style={{ backgroundColor: '#ffc0f1' }}>
            激活状态下受键盘控制,按住shift移动距离为10
        </ReactDragResize>
        <ReactDragResize
          comid="id3"
          x={10}
          y={300}
          style={{ backgroundColor: '#c0f6ff' }}>
            激活状态下受键盘控制,按住shift移动距离为10
        </ReactDragResize>
      </ReactDragResizeGroup>
    </div>
  )
}
export const 键盘控制 = Template1.bind({});
