import React, { memo, useState, useEffect, useCallback, useMemo, useRef, forwardRef, useImperativeHandle, useContext, FC } from 'react'
import classnames from 'classnames'
import PropTypes, { number } from 'prop-types'
import ReactDragResizeGroup, { ReactDragResizeContext } from '../ReactDragResizeGroup/ReactDragResizeGroup'
import { ReactDragResizeWrapper } from './style'
import { usekeyDirection } from '../hooks/usekeyDirection'
import { useSyncState } from '../../hooks/useSyncState'
import { useConflictCheck } from './hooks/useConflictCheck'
import { useHistorySteps } from './hooks/useHistorySteps'
import useWatch from '../../hooks/useWatch'

function addEvents (events: Map<string, (ev: any) => void>) {
  events.forEach((cb, eventName) => {
    document.documentElement.addEventListener(eventName, cb)
  })
}

function removeEvents (events: Map<string, (ev: any) => void>) {
  events.forEach((cb, eventName) => {
    document.documentElement.removeEventListener(eventName, cb)
  })
}

const styleMapping = {
  y: {
    t: 'top',
    m: 'marginTop',
    b: 'bottom'
  },
  x: {
    l: 'left',
    m: 'marginLeft',
    r: 'right'
  }
}

const sticks = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'] as const

interface ReactDragResizeProps {
  ref?: any,
  /**
   * 基本使用-插槽
   */
  children?: any,
  /**
   * 原生id
   */
  id?: string,
  /**
   * 标识id
   */
  comid?: string,
  /**
   * 手柄大小
   */
  stickSize?: number,
  /**
   * 横向比例因子
   */
  parentScaleX?: number,
  /**
   * 纵向比例因子
   */
  parentScaleY?: number,
  /**
   * 是否处于激活状态
   */
  isActive?: boolean,
  /**
   * 组件是否应可拖动
   */
  isDraggable?: boolean,

  /**
   * 是否允许缩放
   */
  isResizable?: boolean,

  /**
   * 组件是否应保持其比例
   */
  aspectRatio?: boolean,
  /**
   * 限制为其父大小
   */
  parentLimitation?: boolean,
  /**
   * 是否开启父级限制拖拽步数
   */
  snapToGrid?: boolean,
  /**
   * 移动步数
   */
  gridX?: number,
  /**
   * 移动步数
   */
  gridY?: number,
  /**
   * 父级宽度
   */
  parentW?: number,
  /**
   * 父级宽度
   */
  parentH?: number,

  /**
   * 受控宽度
   */
  w: number | string,
  /**
   * 受控高度
   */
  h: number | string,
  /**
   * 最小宽度
   */
  minw?: number,
  /**
   * 最小高度
   */
  minh?: number,
  /**
   * 最大宽度
   */
  maxw?: number | null,
  /**
   * 最大高度
   */
  maxh?: number | null,
  /**
   * 距离左边距离
   */
  x?: number,
  /**
   * 距离上边距离
   */
  y?: number,
  /**
   * 层级
   */
  z?: string,
  /**
   * 允许拖拽物体标识
   */
  dragHandle?: string,
  /**
   * 不允许拖拽物体标识
   */
  dragCancel?: string,
  /**
   * 手柄
   */
  sticks?: typeof sticks[number][],
  /**
   * 手柄class类名
   */
  classNameStick?: string | null,
  /**
   * 手柄插槽
   */
  stickSlot?: Partial<Record<typeof sticks[number], string>>,
  /**
   * 允许拖拽方向
   */
  axis?: 'x' | 'y' | 'both' | 'none',
  /**
   * 原生class
   */
  class?: string,
  /**
   * 原生style
   */
  style?: {[name: string]: string},
  /**
   * 冲突检测
   */
  isConflictCheck?: boolean,
  /**
   * 按下拖拽物事件
   */
  onClicBodyDown?: ((comid: string | undefined, ev: MouseEvent | TouchEvent) => any),
  /**
   * 按下拖拽物外边事件
   */
  onDeselect?: (({ comid, ev }: { comid?: string | null, ev: MouseEvent }) => void) | null,
  /**
   * 操作步数存储长度
   */
  historyStepsLength?: number,
  /**
   * 拖拽中事件
   */
  onDragging?: (() => any),
  /**
   * 拖拽结束事件
   */
  onDragstop?: (() => any) | null,
  /**
   * 缩放中事件
   */
  onResizing?: (() => any) | null,
  /**
   * 缩放结束事件
   */
  onResizestop?: (() => any) | null,
  /**
   * 鼠标控制步数
   */
  directionStep?: number,
  /**
   * 按住shift按键时，鼠标控制步数
   */
  shiftDirectionStep?: number,
  /**
   * 开启键盘方向
   */
  keyDirection?: boolean | null
}

