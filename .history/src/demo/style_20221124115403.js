import styled from 'styled-components'

export const AppWrapper = styled.div`
width: 100%;
height: 100%;
position: relative;
background-color: #ececec;
.left-content{
  position: absolute;
  top: 30px;
  bottom: 30px;
  left: 30px;
  right: 300px;
  -webkit-box-shadow: 0 0 2px #aaa;
  box-shadow: 0 0 2px #aaa;
  background-color: #fff;
}
.right-toolBar{
  position: absolute;
  right: 0;
  top: 0;
  width: 220px;
  padding: 15px 15px 0;
  -webkit-box-shadow: 0 0 2px #aaa;
  box-shadow: 0 0 2px #aaa;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #fff;
  margin: 30px 30px 30px 0;
}
`