import styled from 'styled-components'

const Swipeable = styled.div`
  .ant-carousel .slick-dots li {
    width: 12px;
    margin: 0 5px;
    button {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      box-sizing: border-box;
      border: 1px solid ${props => props.theme.color.primary['700']};
      background-color: ${props => props.theme.color.white};
    }
    &.slick-active {
      button {
        background-color: ${props => props.theme.color.primary['700']};
      }
    }
  }
  .ant-carousel .slick-dots-bottom {
    bottom: -24px;
    text-align: left;
  }
  .ant-carousel .slick-slider.hasIframe .slick-list .slick-slide {
    pointer-events: auto;
  }
`

export default Swipeable
