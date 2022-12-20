/**
* @jest-environment jsdom
*/
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import ReactDragResize from './ReactDragResize'


test('放入dom中', () => {
  const wrapper = render(
    <ReactDragResize
      id="ljh-test1"
      w={100}
      h={150}
      x={200}
      y={160}>
      ljh
    </ReactDragResize>
  )
  const element = wrapper.getByTestId('testid-drag-resize')
  // 是否在界面上
  expect(element).toBeInTheDocument()
  // 判断高宽
  const contentContainer = element.getElementsByClassName('content-container')
  expect(contentContainer[0]).toHaveStyle({
    width: '100px',
    height: '150px'
  })
})
