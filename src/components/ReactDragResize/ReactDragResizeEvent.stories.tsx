import React, { useState } from 'react';
import ReactDragResize from './ReactDragResize';

export default {
  title: 'ReactDragResize/事件',
  decorators: [
    (Story) => (
      <div style={{ height: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

const Template = () => {
  const clicBodyDownHandel = ({ comid, ev }: { comid: string, ev: MouseEvent }) => {
    console.log('我点击了里面了', comid, ev)
  }
  const onDeselectHandel = ({ comid, ev }: { comid: string, ev: MouseEvent }) => {
    console.log('我点击了外面了', comid, ev)
  }

  return (
    <ReactDragResize
      comid="id1"
      onDeselect={onDeselectHandel}
      onClicBodyDown={clicBodyDownHandel}
      style={{ backgroundColor: 'pink' }}>
        请点击我
    </ReactDragResize>
  )
}
export const 点击物体内部与外部事件监听 = Template.bind({});

const Template2 = () => {
  const [draging, setDraging] = useState(false)
  const onDraggingHandel = ({ comid, beforeMove, curMove }) => {
    console.log('拖拽监听', comid, beforeMove, curMove)
    setDraging(true)
  }

  const onDragstopHandel = ({ comid, beforeMove, curMove }) => {
    console.log('拖拽结束监听', comid, beforeMove, curMove)
    setDraging(false)
  }

  return (
    <ReactDragResize
      comid="id1"
      style={{backgroundColor: draging ? 'red' : 'pink'}}
      onDragstop={onDragstopHandel}
      onDragging={onDraggingHandel}>
        {draging ? '拖拽中' : '请点击我拖拽'}
    </ReactDragResize>
  )
}
export const 物体拖拽监听 = Template2.bind({});

const Template3 = () => {
  const [resizeing, setResizeing] = useState(false)
  const onResizingHandel = ({ comid, beforeMove, curMove }) => {
    console.log('缩放监听', comid, beforeMove, curMove)
    setResizeing(true)
  }

  const onResizestopHandel = ({ comid, beforeMove, curMove }) => {
    console.log('缩放结束监听', comid, beforeMove, curMove)
    setResizeing(false)
  }

  return (
    <ReactDragResize
      comid="id1"
      style={{backgroundColor: resizeing ? 'red' : 'pink'}}
      onResizestop={onResizestopHandel}
      onResizing={onResizingHandel}>
        {resizeing ? '缩放中' : '请点击我缩放'}
    </ReactDragResize>
  )
}
export const 物体缩放监听 = Template3.bind({});
