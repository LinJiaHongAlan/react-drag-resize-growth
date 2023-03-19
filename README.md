<h1 align="center">ReactDragResize</h1>

## 说明

> 说明：组件基于[vue-draggable-resizable](https://github.com/mauricius/vue-draggable-resizable)为参考借鉴，进行的 React 版本改造

部分功能使用，基于考虑略有修改，相对于原本设计上进行了部分优化,支持操作操作回溯以及，键盘操作功能 1.19 版本,已修复引入报错问题

1.2.4 版本修复 onResizestop 与 onResizing 不是组件最新的属性的问题

1.2.5 修复限制父级宽度的时候组件缩放会超出的问题，修复组件高宽以及位置改变时，位置不匹配问题

[![npm](https://img.shields.io/badge/npm-1.2.5-brightgreen)](https://www.npmjs.com/package/react-drag-resize-growth)
[![downloads](https://img.shields.io/badge/downloads-186kb-green)](https://www.npmjs.com/package/react-drag-resize-growth)

## 功能预览

[中文版演示地址](https://linjiahongalan.github.io/react-drag-resize-growth/index.html)

![](https://cdn.jsdelivr.net/gh/gorkys/CDN-Blog@master/Project/vue-draggable-resizable/demo.gif)

## 安装

```bash
npm install react-drag-resize-growth

yarn add react-drag-resize-growth
```

## 引入

```jsx
import ReactDragResize from 'react-drag-resize-growth'
;<ReactDragResize></ReactDragResize>
```

## 基本使用

**插槽**<br/>
类型: `ReactNode`<br/>必需: `false`<br/>

组件具有插槽，被插入的 ReactNode 可直接显示在拖拽物体里面

```jsx
<ReactDragResize comid="comuuid">我在里面</ReactDragResize>
```

**comid**<br/>
类型: `String`<br/>必需: `false`<br/>默认: `null`

组件的标识符唯一 id，必须为唯一值，后续逻辑处理或事件监听中可知道是哪个组件触发事件监听，若只有一个组件，通常无需传值

```jsx
<ReactDragResize comid="comuuid" />
```

**w**<br/>
类型: `Number 'auto'`<br/>必需: `false`<br/>默认: `200`<br/>
**h**<br/>
类型: `Number 'auto'`<br/>必需: `false`<br/>默认: `200`<br/>

物体的高度与宽度,传`auto`时则表示宽度为自动撑开

```jsx
<ReactDragResize h={200} w={200} />
```

**x**<br/>
类型: `Number`<br/>必需: `false`<br/>默认: `0`<br/>
**y**<br/>
类型: `Number`<br/>必需: `false`<br/>默认: `0`

物体的距离父节点左边与顶部距离

```jsx
<ReactDragResize y={200} x={200} />
```

**minw**<br/>
类型: `Number`<br/>必需: `false`<br/>默认: `0`<br/>
**minh**<br/>
类型: `Number`<br/>必需: `false`<br/>默认: `0`<br/>

物体的最小宽度与高度

```jsx
<ReactDragResize minh={10} minw={10} />
```

**maxw**<br/>
类型: `Number`<br/>必需: `false`<br/>默认: `null`<br/>
**maxh**<br/>
类型: `Number`<br/>必需: `false`<br/>默认: `null`<br/>

物体的最大宽度与高度，若传 null 则不受限制

```jsx
<ReactDragResize maxh={100} maxw={100} />
```

**dragHandle**<br/>
类型: `String`<br/>必需: `false`<br/>默认: `null`

设置拖拽物体标识，为 css 选择器，若设置则物体物体内需要具有对应的 css 标识才可拖动

```jsx
<ReactDragResize style={{ backgroundColor: 'pink' }} w={200} h={200} dragHandle=".dragBox">
  <div style={{ width: '100%', height: '20px', backgroundColor: '#009688', cursor: 'move' }} class="dragBox">
    只有点击我才可以拖拽
  </div>
</ReactDragResize>
```

**dragCancel**<br/>
类型: `String`<br/>必需: `false`<br/>默认: `null`

设置拖拽物体标识，为 css 选择器，与 dragHandle 相反若设置则物体物体内具有对应的 css 标识不可拖动

```jsx
<ReactDragResize style={{ backgroundColor: 'pink' }} w={200} h={200} dragCancel=".dragBox">
  <div style={{ width: '100%', height: '20px', backgroundColor: '#009688', cursor: 'no-drop' }} class="dragBox">
    只有点击我才可以拖拽
  </div>
</ReactDragResize>
```

**isDraggable**<br/>
类型: `Boolen`<br/>必需: `false`<br/>默认: `true`

物体是否允许拖动，`false` 不可拖动 `true` 可拖动

```jsx
<ReactDragResize style={{ backgroundColor: 'pink' }} w={200} h={200} isDraggable={false}>
  我现在不可以拖动
</ReactDragResize>
```

**isResizable**<br/>
类型: `Boolen`<br/>必需: `false`<br/>默认: `true`

物体是否允许缩放，`false` 不可缩放 `true` 可缩放

```jsx
<ReactDragResize style={{ backgroundColor: 'pink' }} w={200} h={200} isResizable={false}>
  我现在不可以缩放
</ReactDragResize>
```

**aspectRatio**<br/>
类型: `Boolen`<br/>必需: `false`<br/>默认: `false`

物体是否等比例缩放

```jsx
<ReactDragResize style={{ backgroundColor: 'pink' }} w={50} h={50} aspectRatio={true}>
  我现在是等比例缩放
</ReactDragResize>
```

**parentScaleX**<br/>
类型: `Number`<br/>必需: `false`<br/>默认: `1`<br/>
**parentScaleY**<br/>
类型: `Number`<br/>必需: `false`<br/>默认: `1`<br/>

物体拖动以及缩放的比例因子，值为则鼠标移动与物体缩放成正比,若因子`X`小于 1 则物体速度为`1/X`,既速度为 2 倍,手柄大小也会为 2 倍

```jsx
<ReactDragResize style={{ backgroundColor: 'pink' }} parentScaleX={0.5} parentScaleX={0.5} aspectRatio={true}>
  速度为2倍
</ReactDragResize>
```

**stickSize**<br/>
类型: `Number`<br/>必需: `false`<br/>默认: `8`<br/>

手柄大小基数，受 parentScale[X/Y]影响

```jsx
<ReactDragResize style={{ backgroundColor: 'pink' }} stickSize={16} aspectRatio={true}>
  放大手柄大小
</ReactDragResize>
```

**classNameStick**<br/>
类型: `String`<br/>必需: `false`<br/>默认: `空`<br/>

自定义手柄 className 名，当需要自定义样式的时候使用

```jsx
<ReactDragResize style={{ backgroundColor: 'pink' }} classNameStick="diyclass" aspectRatio={true}>
  手柄颜色变了
</ReactDragResize>
```

```css
.diyclass {
  background: red;
}
```

**stickSlot**<br/>
类型:

```txt
{
  tl: ReactNode,
  tm: ReactNode,
  tr: ReactNode,
  mr: ReactNode,
  br: ReactNode,
  bm: ReactNode,
  bl: ReactNode,
  ml: ReactNode
}
```

<br/>必需: `false`<br/>默认: `{}`<br/>

手柄插槽，当需要往手柄 dom 里自定义物体的时候使用

```jsx
<ReactDragResize style={{ backgroundColor: 'pink' }} classNameStick="diyclass" stickSlot={{ tm: <div>上边</div> }}>
  手柄多了一个字
</ReactDragResize>
```

**sticks**<br/>
类型: `Array`<br/>必需: `false`<br/>默认: `['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']`<br/>

需要显示的手柄，默认全展示，当手动传入的时候则只显示传入的手柄标识

```jsx
<ReactDragResize style={{ backgroundColor: 'pink' }} sticks={['br']} classNameStick="diyclass" aspectRatio={true}>
  只可以拖动右下角
</ReactDragResize>
```

**axis**<br/>
类型: `String`<br/>必需: `false`<br/>可选值: `x` `y` `none` `both`<br/>默认：`both`<br/>

传入`x`或`y`时，则物体只允许 x 轴或 y 轴移动,`both`则两边都可移动,`none`则不可移动,但不影响缩放

```jsx
<ReactDragResize style={{ backgroundColor: 'pink' }} axis="x" classNameStick="diyclass" aspectRatio={true}>
  只可以拖动右下角
</ReactDragResize>
```

## 事件

**onClicBodyDown**<br/>
类型: `Function`<br/>必需: `false`<br/>默认: `null`<br/>
**onDeselect**<br/>
类型: `Function`<br/>必需: `false`<br/>默认: `null`<br/>

点击物体内部与外部事件监听

```jsx
const clicBodyDownHandel = ({ comid, ev }) => {
  console.log('我点击了里面了', comid, ev)
}
const onDeselectHandel = ({ comid, ev }) => {
  console.log('我点击了外面了', comid, ev)
}

;<ReactDragResize style={{ backgroundColor: 'pink' }} comid="comuuid" w={200} h={200} onDeselect={onDeselectHandel} onClicBodyDown={clicBodyDownHandel}>
  请点击我
</ReactDragResize>
```

**onDragging**<br/>
类型: `Function`<br/>必需: `false`<br/>默认: `null`<br/>
**onDragstop**<br/>
类型: `Function`<br/>必需: `false`<br/>默认: `null`<br/>

拖动物体，以及拖动物体停止的事件回调<br/>
返参
`comid` 标识唯一 id
`beforeMove`开始位置信息
`curMove`当前位置信息

```jsx
const onDraggingHandel = ({ comid, beforeMove, curMove }) => {
  console.log('我在拖拽', comid, beforeMove, curMove)
}

const onDragstopHandel = ({ comid, beforeMove, curMove }) => {
  console.log('拖拽结束', comid, beforeMove, curMove)
}

;<ReactDragResize style={{ backgroundColor: 'pink' }} comid="comuuid" w={200} h={200} onDragstop={onDragstopHandel} onDragging={onDraggingHandel}>
  请拖动我
</ReactDragResize>
```

**onResizing**<br/>
类型: `Function`<br/>必需: `false`<br/>默认: `null`<br/>
**onResizestop**<br/>
类型: `Function`<br/>必需: `false`<br/>默认: `null`<br/>

缩放物体，以及缩放物体停止的事件回调<br/>
返参
`comid` 标识唯一 id
`beforeMove`开始位置信息
`curMove`当前位置信息

```jsx
const onResizingHandel = ({ comid, beforeMove, curMove }) => {
  console.log('我在缩放', comid, beforeMove, curMove)
}

const onResizestopHandel = ({ comid, beforeMove, curMove }) => {
  console.log('拖拽缩放', comid, beforeMove, curMove)
}

;<ReactDragResize style={{ backgroundColor: 'pink' }} comid="comuuid" w={200} h={200} onResizestop={onResizestopHandel} onResizing={onResizingHandel}>
  请点击手柄进行缩放
</ReactDragResize>
```

组件是否为激活状态, 默认为`null`,当为`null`的时候组件激活状态则是非受控状态,若希望激活状态为受控则需传入对于的`true 或 false`
<br/>**内部提供事件监听**<br/>
`onClicBodyDown`点击物体内部<br/>
`onDeselect`: 点击物体外部<br/>
如果希望根据自己已有的逻辑来手动控制激活转态，则可以根据事件监听来做相应的处理,以达到更灵活的程度

```jsx
<ReactDragResize style={{ backgroundColor: 'pink' }} w={200} h={200} isActive={true}>
  我现在一直处于激活状态
</ReactDragResize>
```

## 父级

**parentW**<br/>
类型: `Number`<br/>必需: `false`<br/>默认: `null`<br/>限制：`必须大于 0 或 null`<br/>
**parentH**<br/>
类型: `Number`<br/>必需: `false`<br/>默认: `null`<br/>限制：`必须大于 0 或 null`<br/>

物体父级的宽度与高度，若不传则自动获取父级 dom 元素宽度

```jsx
<ReactDragResize parentH={800} parentW={800} />
```

**snapToGrid**<br/>
类型: `Boolen`<br/>必需: `false`<br/>默认: `false`<br/>
**gridX**<br/>
类型: `Number`<br/>必需: `false`<br/>默认: `50`<br/>
**gridY**<br/>
类型: `Number`<br/>必需: `false`<br/>默认: `50`<br/>

`snapToGrid`是否开启是否开启父级限制拖拽距离,若开启则标识物体拖动最小单位会根据` gridX``gridY `来移动

```jsx
// 我最少会移动50px
<ReactDragResize snapToGrid={true} gridX={50} parentW={50} />
```

**parentLimitation**<br/>
类型: `Boolen`<br/>必需: `false`<br/>默认: `false`<br/>

将拖拽物体限制在父级盒子里面高宽里面

```jsx
// 我离不开父级范围
<ReactDragResize parentH={800} parentW={800} parentLimitation={true} />
```

## 高级使用

**isActive**<br/>
类型: `Boolen`<br/>必需: `false`<br/>默认: `null`

组件是否为激活状态, 默认为`null`,当为`null`的时候组件激活状态则是非受控状态,若希望激活状态为受控则需传入对于的`true 或 false`
<br/>**内部提供事件监听**<br/>
`onClicBodyDown`点击物体里面<br/>
`onDeselect`: 点击物体外部<br/>
如果希望根据自己已有的逻辑来手动控制激活转态，则可以根据事件监听来做相应的处理,以达到更灵活的程度

```jsx
<ReactDragResize style={{ backgroundColor: 'pink' }} w={200} h={200} isActive={true}>
  我现在一直处于激活状态
</ReactDragResize>
```

**isConflictCheck**<br/>
类型: `Boolen`<br/>必需: `false`<br/>默认: `false`

冲突检测，若开启冲突检测的目标物体，相互之间不能重叠

```jsx
<ReactDragResize style={{backgroundColor: 'pink'}} w={100} h={100} isConflictCheck={true}>
  我们无法重叠
</ReactDragResize>

<ReactDragResize style={{backgroundColor: 'green'}} x={150} y={150} w={100} h={100} isConflictCheck={true}>
  我们无法重叠
</ReactDragResize>
```

**historyStepsLength**<br/>
类型: `Number`<br/>必需: `false`<br/>默认: `0`<br/>
**ref-previousOperationStep**<br/>
类型: `Function`返回上一步位置<br/>
**ref-nextOperationStep**<br/>
类型: `Function`返回下一步位置<br/>
**ref-goOperationStep**<br/>
类型: `Function`去往第步位置<br/>
**ref-historySteps**<br/>
类型: `Array`历史步数记录信息<br/>

历史记录长度，目标物体会开启一个记录，将物体移动过的地方做一个记录`historyStepsLength`越大则记录的步数越多<br/>
组件内部会提供对应方法<br/>

```jsx
import { useRef } from 'react';

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

<button onClick={previousOperationStepHandel}>上一步</button>
<button onClick={nextOperationStepHandel}>下一步</button>
<button onClick={goOperationStepStepHandel}>跳到前2步</button>
<button onClick={getHistoryStepsHandel}>获取信息</button>

<ReactDragResize style={{backgroundColor: 'pink'}} w={200} h={200} historyStepsLength={30} ref={ReactDrageResizeRef} isConflictCheck={true}>
操作块之后可以回退
</ReactDragResize>
```

## 组（Group）的使用

ReactDragResize 组件可以在外层包裹一层`Group`，包裹后则可以使用组的功能，激活状态`active`则不再受自身影响，而受`Group`的控制,在`Group`激活转态只会存在一个<br/>

```jsx
<ReactDragResize.Group>
  <ReactDragResize style={{ backgroundColor: 'pink' }} w={200} h={200} isConflictCheck>
    我们是一个组
  </ReactDragResize>

  <ReactDragResize style={{ backgroundColor: 'pink' }} w={200} h={200} x={300} y={300} isConflictCheck>
    我们是一个组
  </ReactDragResize>
  <ReactDragResize style={{ backgroundColor: 'pink' }} w={200} h={200} x={300} y={300} isConflictCheck>
    我们是一个组
  </ReactDragResize>
</ReactDragResize.Group>
```

**defaultActive**<br/>

在组内支持，默认激活，defaultActive 与 comid 一致时候则激活

```jsx
<ReactDragResize.Group defaultActive="1">
  <ReactDragResize comid="1" style={{ backgroundColor: 'pink' }} w={200} h={200} isConflictCheck>
    我们是一个组,并且我是默认激活的那个
  </ReactDragResize>
  <ReactDragResize comid="2" style={{ backgroundColor: 'pink' }} w={200} h={200} x={300} y={300} isConflictCheck>
    我们是一个组
  </ReactDragResize>
</ReactDragResize.Group>
```

## 键盘控制 2022.11.26 新增

**keyDirection**<br/>
类型: `String 或 Boolen`<br/>必需: `false`<br/>默认: `null`<br/>
**directionStep**<br/>
类型: `String 或 Boolen`<br/>必需: `false`<br/>默认: `null`<br/>
**shiftDirectionStep**<br/>
类型: `String 或 Boolen`<br/>必需: `false`<br/>默认: `null`<br/>

keyDirection 为为`null`的时候则不开启，若为 true 的时候，则激活状态会受键盘控制，若为字符串则与 comid 一致时受键盘控制
键盘控制方法为方向键 “←”，“→”，“↑”，“↓” 或者是 `shift` + “←”，“→”，“↑”，“↓”
默认移动距离为 1px，按住`shift`为 10px,可通过`directionStep` `shiftDirectionStep` 修改对应的步数

**单个组件**<br/>
keyDirection 为`null`的时候则不开启,若为 true 的时候，则激活状态会受键盘控制

```jsx
<ReactDragResize
  keyDirection={true}
  directionStep={1}
  shiftDirectionStep={10}
  style={{ backgroundColor: 'pink' }}
  w={200}
  h={200}
  x={300}
  y={300}
  isConflictCheck
>
  开启键盘移动,按住shift可移动10px
</ReactDragResize>
```

**使用组包裹**<br/>

```jsx
<ReactDragResize.Group keyDirection={true} directionStep={1} shiftDirectionStep={10}>
  <ReactDragResize comid="1" style={{ backgroundColor: 'pink' }} w={200} h={200} isConflictCheck>
    谁被激活，谁受控制
  </ReactDragResize>
  <ReactDragResize comid="2" style={{ backgroundColor: 'pink' }} w={200} h={200} x={300} y={300} isConflictCheck>
    谁被激活，谁受控制
  </ReactDragResize>
</ReactDragResize.Group>
```

```jsx
<ReactDragResize.Group keyDirection="1" directionStep={1} shiftDirectionStep={10}>
  <ReactDragResize comid="1" style={{ backgroundColor: 'pink' }} w={200} h={200} isConflictCheck>
    我是被控制的那个
  </ReactDragResize>
  <ReactDragResize comid="2" style={{ backgroundColor: 'pink' }} w={200} h={200} x={300} y={300} isConflictCheck>
    我不是被控制的那个
  </ReactDragResize>
</ReactDragResize.Group>
```
