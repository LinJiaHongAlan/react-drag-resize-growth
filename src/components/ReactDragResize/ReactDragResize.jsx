import React, { memo, useState, useEffect, useCallback, useMemo, useRef, forwardRef, useImperativeHandle, useContext } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import ReactDragResizeGroup, { ReactDragResizeContext } from '../ReactDragResizeGroup/ReactDragResizeGroup'
import { ReactDragResizeWrapper } from './style'
import { usekeyDirection } from '../hooks/usekeyDirection'
import { useSyncState } from '../../hooks/useSyncState'
import { useConflictCheck } from './hooks/useConflictCheck'
import { useHistorySteps } from './hooks/useHistorySteps'
import useWatch from '../../hooks/useWatch'

function addEvents (events) {
  events.forEach((cb, eventName) => {
    document.documentElement.addEventListener(eventName, cb)
  })
}

function removeEvents (events) {
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

const ReactDragResize = memo(
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

    const setPosition = ({ top, left, right, bottom }) => {
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

    const operationStepsHandel = (step) => {
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
      goOperationStep (step) {
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
    useWatch(props.w, (newVal, oldVal) => {
      if (stickDragSync.current || bodyDragSync.current || newVal === width) {
        return
      }
      const stick = 'mr'
      const delta = oldVal - newVal
      stickDown(stick, { pageX: right, pageY: top + height / 2 }, true)
      stickMove({ x: delta, y: 0 })
      stickUp()
    })
    useWatch(props.h, (newVal, oldVal) => {
      if (stickDragSync.current || bodyDragSync.current || newVal === height) {
        return
      }
      const stick = 'bm'
      const delta = oldVal - newVal
      stickDown(stick, { pageX: left + width / 2, pageY: bottom }, true)
      stickMove({ x: 0, y: delta })
      stickUp()
    })
    useWatch(props.y, (newVal, oldVal) => {
      if (stickDragSync.current || bodyDragSync.current || newVal === top) {
        return
      }
      const delta = oldVal - newVal
      bodyDown({ pageX: left, pageY: top })
      bodyMove({ x: 0, y: delta })
      bodyUp()
    })
    useWatch(props.x, (newVal, oldVal) => {
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
    useWatch(active, (newVal) => {
      if (newVal) {
        // this.$emit('activated');
      } else {
        // this.$emit('deactivated');
      }
    })
    useWatch(props.parentW, (newVal) => {
      setRight(newVal - width - left)
      setParentWidth(newVal)
    })
    useWatch(props.parentH, (newVal) => {
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
      (stick) => {
        const { stickSize, parentScaleX, parentScaleY } = props
        const stickStyle = {
          width: `${stickSize / parentScaleX}px`,
          height: `${stickSize / parentScaleY}px`
        }
        stickStyle[styleMapping.y[stick[0]]] = `${stickSize / parentScaleX / -2}px`
        stickStyle[styleMapping.x[stick[1]]] = `${stickSize / parentScaleX / -2}px`
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
        width: props.w.toString() === 'auto' ? 'auto' : `${width}px`,
        height: props.h.toString() === 'auto' ? 'auto' : `${height}px`
      }),
      [props.w, props.h, width, height]
    )

    // 点击块拖拽物之外的地方
    function deselect (ev) {
      if (props.onDeselect) {
        props.onDeselect({ comid: props.comid, ev })
      }
      changeActiveHandel(false)
    }

    function changeActiveHandel (activeState) {
      if (props.isActive === null) {
        setActive(activeState)
      }
    }

    function calcResizeLimits () {
      let minHeight = props.minh
      let minWidth = props.minw
      let maxHeihgt = props.maxh
      let maxWidth = props.maxw

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

    function stickDown (stick, ev, force = false) {
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
      const pointerX = typeof ev.pageX !== 'undefined' ? ev.pageX : ev.touches[0].pageX
      const pointerY = typeof ev.pageY !== 'undefined' ? ev.pageY : ev.touches[0].pageY

      // 保存起始信息
      saveDimensionsBeforeMove({ pointerX, pointerY })

      // 保存当前点击的手柄信息
      setCurrentStick(stick)

      // 保存可拖动的最大最小范围
      setLimits(calcResizeLimits())
    }

    function bodyDown (ev) {
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
      const pointerX = typeof ev.pageX !== 'undefined' ? ev.pageX : ev.touches[0].pageX
      const pointerY = typeof ev.pageY !== 'undefined' ? ev.pageY : ev.touches[0].pageY

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

      // 传递事件将数据传递出去
      if (props.onResizing) {
        props.onResizing({
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
            top,
            left: top,
            right: top,
            bottom: top
          }
        })
      }
      if (props.onResizestop) {
        props.onResizestop({
          comid: props.comid,
          beforeMove: dimensionsBeforeMoveSync.current,
          curMove: {
            top,
            left: top,
            right: top,
            bottom: top
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

ReactDragResize.propTypes = {
  comid: PropTypes.string,
  // 手柄大小
  stickSize: PropTypes.number,
  parentScaleX: PropTypes.number,
  parentScaleY: PropTypes.number,
  // 是否处于激活状态
  isActive: PropTypes.bool,
  // 确定组件是否应可拖动
  isDraggable: PropTypes.bool,
  // 是否允许缩放
  isResizable: PropTypes.bool,
  // 确定组件是否应保持其比例
  aspectRatio: PropTypes.bool,
  // 将组件更改的范围限制为其父大小
  parentLimitation: PropTypes.bool,
  // 是否开启父级限制拖拽步数
  snapToGrid: PropTypes.bool,
  // 移动步数 >=0
  gridX (props) {
    const val = props.gridX
    if (!(typeof val === 'number' && val >= 0)) {
      return new Error('参数gridX值类型校验失败')
    }
  },
  // 移动步数 >=0
  gridY (props) {
    const val = props.gridY
    if (!(typeof val === 'number' && val >= 0)) {
      return new Error('参数gridY值类型校验失败')
    }
  },
  // 父级宽度 >=0
  parentW (props) {
    const val = props.parentW
    if (!(typeof val === 'number' && val >= 0) && val !== null) {
      return new Error('参数parentW值类型校验失败')
    }
  },
  // 父级高度 >=0
  parentH (props) {
    const val = props.parentH
    if (!(typeof val === 'number' && val >= 0) && val !== null) {
      return new Error('参数parentH值类型校验失败')
    }
  },
  // 受控宽度
  w (props) {
    const val = props.w
    if (!(typeof val === 'string' ? val === 'auto' : val >= 0)) {
      return new Error('参数w值类型校验失败')
    }
  },
  // 受控高度
  h (props) {
    const val = props.h
    if (!(typeof val === 'string' ? val === 'auto' : val >= 0)) {
      return new Error('参数h值类型校验失败')
    }
  },
  // 最小宽度
  minw: PropTypes.number,
  // 最小高度
  minh: PropTypes.number,
  // 最大宽度
  maxw (props) {
    const val = props.maxw
    if (!(typeof val === 'string' ? val === 'auto' : val >= 0)) {
      return new Error('参数maxh值类型校验失败')
    }
  },
  maxh (props) {
    const val = props.maxh
    if (!(typeof val === 'string' ? val === 'auto' : val >= 0)) {
      return new Error('参数maxh值类型校验失败')
    }
  },
  x: PropTypes.number,
  y: PropTypes.number,
  z (props) {
    const val = props.z
    if (!(typeof val === 'string' ? val === 'auto' : val >= 0)) {
      return new Error('参数z值类型校验失败')
    }
  },
  dragHandle: PropTypes.string,
  dragCancel: PropTypes.string,
  sticks: PropTypes.array,
  classNameStick: PropTypes.string,
  stickSlot: PropTypes.object,
  axis (props) {
    const val = props.axis
    if (!(typeof val === 'string' && ['x', 'y', 'both', 'none'].indexOf(val) !== -1)) {
      return new Error('参数axis值类型校验失败')
    }
  },
  class: PropTypes.string,
  // 冲突检测
  isConflictCheck: PropTypes.bool,
  onClicBodyDown: PropTypes.func,
  onDeselect: PropTypes.func,
  // 操作步数存储长度
  historyStepsLength: PropTypes.number,
  // 拖拽
  onDragging: PropTypes.func,
  // 拖拽结束
  onDragstop: PropTypes.func,
  // 缩放
  onResizing: PropTypes.func,
  // 缩放结束
  onResizestop: PropTypes.func,
  directionStep: PropTypes.number,
  shiftDirectionStep: PropTypes.number,
  // 键盘方向
  keyDirection: PropTypes.bool
}
ReactDragResize.defaultProps = {
  comid: null,
  stickSize: 8,
  parentScaleX: 1,
  parentScaleY: 1,
  isActive: null,
  isDraggable: true,
  isResizable: true,
  aspectRatio: false,
  parentLimitation: false,
  snapToGrid: false,
  gridX: 50,
  gridY: 50,
  parentW: null,
  parentH: null,
  w: 200,
  h: 200,
  minw: 0,
  minh: 0,
  maxw: null,
  maxh: null,
  x: 0,
  y: 0,
  z: 'auto',
  dragHandle: null,
  dragCancel: null,
  sticks: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
  classNameStick: null,
  stickSlot: {},
  axis: 'both',
  class: '',
  isConflictCheck: false,
  onClicBodyDown: null,
  onDeselect: null,
  historyStepsLength: 0,
  onDragging: null,
  onDragstop: null,
  onResizing: null,
  onResizestop: null,
  directionStep: 1,
  shiftDirectionStep: 10,
  keyDirection: null
}

ReactDragResize.Group = ReactDragResizeGroup

export default ReactDragResize
