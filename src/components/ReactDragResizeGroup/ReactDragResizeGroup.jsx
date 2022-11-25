import React, { createContext, useRef, useCallback } from 'react'
import { ReactDragResizeGroupWrapper } from './style'

export const ReactDragResizeContext = createContext()

// 拖拽组
function ReactDragResizeGroup (props) {
  const DragResizeGroupRef = useRef({
    Items: {}
  })
  return (
    <ReactDragResizeContext.Provider
      value={{
        getDragResizeContext: (name) => {
          return DragResizeGroupRef.current.Items[name]
        },
        getTotalDragResizeContext: () => {
          return DragResizeGroupRef.current.Items
        },
        registerDragResize: (name, DragResizeItem) => {
          if (name) {
            const { Items } = {...DragResizeGroupRef.current}
            Items[name] = DragResizeItem
            DragResizeGroupRef.current = {
              ...DragResizeGroupRef.current,
              Items
            }
          }
        },
        unregisterDragResize: name => {
          const { Items } = {...DragResizeGroupRef.current}
          delete Items[name]
          DragResizeGroupRef.current = {
            ...DragResizeGroupRef.current,
            Items
          }
        }
      }}>
      <ReactDragResizeGroupWrapper>
        <div style={{ width: '100%', height: '100%' }} className="App">
          {
            props?.children || ''
          }
        </div>
      </ReactDragResizeGroupWrapper>
    </ReactDragResizeContext.Provider>
  )
}

export default ReactDragResizeGroup
