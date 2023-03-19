import React, { useState, useRef } from 'react';
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
    <div style={{width: '100%', height: '100%', position: 'relative', display: 'flex'}}>
      <div style={{width: 'calc(100% - 100px)', height: '100%', border: '1px solid #ccc'}}>
        <ReactDragResize
          comid="id1"
          style={{backgroundColor: resizeing ? 'red' : 'pink'}}
          onResizestop={onResizestopHandel}
          onResizing={onResizingHandel}>
            {resizeing ? '缩放中' : '请点击我缩放'}
        </ReactDragResize>
      </div>
      <div style={{width: '100px', height: '100%'}}>
      </div>
    </div>
  )
}
export const 物体缩放监听 = Template3.bind({});



const Template4 = () => {
  const [width, setWidth] = useState(200)
  const [height, setHeight] = useState(200)
  const [left, setLeft] = useState(20)
  const [top, setTop] = useState(20)


  const onResizingHandel = ({ comid, beforeMove, curMove }) => {
    setWidth(curMove.width)
    setHeight(curMove.height)
    setTop(curMove.top)
    setLeft(curMove.left)
  }

  const onDraggingHandel = ({ comid, beforeMove, curMove }) => {
    setWidth(curMove.width)
    setHeight(curMove.height)
    setTop(curMove.top)
    setLeft(curMove.left)
  }

  const setWidthHandel = (width: number) => {
    setWidth(width)
  }
  const setHeightHandel = (height: number) => {
    setHeight(height)
  }
  const setTopHandel = (top: number) => {
    setTop(top)
  }

  const setLeftHandel = (left: number) => {
    setLeft(left)
  }

  return (
    <div style={{width: '100%', height: '100%', position: 'relative', display: 'flex'}}>
      <div style={{width: 'calc(100% - 180px)', height: '100%', border: '1px solid #ccc'}}>
        <ReactDragResize
          comid="id1"
          style={{backgroundColor: 'pink'}}
          w={width}
          h={height}
          x={left}
          y={top}
          onDragging={onDraggingHandel}
          onResizing={onResizingHandel}>
        </ReactDragResize>
      </div>
      <div style={{width: '180px', padding: '20px', height: '100%'}}>
        <div style={{marginBottom: '10px'}}>
          w:
          <input value={width} onChange={(e) => { setWidthHandel(e.target.value) }} type="text" />
        </div>
        <div style={{marginBottom: '10px'}}>
          h:
          <input onChange={(e) => { setHeightHandel(e.target.value) }} value={height} type="text" />
        </div>
        <div style={{marginBottom: '10px'}}>
          x:
          <input onChange={(e) => { setLeftHandel(e.target.value) }} value={left} type="text" />
        </div>
        <div style={{marginBottom: '10px'}}>
          y:
          <input onChange={(e) => { setTopHandel(e.target.value) }} value={top} type="text" />
        </div>
      </div>
    </div>
  )
}
export const 外部改变高宽位置 = Template4.bind({});
