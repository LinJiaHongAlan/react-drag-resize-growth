import { useSyncState } from '../../../hooks/useSyncState'
// 记忆存储/回退功能

const useHistorySteps = (historyStepsLength) => {
  // 操作步数存储
  const [, , historyStepsSync] = useSyncState([], false)

  // 以当前为0，-1为前一个
  const [, setCurStep, curStepSync] = useSyncState(0, false)

  // 记录历史步数步数
  const recordHistorySteps = ({ dimensionsBeforeMoveData }) => {
    // 看当前步数下表在哪，如果下表是回溯历史的时候，则应该清空回退的记录,步数回归0
    if (curStepSync.current < 0) {
      const arrIndex = historyStepsSync.current.length + curStepSync.current
      historyStepsSync.current.splice(arrIndex)
      setCurStep(0)
    }
    if (historyStepsLength > 0) {
      if (historyStepsSync.current.length === historyStepsLength) {
        // 存储数据满了需要删掉一个
        historyStepsSync.current.splice(0, 1)
      }
      // 插入当前记录
      historyStepsSync.current.push(dimensionsBeforeMoveData)
    }
  }

  const [, setCurrentSteps, currentStepsSync] = useSyncState(null, false)
  // 记录当前所在位置
  const recordCurrentSteps = (dimensionsBeforeMoveData) => {
    setCurrentSteps(dimensionsBeforeMoveData)
  }

  // 查询步数记录方法
  const getHistorySteps = (steps) => {
    if (steps === 0) {
      // 返回到当前最新的位置
      return currentStepsSync.current
    }
    // 转换成数组下标
    const arrIndex = historyStepsSync.current.length + steps
    if (arrIndex > -1) {
      // 存在这个记录
      return historyStepsSync.current[arrIndex]
    }
    // 不存在返回null
    return null
  }

  return {
    recordHistorySteps,
    recordCurrentSteps,
    getHistorySteps,
    setCurStep,
    curStepSync,
    historyStepsSync
  }
}

export { useHistorySteps }
