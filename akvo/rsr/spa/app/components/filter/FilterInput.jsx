import React from 'react'
import {
  Col,
  Icon,
  Input,
  Badge,
  Popover
} from 'antd'
import SVGInline from 'react-svg-inline'

import settingsIcon from '../../images/settings-icn.svg'

const PopOverButton = ({ visible, onPopOver, count = 0 }) => visible
  ? <Icon type="close" style={{ fontSize: 24 }} onClick={onPopOver} />
  : (
    <div style={{ paddingTop: 8, display: 'flex', gap: 8, justifyContent: 'center' }}>
      <Badge count={count} style={{ backgroundColor: '#1890ff', color: '#fff' }}>
        <SVGInline svg={settingsIcon} onClick={onPopOver} />
      </Badge>
    </div>
  )

const FilterInput = React.forwardRef(({
  visible = false,
  children,
  loading,
  onPopOver,
  count,
  ...props
}, ref) => (
  <Col className="filter-search">
    <Input
      {...props}
      size="large"
      ref={ref}
      prefix={<Icon type="search" />}
      addonAfter={(
        <Popover placement="bottomRight" content={<>{children}</>} visible={visible}>
          {
            loading
              ? <Icon type="loading" style={{ fontSize: 24 }} spin />
              : <PopOverButton {...{ visible, onPopOver, count }} />
          }
        </Popover>
      )}
      allowClear
    />
  </Col>
))

export default FilterInput