const ReactDragResize: FC<ReactDragResizeProps> = memo(
  forwardRef((props, ref) => {
    const container = useRef()
    const rootRef = useRef()

    // 初始化数据
    const [, , _uid] = useSyncState(Math.random().toString(36).substr(3, 10))
    const [, setStickDrag, stickDragSync] = useSyncState(false, false)
    const [, setBodyDrag, bodyDragSync] = useSyncState(false, false)
    const [, setDimensionsBeforeMove, dimensionsBeforeMoveSync] = useSyncState(
      {
        pointerX: 0,
        pointerY: 0,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        heihgt: 0
      },
      false
    )
    const [aspectFactor, setAspectFactor] = useState(1)
    const [limits, setLimits] = useState({
      left: { min: null, max: null },
      right: { min: null, max: null },
      top: { min: null, max: null },
      bottom: { min: null, max: null }
    })
    // 记录操作对象的dom
    const [isOperation, setIsOperation] = useSyncState(null)
    const [, setCurrentStick, currentStickSync] = useSyncState(null, false)
    const [active, setActive, activeSync] = useSyncState(null)
    const [zIndex, setZindex] = useState(null)
    const [parentWidth, setParentWidth, setParentWidthSync] = useSyncState(null)
    const [parentHeight, setParentHeight, parentHeightSync] = useSyncState(null)
    const [left, setLeft, leftSync] = useSyncState(null)
    const [top, setTop, topSync] = useSyncState(null)
    const [right, setRight, rightSync] = useSyncState(null)
    const [bottom, setBottom, bottomSync] = useSyncState(null)

    const { recordHistorySteps, recordCurrentSteps, getHistorySteps, historyStepsSync, setCurStep, curStepSync } =
      useHistorySteps(props.historyStepsLength)

    const setPosition = ({ top, left, right, bottom }: { top: number, left: number, right: number, bottom: number }) => {
      // 如果高宽小于0则不让操作
      if (parentHeightSync.current - bottom - top <= 1 || setParentWidthSync.current - right - left <= 1) {
        return
      }
      // 如果有开启父级限制范围，则需判断是否超出
      if (props.parentLimitation === true) {
        if (top < 0 || left < 0 || right < 0 || bottom < 0) {
          return
        }
      }
      setTop(top)
      setLeft(left)
      setRight(right)
      setBottom(bottom)
    }

    const operationStepsHandel = (step: number) => {
      const historyOperationSteps = getHistorySteps(step)
      if (historyOperationSteps !== null) {
        setPosition({
          top: historyOperationSteps.top,
          left: historyOperationSteps.left,
          right: historyOperationSteps.right,
          bottom: historyOperationSteps.bottom
        })
        setCurStep(step)
        return { status: 'success' }
      }
      return { status: 'last' }
    }

    useImperativeHandle(ref, () => ({
      // 返回上一步
      previousOperationStep () {
        const previousStep = curStepSync.current - 1
        const result = operationStepsHandel(previousStep)
        return result
      },
      nextOperationStep () {
        if (curStepSync.current === 0) {
          return { status: 'first' }
        }
        const nextStep = curStepSync.current + 1
        const result = operationStepsHandel(nextStep)
        return result
      },
      goOperationStep (step: number) {
        const result = operationStepsHandel(step)
        return result
      },
      historySteps: historyStepsSync
    }))

    const { conflictCheck } = useConflictCheck({
      isConflictCheck: props.isConflictCheck,
      rootRef
    })

    const reactDragResizeContext = useContext(ReactDragResizeContext)

    type directionType = 'top' | 'left' | 'right' | 'bottom'

    // 注册键盘时间
    usekeyDirection({
      // 如果在组里，则注册
      register: !reactDragResizeContext && !(props.keyDirection === null || props.keyDirection === false),
      directionStep: props.directionStep,
      shiftDirectionStep: props.shiftDirectionStep,
      keyDownDirectionHandel: ({ direction, step, altKey, getNewPosition }) => {
        if (activeSync.current === true) {
          const { top: newTop, left: newLeft, right: newRight, bottom: newBottom } = getNewPosition({
              direction,
              step,
              altKey,
              curPosition: {
                top: topSync.current,
                left: leftSync.current,
                right: rightSync.current,
                bottom: bottomSync.current
              }
            })
            setPosition({
              top: newTop,
              left: newLeft,
              right: newRight,
              bottom: newBottom
            })
          }
        }
    })

    // 添加watch监听
    useWatch(props.w, (newVal: number, oldVal: number) => {
      if (stickDragSync.current || bodyDragSync.current || newVal === width) {
        return
      }
      const stick = 'mr'
      const delta = oldVal - newVal
      stickDown(stick, { pageX: right, pageY: top + height / 2 }, true)
      stickMove({ x: delta, y: 0 })
      stickUp()
    })
    useWatch(props.h, (newVal: number, oldVal: number) => {
      if (stickDragSync.current || bodyDragSync.current || newVal === height) {
        return
      }
      const stick = 'bm'
      const delta = oldVal - newVal
      stickDown(stick, { pageX: left + width / 2, pageY: bottom }, true)
      stickMove({ x: 0, y: delta })
      stickUp()
    })
    useWatch(props.y, (newVal: number, oldVal: number) => {
      if (stickDragSync.current || bodyDragSync.current || newVal === top) {
        return
      }
      const delta = oldVal - newVal
      bodyDown({ pageX: left, pageY: top })
      bodyMove({ x: 0, y: delta })
      bodyUp()
    })
    useWatch(props.x, (newVal: number, oldVal: number) => {
      if (stickDragSync.current || bodyDragSync.current || newVal === left) {
        return
      }
      const delta = oldVal - newVal
      bodyDown({ pageX: left, pageY: top })
      bodyMove({ x: delta, y: 0 })
      bodyUp()
    })
    useWatch(
      props.z,
      (newVal) => {
        if (newVal >= 0 || newVal === 'auto') {
          setZindex(newVal)
        }
      },
      { immediate: true }
    )
    useWatch(
      props.isActive,
      (newVal) => {
        if (!reactDragResizeContext) {
          // 只有当不存在组里面的时候才是受控的
          setActive(newVal)
        }
      },
      { immediate: true }
    )
    useWatch(props.parentW, (newVal: number) => {
      setRight(newVal - width - left)
      setParentWidth(newVal)
    })
    useWatch(props.parentH, (newVal: number) => {
      setBottom(newVal - height - top)
      setParentHeight(newVal)
    })

    // 初始化父级高宽，盒子位置信息
    useEffect(() => {
      const parentElement = rootRef.current.parentNode
      const newParentWidth = props.parentW ? props.parentW : parentElement.clientWidth
      const newParentHeight = props.parentH ? props.parentH : parentElement.clientHeight
      const newLeft = props.x
      const newTop = props.y
      setParentWidth(newParentWidth)
      setParentHeight(newParentHeight)
      setLeft(newLeft)
      setTop(newTop)
      setRight(newParentWidth - (props.w === 'auto' ? parentElement.scrollWidth : props.w) - newLeft)
      setBottom(newParentHeight - (props.h === 'auto' ? parentElement.scrollHeight : props.h) - newTop)
      if (props.dragHandle) {
        ;[...parentElement.querySelectorAll(props.dragHandle)].forEach((dragHandle) => {
          dragHandle.setAttribute('data-drag-handle', _uid)
        })
      }
      if (props.dragCancel) {
        ;[...parentElement.querySelectorAll(props.dragCancel)].forEach((cancelHandle) => {
          cancelHandle.setAttribute('data-drag-cancel', _uid)
        })
      }
    }, [])

    // 注册在组里面
    useEffect(() => {
      reactDragResizeContext?.registerDragResize(_uid.current, {
        setActive,
        activeSync,
        comid: props.comid,
        getCurPosition: () => {
          return {
            left: leftSync.current,
            right: rightSync.current,
            top: topSync.current,
            bottom: bottomSync.current
          }
        },
        setPosition
      })
      return () => {
        reactDragResizeContext?.unregisterDragResize(_uid.current)
      }
    }, [])

    // 添加document事件
    useEffect(() => {
      const domEvents = new Map([
        ['mousemove', move],
        ['mouseup', up],
        ['mouseleave', up],
        ['mousedown', deselect],
        ['touchmove', move],
        ['touchend', up],
        ['touchcancel', up],
        ['touchstart', up]
      ])
      addEvents(domEvents)
      return () => {
        removeEvents(domEvents)
      }
    }, [move, up, deselect])

    const rdrStick = useCallback(
      (stick: string) => {
        const { stickSize, parentScaleX, parentScaleY } = props
        const stickStyle: { [name: string]: string } = {
          width: `${(stickSize as number) / (parentScaleX as number)}px`,
          height: `${stickSize as number / (parentScaleY as number)}px`
        }
        stickStyle[styleMapping.y[stick[0] as keyof typeof styleMapping.y]] = `${(stickSize as number) / (parentScaleX as number) / -2}px`
        stickStyle[styleMapping.x[stick[1] as keyof typeof styleMapping.x]] = `${(stickSize as number) / (parentScaleX as number) / -2}px`
        return stickStyle
      },
      [props.stickSize, props.parentScaleX, props.parentScaleY]
    )

    const positionStyle = useMemo(
      () => ({
        top: `${top}px`,
        left: `${left}px`,
        zIndex
      }),
      [top, left, zIndex]
    )

    const width = useMemo(() => parentWidth - left - right, [parentWidth, left, right])

    const height = useMemo(() => parentHeight - top - bottom, [parentWidth, top, bottom])

    const sizeStyle = useMemo(
      () => ({
        width: (props.w as number).toString() === 'auto' ? 'auto' : `${width}px`,
        height: (props.h as number).toString() === 'auto' ? 'auto' : `${height}px`
      }),
      [props.w, props.h, width, height]
    )

    // 点击块拖拽物之外的地方
    function deselect (ev: MouseEvent) {
      if (props.onDeselect) {
        props.onDeselect({ comid: props.comid, ev })
      }
      changeActiveHandel(false)
    }

    function changeActiveHandel (activeState: boolean) {
      if (props.isActive === undefined) {
        setActive(activeState)
      }
    }

    function calcResizeLimits () {
      let minHeight = props.minh as number
      let minWidth = props.minw as number
      let maxHeihgt = props.maxh as number
      let maxWidth = props.maxw as number

      // 如果有等比例缩放,则会根据情况改变最小高度跟最大高度
      if (props.aspectRatio) {
        if (minWidth / minHeight > aspectFactor) {
          minHeight = minWidth / aspectFactor
        } else {
          minWidth = aspectFactor * minHeight
        }
        // 如果有显示最大宽度，并且等比例缩放的时候则最大高度也会被限制,反之则最大宽度会被限制
        if (maxWidth !== null) {
          if (maxHeihgt === null) {
            maxHeihgt = maxWidth * aspectFactor
          } else if (maxWidth / maxHeihgt > aspectFactor) {
            maxWidth = maxHeihgt / aspectFactor
          } else {
            maxHeihgt = maxWidth * aspectFactor
          }
        } else if (maxHeihgt !== null) {
          maxWidth = maxHeihgt / aspectFactor
        }
      }

      let leftMin = null
      let rightMin = null
      let topMin = null
      let bottomMin = null

      if (maxWidth !== null) {
        leftMin = left - (maxWidth - width)
        rightMin = right - (maxWidth - width)
      }
      if (maxHeihgt !== null) {
        topMin = top - (maxHeihgt - height)
        bottomMin = bottom - (maxHeihgt - height)
      }

      // 如果收父级限制
      if (props.parentLimitation) {
        leftMin = leftMin < 0 ? 0 : leftMin
        rightMin = rightMin < 0 ? 0 : rightMin
        topMin = topMin < 0 ? 0 : topMin
        bottomMin = bottomMin < 0 ? 0 : bottomMin
      }

      // 保存最小高宽
      const limits = {
        left: { min: leftMin, max: left + (width - minWidth) },
        right: { min: rightMin, max: right + (width - minWidth) },
        top: { min: topMin, max: top + (height - minHeight) },
        bottom: { min: bottomMin, max: bottom + (height - minHeight) }
      }

      // 是否等比例缩放
      if (props.aspectRatio) {
        // 因为在等比例缩放的时候点击中间时候，会向高度或宽度会向两侧伸缩，因此需要先计算此时伸缩的最大范围
        const aspectLimits = {
          left: {
            min: left - Math.min(top, bottom) * aspectFactor * 2,
            max: left + ((height - minHeight) / 2) * aspectFactor * 2
          },
          right: {
            min: right - Math.min(top, bottom) * aspectFactor * 2,
            max: right + ((height - minHeight) / 2) * aspectFactor * 2
          },
          top: {
            min: top - (Math.min(left, right) / aspectFactor) * 2,
            max: top + ((width - minWidth) / 2 / aspectFactor) * 2
          },
          bottom: {
            min: bottom - (Math.min(left, right) / aspectFactor) * 2,
            max: bottom + ((width - minWidth) / 2 / aspectFactor) * 2
          }
        }
        if (currentStickSync.current[0] === 'm') {
          limits.left = {
            min: Math.max(limits.left.min, aspectLimits.left.min),
            max: Math.min(limits.left.max, aspectLimits.left.max)
          }
          limits.right = {
            min: Math.max(limits.right.min, aspectLimits.right.min),
            max: Math.min(limits.right.max, aspectLimits.right.max)
          }
        } else if (currentStickSync.current[1] === 'm') {
          limits.top = {
            min: Math.max(limits.top.min, aspectLimits.top.min),
            max: Math.min(limits.top.max, aspectLimits.top.max)
          }
          limits.bottom = {
            min: Math.max(limits.bottom.min, aspectLimits.bottom.min),
            max: Math.min(limits.bottom.max, aspectLimits.bottom.max)
          }
        }
      }
      return limits
    }

    function stickDown (stick: string, ev: MouseEvent | TouchEvent, force = false) {
      // 阻止冒泡事件
      if (ev.stopPropagation) {
        ev.stopPropagation()
      }
      // 阻止默认行为
      if (ev.preventDefault) {
        ev.preventDefault()
      }

      // 是否允许拖拽
      if ((!props.isResizable || !activeSync.current) && !force) {
        return
      }

      // 标记状态
      setStickDrag(true)
      // 设置为活动状态
      setIsOperation(true)

      // 记录点击的鼠标位置
      const pointerX = typeof (ev as MouseEvent).pageX !== 'undefined' ? (ev as MouseEvent).pageX : (ev as TouchEvent).touches[0].pageX
      const pointerY = typeof (ev as MouseEvent).pageY !== 'undefined' ? (ev as MouseEvent).pageY : (ev as TouchEvent).touches[0].pageY

      // 保存起始信息
      saveDimensionsBeforeMove({ pointerX, pointerY })

      // 保存当前点击的手柄信息
      setCurrentStick(stick)

      // 保存可拖动的最大最小范围
      setLimits(calcResizeLimits())
    }

    function bodyDown (ev: MouseEvent | TouchEvent) {
      const { target, button } = ev
      // evm.button标识鼠标点击的方式 =0 代表左键 =2 右键 =1中间按键
      // 如果不是左键的话则中断
      if (button && button !== 0) {
        return
      }

      // 将触发的对象传递出去
      if (props.onClicBodyDown) {
        props.onClicBodyDown({ comid: props.comid, ev })
      }
      // 如果物体在组里,受组的控制
      if (reactDragResizeContext) {
        // 取消组里其他物体的激活状态
        const totalDragResizeContext = reactDragResizeContext.getTotalDragResizeContext()
        Object.keys(totalDragResizeContext).forEach(uid => {
          if (_uid !== uid) {
            totalDragResizeContext[uid].setActive(false)
          }
        })
        setActive(true)
      } else {
        // 否者受自身控制,设置为激活状态
        changeActiveHandel(true)
      }
      // 设置为活动状态
      setIsOperation(true)

      // 查找点击的对象上面是否设置了拖拽标识,有则可以拖动
      if (props.dragHandle && target.getAttribute('data-drag-handle') !== _uid.toString()) {
        return
      }

      // 反过来，如果有则不可以拖动
      if (props.dragCancel && target.getAttribute('data-drag-cancel') === _uid.toString()) {
        return
      }

      // 取消点击默认事件
      if (typeof ev.stopPropagation !== 'undefined') {
        ev.stopPropagation()
      }

      // 设置bodyDrag为移动转态
      if (props.isDraggable) {
        setBodyDrag(true)
      }

      // 拿到点击位置的坐标
      const pointerX = typeof (ev as MouseEvent).pageX !== 'undefined' ? (ev as MouseEvent).pageX : (ev as TouchEvent).touches[0].pageX
      const pointerY = typeof (ev as MouseEvent).pageY !== 'undefined' ? (ev as MouseEvent).pageY : (ev as TouchEvent).touches[0].pageY

      // 保存信息当前鼠标点击位置，块的位置等
      saveDimensionsBeforeMove({ pointerX, pointerY })

      // 将组件更改的范围限制为其父大小,calcDragLimitation方法返回一个可移动的最大最小值
      if (props.parentLimitation) {
        setLimits(calcDragLimitation())
      }
    }

    // （拖动）鼠标按下的时候计算最大最小值
    function calcDragLimitation () {
      return {
        left: { min: 0, max: parentWidth - width },
        right: { min: 0, max: parentWidth - width },
        top: { min: 0, max: parentHeight - height },
        bottom: { min: 0, max: parentHeight - height }
      }
    }

    function move (ev) {
      // 判断是否可移动点击窗体或者控制点
      if (!stickDragSync.current && !bodyDragSync.current) {
        return
      }

      // 阻止事件冒泡
      ev.stopPropagation()

      // 获取移动事件鼠标的位置
      const pageX = typeof ev.pageX !== 'undefined' ? ev.pageX : ev.touches[0].pageX
      const pageY = typeof ev.pageY !== 'undefined' ? ev.pageY : ev.touches[0].pageY

      // 计算鼠标距离按下时候的距离根据parentScaleX定义的比例
      const delta = {
        x: (dimensionsBeforeMoveSync.current.pointerX - pageX) / props.parentScaleX,
        y: (dimensionsBeforeMoveSync.current.pointerY - pageY) / props.parentScaleY
      }

      // 如果点击的是控制点
      if (stickDragSync.current) {
        stickMove(delta)
      }

      // 点击的是窗体
      if (bodyDragSync.current) {
        // 判断x轴跟y轴是否可移动，如果不可移动则不设置
        if (props.axis === 'x') {
          delta.y = 0
        } else if (props.axis === 'y') {
          delta.x = 0
        } else if (props.axis === 'none') {
          return
        }
        bodyMove(delta)
      }
    }

    function stickMove (delta) {
      const { snapToGrid, gridY, gridX } = props

      let newTop = dimensionsBeforeMoveSync.current.top
      let newBottom = dimensionsBeforeMoveSync.current.bottom
      let newLeft = dimensionsBeforeMoveSync.current.left
      let newRight = dimensionsBeforeMoveSync.current.right

      switch (currentStickSync.current[0]) {
        case 'b':
          newBottom = dimensionsBeforeMoveSync.current.bottom + delta.y

          if (snapToGrid) {
            newBottom = parentHeight - Math.round((parentHeight - newBottom) / gridY) * gridY
          }

          break

        case 't':
          newTop = dimensionsBeforeMoveSync.current.top - delta.y

          if (snapToGrid) {
            newTop = Math.round(newTop / gridY) * gridY
          }

          break
        default:
          break
      }

      switch (currentStickSync.current[1]) {
        case 'r':
          newRight = dimensionsBeforeMoveSync.current.right + delta.x

          if (snapToGrid) {
            newRight = parentWidth - Math.round((parentWidth - newRight) / gridX) * gridX
          }

          break

        case 'l':
          newLeft = dimensionsBeforeMoveSync.current.left - delta.x

          if (snapToGrid) {
            newLeft = Math.round(newLeft / gridX) * gridX
          }

          break
        default:
          break
      }

      // 判断是否超出边界处理并更新组件的值
      ;({ newLeft, newRight, newTop, newBottom } = rectCorrectionByLimit({
        newLeft,
        newRight,
        newTop,
        newBottom
      }))

      // 等比例缩放
      if (props.aspectRatio) {
        ;({ newLeft, newRight, newTop, newBottom } = rectCorrectionByAspectRatio({
          newLeft,
          newRight,
          newTop,
          newBottom
        }))
      }

      // 更新
      setLeft(newLeft)
      setRight(newRight)
      setTop(newTop)
      setBottom(newBottom)

      // 实时高宽
      const newWidth = parentWidth - newLeft - newRight
      const newHeight = parentHeight - newTop - newBottom

      // 传递事件将数据传递出去
      if (props.onResizing) {
        props.onResizing({
          comid: props.comid,
          beforeMove: dimensionsBeforeMoveSync.current,
          curMove: {
            top: newTop,
            left: newLeft,
            right: newRight,
            bottom: newBottom,
            width: newWidth,
            height: newHeight
          }
        })
      }
    }

    function rectCorrectionByAspectRatio (rect) {
      let { newLeft, newRight, newTop, newBottom } = rect

      let newWidth = parentWidth - newLeft - newRight
      let newHeight = parentHeight - newTop - newBottom

      if (currentStickSync.current[1] === 'm') {
        const deltaHeight = newHeight - dimensionsBeforeMoveSync.current.height

        newLeft -= (deltaHeight * aspectFactor) / 2
        newRight -= (deltaHeight * aspectFactor) / 2
      } else if (currentStickSync.current[0] === 'm') {
        const deltaWidth = newWidth - dimensionsBeforeMoveSync.current.width

        newTop -= deltaWidth / aspectFactor / 2
        newBottom -= deltaWidth / aspectFactor / 2
      } else if (newWidth / newHeight > aspectFactor) {
        newWidth = aspectFactor * newHeight

        if (currentStickSync.current[1] === 'l') {
          newLeft = parentWidth - newRight - newWidth
        } else {
          newRight = parentWidth - newLeft - newWidth
        }
      } else {
        newHeight = newWidth / aspectFactor

        if (currentStickSync.current[0] === 't') {
          newTop = parentHeight - newBottom - newHeight
        } else {
          newBottom = parentHeight - newTop - newHeight
        }
      }

      return {
        newLeft,
        newRight,
        newTop,
        newBottom
      }
    }

    function bodyMove (delta) {
      const { gridX, gridY, snapToGrid } = props
      let newTop = dimensionsBeforeMoveSync.current.top - delta.y
      let newBottom = dimensionsBeforeMoveSync.current.bottom + delta.y
      let newLeft = dimensionsBeforeMoveSync.current.left - delta.x
      let newRight = dimensionsBeforeMoveSync.current.right + delta.x

      // 是否限制移动的范围,必须按照某个步数来移动
      if (snapToGrid) {
        let alignTop = true
        let alignLeft = true

        // 这个操作是为了让格子移动如果超出一般则直接跳到下一个格子
        let diffT = newTop - Math.floor(newTop / gridY) * gridY
        let diffB = parentHeight - newBottom - Math.floor((parentHeight - newBottom) / gridY) * gridY
        let diffL = newLeft - Math.floor(newLeft / gridX) * gridX
        let diffR = parentWidth - newRight - Math.floor((parentWidth - newRight) / gridX) * gridX

        if (diffT > gridY / 2) {
          diffT -= gridY
        }
        if (diffB > gridY / 2) {
          diffB -= gridY
        }
        if (diffL > gridX / 2) {
          diffL -= gridX
        }
        if (diffR > gridX / 2) {
          diffR -= gridX
        }

        // 根据比对判断盒子移动的方向
        if (Math.abs(diffB) < Math.abs(diffT)) {
          alignTop = false
        }
        if (Math.abs(diffR) < Math.abs(diffL)) {
          alignLeft = false
        }

        newTop -= alignTop ? diffT : diffB
        newBottom = parentHeight - height - newTop
        newLeft -= alignLeft ? diffL : diffR
        newRight = parentWidth - width - newLeft
      }

      // 判断是否超出边界处理并更新组件的值
      ;({ newLeft, newRight, newTop, newBottom } = rectCorrectionByLimit({
        newLeft,
        newRight,
        newTop,
        newBottom
      }))
      setLeft(newLeft)
      setRight(newRight)
      setTop(newTop)
      setBottom(newBottom)
      // 传递事件将数据传递出去
      if (props.onDragging) {
        props.onDragging({
          comid: props.comid,
          beforeMove: dimensionsBeforeMoveSync.current,
          curMove: {
            top: newTop,
            left: newLeft,
            right: newRight,
            bottom: newBottom
          }
        })
      }
    }

    function rectCorrectionByLimit (rect) {
      let { newRight, newLeft, newBottom, newTop } = rect

      newLeft = sideCorrectionByLimit(limits.left, newLeft)
      newRight = sideCorrectionByLimit(limits.right, newRight)
      newTop = sideCorrectionByLimit(limits.top, newTop)
      newBottom = sideCorrectionByLimit(limits.bottom, newBottom)

      return {
        newLeft,
        newRight,
        newTop,
        newBottom
      }
    }

    function sideCorrectionByLimit (limit, current) {
      let value = current

      if (limit.min !== null && current < limit.min) {
        value = limit.min
      } else if (limit.max !== null && limit.max < current) {
        value = limit.max
      }

      return value
    }

    function up (ev) {
      if (stickDragSync.current || bodyDragSync.current) {
        // 冲突检测
        const conflictResult = conflictCheck({
          top,
          left,
          width,
          height
        })
        // 冲突检测有开启，并且冲突了
        if (conflictResult.type === 'on' && conflictResult.isConflict === true) {
          setPosition({
            top: dimensionsBeforeMoveSync.current.top,
            left: dimensionsBeforeMoveSync.current.left,
            right: dimensionsBeforeMoveSync.current.right,
            bottom: dimensionsBeforeMoveSync.current.bottom
          })
        } else {
          // 记录当前操作
          recordCurrentSteps({
            top,
            left,
            right,
            bottom
          })
          // 记录上一次操作
          recordHistorySteps({
            dimensionsBeforeMoveData: dimensionsBeforeMoveSync.current
          })
        }
        if (stickDragSync.current) {
          stickUp(ev)
        } else if (bodyDragSync.current) {
          bodyUp(ev)
        }
      }
    }

    function stickUp () {
      setStickDrag(false)
      setIsOperation(false)
      if (props.onResizing) {
        props.onResizing({
          comid: props.comid,
          beforeMove: dimensionsBeforeMoveSync.current,
          curMove: {
            top: topSync.current,
            left: leftSync.current,
            right: rightSync.current,
            bottom: bottomSync.current,
            width: parentWidth - leftSync.current - rightSync.current,
            height: parentHeight - topSync.current - bottomSync.current
          }
        })
      }
      if (props.onResizestop) {
        props.onResizestop({
          comid: props.comid,
          beforeMove: dimensionsBeforeMoveSync.current,
          curMove: {
            top: topSync.current,
            left: leftSync.current,
            right: rightSync.current,
            bottom: bottomSync.current,
            width: parentWidth - leftSync.current - rightSync.current,
            height: parentHeight - topSync.current - bottomSync.current
          }
        })
      }
      setDimensionsBeforeMove({
        pointerX: 0,
        pointerY: 0,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        heihgt: 0
      })
      setLimits({
        left: { min: null, max: null },
        right: { min: null, max: null },
        top: { min: null, max: null },
        bottom: { min: null, max: null }
      })
    }

    function bodyUp () {
      // 接触按下转态，触发方法
      setBodyDrag(false)
      setIsOperation(false)
      // 传递事件将数据传递出去
      if (props.onDragging) {
        props.onDragging({
          comid: props.comid,
          beforeMove: dimensionsBeforeMoveSync.current,
          curMove: {
            top,
            left,
            right,
            bottom
          }
        })
      }
      if (props.onDragstop) {
        props.onDragstop({
          comid: props.comid,
          beforeMove: dimensionsBeforeMoveSync.current,
          curMove: {
            top,
            left,
            right,
            bottom
          }
        })
      }

      // 还原鼠标按下位置
      setDimensionsBeforeMove({
        pointerX: 0,
        pointerY: 0,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        heihgt: 0
      })

      // 还原父级最大最小值
      setLimits({
        left: { min: null, max: null },
        right: { min: null, max: null },
        top: { min: null, max: null },
        bottom: { min: null, max: null }
      })
    }

    function saveDimensionsBeforeMove ({ pointerX, pointerY }) {
      setDimensionsBeforeMove({
        pointerX,
        pointerY,
        left,
        right,
        top,
        bottom,
        width,
        height
      })
      setAspectFactor(width / height)
    }

    return (
      <ReactDragResizeWrapper
        id={props.id}
        data-testid="testid-drag-resize"
        ref={rootRef}
        className={classnames([
          'rdr',
          props.className,
          active ? 'active' : 'inactive',
          props.class ? props.class : '',
          isOperation ? 'Operation' : ''
        ])}
        onMouseDown={(ev) => {
          bodyDown(ev)
        }}
        onTouchStart={(ev) => {
          bodyDown(ev)
        }}
        onTouchEnd={(ev) => {
          up(ev)
        }}
        style={{ ...positionStyle, ...props.style }}
      >
        <div style={sizeStyle} className="content-container" ref={container}>
          {props.children}
        </div>
        {props.sticks
          .filter((stick) => {
            const defaultSticks = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']
            if (defaultSticks.includes(stick)) {
              return true
            }
            return false
          })
          .map((stick) => (
            <div
              key={stick}
              className={classnames([
                props.classNameStick,
                'rdr-stick',
                `rdr-stick-${stick}`,
                props.isResizable ? '' : 'not-resizable'
              ])}
              onMouseDown={(event) => {
                stickDown(stick, event)
              }}
              onTouchStart={(event) => {
                stickDown(stick, event)
              }}
              style={rdrStick(stick)}
            >
              {props.stickSlot[stick]}
            </div>
          ))}
      </ReactDragResizeWrapper>
    )
  })
)

