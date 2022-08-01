import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  #root {
    font-family: ${props => props.theme.font.family};
    font-size: ${props => props.theme.font.size.sm};
    color: ${props => props.theme.color.black};
    background-color: ${props => props.theme.color.white};
    .ant-btn.ant-btn-link {
      font-weight: ${props => props.theme.font.weight.bold};
    }
    ul.disc {
      margin-left: 16px;
      list-style-type: disc;
      color: ${props => props.theme.color.black};
      font-weight: ${props => props.theme.font.weight.normal};
      font-size: ${props => props.theme.font.size.md};
      line-height: 28px;
    }
    .ant-collapse.feature-collapsible {
      width: 100%;
      margin-top: 64px;
      background-color: transparent;
      .ant-collapse-item {
        background: ${props => props.theme.color.white};
        margin-bottom: 8px;
        & > .ant-collapse-header {
          padding: 24px;
          height: 64px;
          font-family: ${props => props.theme.font.heading.family};
          font-size: ${props => props.theme.font.size.xl};
          box-shadow: ${props => props.theme.boxShadow.md};
          .ant-collapse-arrow {
            svg {
              color: ${props => props.theme.color.primary['700']};
              font-weight: 800;
              width: 18px;
              height: 18px;
            }
          }
        }
        &.ant-collapse-item-active {
          & > .ant-collapse-header {
            box-shadow: none;
          }
        }
        .ant-collapse-content-box {
          font-size: ${props => props.theme.font.size.sm};
          line-height: 24px;
        }
      }
    }
    .active-projects-header {
      padding: 0 25px;
    }
    .active-projects-content {
      border-top: 1px solid #e8e8e8;
    }
    .project-list-items {
      width: 100%;
      height: 600px;
      overflow-y: scroll;
      a {
        .locations.ant-typography {
          color: ${props => props.theme.color.black};
        }
        .item-image {
          width: 100%;
          height: 125px;
          object-fit: cover;
        }
      }
      .ant-list .ant-skeleton {
        padding: 8px;
      }
      .ant-list-footer .btn-load-more {
        display: none;
      }
    }
    .ant-divider-horizontal {
      margin: 24px 0 0 0;
    }
    .projects {
      opacity: 0;
      display: none;
      transition: opacity 0.3s;
      &.on {
        opacity: 1;
        display: block;
      }
    }
    #map-view {
      margin-top: -70px;
    }
    #map-view .expander {
      position: relative;
      top: 350px;
      z-index: 2;
      left: 0;
      width: 17px;
      height: 70px;
      background-color: #676767;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &.on {
        .anticon {
          transform: rotate(180deg);
        }
      }
    }
    .filter-tags {
      background-color: #f5f5f5;
      margin-top: 8px;
      border: 1px solid #d9d9d9;
      .btn-clear-all {
        color: #212121;
        & > span {
          font-weight: 600;
        }
      }
      .d-flex {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 10px;
        margin: 0 8px;
      }
      .info {
        border-right: 2px solid #212121;
        padding: 0 8px;
        .d-flex {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 10px;
        }
      }
      .ant-tag {
        border-radius: 25px 5px 5px 25px;
        padding: 6px 16px;
        max-width: 250px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        border-width: 1px;
        border-color: $blue-tag;
        color: $blue-tag;
        .anticon > svg {
          fill: $blue-tag;
          stroke: $blue-tag;
          stroke-width: 15%;
        }
        .anticon-close {
          margin: 0 4px 0 -4px;
        }
      }
    }
    #rsr-footer-home .ant-typography {
      color: ${props => props.theme.color.gray['900']};
    }
    @media (min-width: 1025px) and (max-width: 1280px) {
      ul.disc {
        font-size: ${props => props.theme.font.size.md};
        line-height: 24px;
      }
    }
    @media (min-width: 768px) and (max-width: 1024px) {
      ul.disc {
        font-size: ${props => props.theme.font.size.sm};
        line-height: 24px;
      }
      #rsr-case-studies .ant-carousel .slick-dots {
        bottom: -10% !important;
      }
    }
    @media (min-width: 577px) and (max-width: 767px) {
      ul.disc {
        font-size: ${props => props.theme.font.size.sm};
        line-height: 18px;
      }
    }
    @media (min-width: 320px) and (max-width: 576px) {
      ul.disc {
        font-size: ${props => props.theme.font.size.sm};
        line-height: 18px;
      }
    }
  }
`
export default GlobalStyle
