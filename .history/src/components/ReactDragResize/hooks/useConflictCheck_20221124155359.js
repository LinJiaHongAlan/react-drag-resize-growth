import { useEffect } from 'react'

// 冲突检测
const useConflictCheck = ({ isConflictCheck, rootRef }) => {
  useEffect(() => {
    // 设置冲突检测
    rootRef.current.setAttribute('data-is-check', `${isConflictCheck}`)
  }, [])

  function formatPostionVal(string) {
    let num = string.replace(/[^0-9\-,]/g, '')
    if (num === undefined) num = 0
    return parseFloat(num)
  }

  const conflictCheck = ({ top, left, width, height }) => {
    if (isConflictCheck) {
      const nodes = rootRef.current.parentNode.childNodes // 获取当前父节点下所有子节点
      for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i]
        if (
          item.className !== undefined &&
          !item.className.includes('Operation') &&
          item.getAttribute('data-is-check') !== null &&
          item.getAttribute('data-is-check') !== 'false'
        ) {
          const tw = item.offsetWidth
          const th = item.offsetHeight
          const tl = formatPostionVal(item.style.left)
          const tt = formatPostionVal(item.style.top)

          // 左上角与右下角重叠
          const tfAndBr =
            (top >= tt && left >= tl && tt + th > top && tl + tw > left) ||
            (top <= tt && left < tl && top + height > tt && left + width > tl)
          // 右上角与左下角重叠
          const brAndTf =
            (left <= tl && top >= tt && left + width > tl && top < tt + th) ||
            (top < tt && left > tl && top + height > tt && left < tl + tw)
          // 下边与上边重叠
          const bAndT =
            (top <= tt && left >= tl && top + height > tt && left < tl + tw) ||
            (top >= tt && left <= tl && top < tt + th && left > tl + tw)
          // 上边与下边重叠（宽度不一样）
          const tAndB =
            (top <= tt && left >= tl && top + height > tt && left < tl + tw) ||
            (top >= tt && left <= tl && top < tt + th && left > tl + tw)
          // 左边与右边重叠
          const lAndR =
            (left >= tl && top >= tt && left < tl + tw && top < tt + th) ||
            (top > tt && left <= tl && left + width > tl && top < tt + th)
          // 左边与右边重叠（高度不一样）
          const rAndL =
            (top <= tt && left >= tl && top + height > tt && left < tl + tw) ||
            (top >= tt && left <= tl && top < tt + th && left + width > tl)

          // 如果冲突，就将回退到移动前的位置
          if (tfAndBr || brAndTf || bAndT || tAndB || lAndR || rAndL) {
            return { type: 'on', isConflict: true }
          }
          return { type: 'on', isConflict: false }
        }
      }
      return { type: 'on', isConflict: false }
    }
    return { type: 'off' }
  }

  return {
    conflictCheck
  }
}

export { useConflictCheck }
