import React from 'react';
import ReactDragResize from './ReactDragResize';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

storiesOf('基础使用', module)
  .add('基础使用', () => <ReactDragResize style={{ backgroundColor: 'pink' }}>我的第一个基本使用</ReactDragResize>)


