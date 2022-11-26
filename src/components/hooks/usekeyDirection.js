import { useEffect } from 'react'
// 方向事件注册

// 获取新的位置
const getNewPosition = ({ direction, step, altKey, curPosition }) => {
  // 获取当前位置
  let left = curPosition.left
  let right = curPosition.right
  let top = curPosition.top
  let bottom = curPosition.bottom

  if (direction === 'left') {
    if (altKey) {
      right = right + step
    } else {
      left = left - step
      right = right + step
    }
  } else if (direction === 'top') {
    if (altKey) {
      bottom = bottom + step
    } else {
      top = top - step
      bottom = bottom + step
    }
  } else if (direction === 'right') {
    if (altKey) {
      right = right - step
    } else {
      right = right - step
      left = left + step
    }
  } else if (direction === 'bottom') {
    if (altKey) {
      bottom = bottom - step
    } else {
      bottom = bottom - step
      top = top + step
    }
  }
  return {
    top,
    left,
    right,
    bottom
  }
}

const usekeyDirection = ({ register, directionStep, shiftDirectionStep, keyDownDirectionHandel }) => {

   // 方向按下
  const keyDownDirection = (ev) => {
    // 键盘按住会触发很多次
    const keyCode = ev.keyCode || ev.which || ev.charCode
    if (![37, 38, 39, 40].includes(keyCode)) {
      return
    }
    const shiftKey = ev.shiftKey
    const altKey = ev.altKey
    // 是否按下shift按键
    let step = directionStep
    let direction = null
    if (shiftKey) {
      step = shiftDirectionStep
    }
    if (keyCode === 37) { // 方向左键
      direction = 'left'
      ev.preventDefault()
    } else if (keyCode === 38) { // 方向上键
      direction = 'top'
      ev.preventDefault()
    } else if (keyCode === 39) { // 方向右键
      direction = 'right'
      ev.preventDefault()
    } else if (keyCode === 40) { // 方向下键
      direction = 'bottom'
      ev.preventDefault()
    }
    if (keyDownDirectionHandel) {
      keyDownDirectionHandel({
        direction,
        step,
        altKey,
        getNewPosition
      })
    }
  }

  useEffect(() => {
    // 是否需要注册
    if (register) {
      console.log('我从新绑定了')
      // 注册键盘事件
      document.addEventListener('keydown', keyDownDirection)
      return () => {
        document.removeEventListener('keydown', keyDownDirection)
      }
    }
  }, [directionStep, shiftDirectionStep, keyDownDirectionHandel])
}


export { usekeyDirection }
