import React from 'react';
import ReactDragResize from './ReactDragResize';

export default {
  title: 'ReactDragResize/基本使用',
  component: ReactDragResize,
  decorators: [
    (Story) => (
      <div style={{ height: '200px' }}>
        <Story />
      </div>
    ),
  ],
};

const Template = () => (
  <ReactDragResize  style={{ backgroundColor: 'pink' }}>我的第一个基本使用</ReactDragResize>
)
export const 第一个案例 = Template.bind({});

const Template1 = () => (
  <ReactDragResize isDraggable={false} style={{ backgroundColor: 'pink' }}>禁止拖动</ReactDragResize>
)
export const 禁止拖动 = Template1.bind({});

const Template2 = () => (
  <ReactDragResize isResizable={false} style={{ backgroundColor: 'pink' }}>禁止缩放</ReactDragResize>
)
export const 禁止缩放 = Template2.bind({});

const Template3 = () => (
  <ReactDragResize
    x={10}
    y={20}
    parentScaleX={2}
    parentScaleY={2}
    style={{ backgroundColor: 'pink' }}>
    速度会变为1/2,手柄也会受影响
  </ReactDragResize>
)
export const 比例因子 = Template3.bind({});


const Template4 = () => (
  <ReactDragResize
    x={10}
    y={20}
    stickSize={16}
    style={{ backgroundColor: 'pink' }}>
    手柄大小,会变成16 * 16
  </ReactDragResize>
)
export const 手柄大小 = Template4.bind({});

const Template5 = () => (
  <ReactDragResize
    x={10}
    y={20}
    sticks={['tl', 'tm', 'tr', 'mr']}
    style={{ backgroundColor: 'pink' }}>
    只显示部分手柄
  </ReactDragResize>
)
export const 手柄显示 = Template5.bind({});

const Template6 = () => (
  <>
    <ReactDragResize
      x={10}
      y={20}
      axis="x"
      sticks={['tl', 'tm', 'tr', 'mr']}
      style={{ backgroundColor: '#c0c2ff' }}>
      允许x轴方向拖动
    </ReactDragResize>
    <ReactDragResize
      x={250}
      y={10}
      axis="y"
      sticks={['tl', 'tm', 'tr', 'mr']}
      style={{ backgroundColor: '#c0fff3' }}>
      允许y轴方向拖动
    </ReactDragResize>
    <ReactDragResize
      x={500}
      y={10}
      axis="none"
      sticks={['tl', 'tm', 'tr', 'mr']}
      style={{ backgroundColor: '#ffe9c0' }}>
      两边都不允许拖动
    </ReactDragResize>
  </>
)
export const 允许部分控制 = Template6.bind({});
