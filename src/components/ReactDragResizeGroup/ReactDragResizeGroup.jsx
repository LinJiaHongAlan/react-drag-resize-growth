import React, { memo, createContext, useRef, useEffect } from 'react'
import { usekeyDirection } from '../hooks/usekeyDirection'
import PropTypes, { oneOfType } from 'prop-types'

export const ReactDragResizeContext = createContext()

// 拖拽组
const ReactDragResizeGroup = memo((props) => {

  const dragResizeGroupRef = useRef({
    Items: {}
  })

  // 默认激活
  useEffect(() => {
    if  (props.defaultActive !== null) {
      const itemsArrs = Object.values(dragResizeGroupRef.current.Items)
      for (let i = 0; i < itemsArrs.length; i++) {
        const item = itemsArrs[i];
        if (item.comid === props.defaultActive) {
          item.setActive(true)
          return
        }
      }
    }
  }, [])

  usekeyDirection({
    register: props.keyDirection !== null,
    directionStep: props.directionStep,
    shiftDirectionStep: props.shiftDirectionStep,
    keyDownDirectionHandel: ({ direction, step, altKey, getNewPosition }) => {
      const itemsArrs = Object.values(dragResizeGroupRef.current.Items)
      for (let i = 0; i < itemsArrs.length; i++) {
        const item = itemsArrs[i]
        let isCur = null
        if (typeof props.keyDirection === 'boolean' && props.keyDirection === true) {
          // 如果传true,则根据active激活状态来
          isCur = item.activeSync.current === true
        }
        if (typeof props.keyDirection === 'string') {
          // 如果是字符串则根据comid来
          isCur = item.comid === props.keyDirection
        }
        if (isCur) {
          const {top, left, right, bottom} = item.getCurPosition()
          const { top: newTop, left: newLeft, right: newRight, bottom: newBottom } = getNewPosition({
            direction,
            step,
            altKey,
            curPosition: {
              top,
              left,
              right,
              bottom
            }
          })
          item.setPosition({
            top: newTop,
            left: newLeft,
            right: newRight,
            bottom: newBottom
          })
          return
        }
      }
    }
  })

  return (
    <ReactDragResizeContext.Provider
      value={{
        getDragResizeContext: (name) => {
          return dragResizeGroupRef.current.Items[name]
        },
        getTotalDragResizeContext: () => {
          return dragResizeGroupRef.current.Items
        },
        registerDragResize: (name, DragResizeItem) => {
          if (name) {
            const { Items } = {...dragResizeGroupRef.current}
            Items[name] = DragResizeItem
            dragResizeGroupRef.current = {
              ...dragResizeGroupRef.current,
              Items
            }
          }
        },
        unregisterDragResize: name => {
          const { Items } = {...dragResizeGroupRef.current}
          delete Items[name]
          dragResizeGroupRef.current = {
            ...dragResizeGroupRef.current,
            Items
          }
        }
      }}>
      {
        props?.children || ''
      }
    </ReactDragResizeContext.Provider>
  )
})

ReactDragResizeGroup.propTypes = {
  // 默认激活
  defaultActive: PropTypes.string,
  // 键盘方向控制
  keyDirection: oneOfType([PropTypes.string, PropTypes.bool, PropTypes.array]),
  directionStep: PropTypes.number,
  shiftDirectionStep: PropTypes.number
}

ReactDragResizeGroup.defaultProps = {
  defaultActive: null,
  keyDirection: null,
  directionStep: 1,
  shiftDirectionStep: 10
}

export default ReactDragResizeGroup
