import { useState, useRef } from 'react'
// 同步方法

const useSyncState = (value, isState = true) => {
  // isState,是否需要返回可响应对象,如果是false则只返回ref
  let stateData = null
  let setDataHandel = null
  const dataSync = useRef(value)
  if (isState) {
    const [data, setData] = useState(value)
    stateData = data
    setDataHandel = setData
  }
  // 定义一个同步方法
  const useSyncState = (newValue) => {
    if (isState) {
      setDataHandel(newValue)
    }
    dataSync.current = newValue
  }
  return [stateData, useSyncState, dataSync]
}

export { useSyncState }