// ReactDragResize.propTypes = {
//   // 移动步数 >=0
//   gridX (props) {
//     const val = props.gridX
//     if (!(typeof val === 'number' && val >= 0)) {
//       return new Error('参数gridX值类型校验失败')
//     }
//   },
//   // 移动步数 >=0
//   gridY (props) {
//     const val = props.gridY
//     if (!(typeof val === 'number' && val >= 0)) {
//       return new Error('参数gridY值类型校验失败')
//     }
//   },
//   // 父级宽度 >=0
//   parentW (props) {
//     const val = props.parentW
//     if (!(typeof val === 'number' && val >= 0) && val !== null) {
//       return new Error('参数parentW值类型校验失败')
//     }
//   },
//   // 父级高度 >=0
//   parentH (props) {
//     const val = props.parentH
//     if (!(typeof val === 'number' && val >= 0) && val !== null) {
//       return new Error('参数parentH值类型校验失败')
//     }
//   },
//   // 受控宽度
//   w (props) {
//     const val = props.w
//     if (!(typeof val === 'string' ? val === 'auto' : val >= 0)) {
//       return new Error('参数w值类型校验失败')
//     }
//   },
//   // 受控高度
//   h (props) {
//     const val = props.h
//     if (!(typeof val === 'string' ? val === 'auto' : val >= 0)) {
//       return new Error('参数h值类型校验失败')
//     }
//   },
//   // 最大宽度
//   maxw (props) {
//     const val = props.maxw
//     if (!(typeof val === 'string' ? val === 'auto' : val >= 0)) {
//       return new Error('参数maxh值类型校验失败')
//     }
//   },
//   maxh (props) {
//     const val = props.maxh
//     if (!(typeof val === 'string' ? val === 'auto' : val >= 0)) {
//       return new Error('参数maxh值类型校验失败')
//     }
//   },
//   z (props) {
//     const val = props.z
//     if (!(typeof val === 'string' ? val === 'auto' : val >= 0)) {
//       return new Error('参数z值类型校验失败')
//     }
//   },
//   axis (props) {
//     const val = props.axis
//     if (!(typeof val === 'string' && ['x', 'y', 'both', 'none'].indexOf(val) !== -1)) {
//       return new Error('参数axis值类型校验失败')
//     }
//   }
// }

ReactDragResize.defaultProps = {
  comid: undefined,
  stickSize: 8,
  parentScaleX: 1,
  parentScaleY: 1,
  isActive: undefined,
  isDraggable: true,
  isResizable: true,
  aspectRatio: false,
  parentLimitation: false,
  snapToGrid: false,
  gridX: 50,
  gridY: 50,
  parentW: undefined,
  parentH: undefined,
  w: 200,
  h: 200,
  minw: 0,
  minh: 0,
  maxw: null,
  maxh: null,
  x: 0,
  y: 0,
  z: 'auto',
  dragHandle: undefined,
  dragCancel: undefined,
  sticks: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
  classNameStick: null,
  stickSlot: {},
  axis: 'both',
  class: '',
  isConflictCheck: false,
  onClicBodyDown: undefined,
  onDeselect: null,
  historyStepsLength: 0,
  onDragging: undefined,
  onDragstop: null,
  onResizing: null,
  onResizestop: null,
  directionStep: 1,
  shiftDirectionStep: 10,
  keyDirection: null
}

ReactDragResize.Group = ReactDragResizeGroup

export default ReactDragResize
