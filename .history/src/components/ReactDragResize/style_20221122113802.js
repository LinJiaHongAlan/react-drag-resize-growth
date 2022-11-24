import styled from 'styled-components'

export const ReactDragResizeWrapper = styled.div`
&.rdr {
  position: absolute;
  box-sizing: border-box;
  &.active:before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    outline: 1px dashed #d6d6d6;
  }
  &.inactive .rdr-stick {
    display: none;
  }
}
.rdr-stick {
    box-sizing: border-box;
    position: absolute;
    font-size: 1px;
    background: #ffffff;
    border: 1px solid #6c6c6c;
    box-shadow: 0 0 2px #bbb;
}
.rdr-stick-tl, .rdr-stick-br {
    cursor: nwse-resize;
}
.rdr-stick-tm, .rdr-stick-bm {
    left: 50%;
    cursor: ns-resize;
}
.rdr-stick-tr, .rdr-stick-bl {
    cursor: nesw-resize;
}
.rdr-stick-ml, .rdr-stick-mr {
    top: 50%;
    cursor: ew-resize;
}
.rdr-stick.not-resizable{
    display: none;
}
.content-container{
    display: block;
    position: relative;
}
`