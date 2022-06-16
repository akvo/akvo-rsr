import React from 'react'
import {
  Row,
  Col,
  Icon,
  Input,
  Badge,
  Button,
  Popover,
  Typography,
  Tag
} from 'antd'
import SVGInline from 'react-svg-inline'
import classNames from 'classnames'
import './Filter.scss'

import settingsIcon from '../../images/settings-icn.svg'
import FilterItems from './FilterItems'
import FilterDropdown from './FilterDropdown'

const { Title, Text } = Typography

const Filter = ({ children, id, ...props }) => (
  <Row {...props} id="rsr-advanced-filter">
    {children}
  </Row>
)

const PopOverButton = ({ visible, onPopOver, count = 0 }) => visible
  ? <Icon type="close" style={{ fontSize: 24 }} onClick={onPopOver} />
  : (
    <div style={{ paddingTop: 8, display: 'flex', gap: 8, justifyContent: 'center' }}>
      <Badge count={count} style={{ backgroundColor: '#1890ff', color: '#fff' }}>
        <SVGInline svg={settingsIcon} onClick={onPopOver} />
      </Badge>
    </div>
  )

const FilterInput = ({
  visible = false,
  children,
  loading,
  onChange,
  onPopOver,
  count,
  ...props
}) => (
  <Col className="filter-search">
    <Input
      {...props}
      prefix={<Icon type="search" />}
      size="large"
      disabled={loading}
      addonAfter={(
        <Popover placement="bottomRight" content={<>{children}</>} visible={visible}>
          {
            loading
              ? <Icon type="loading" style={{ fontSize: 24 }} spin />
              : <PopOverButton {...{ visible, onPopOver, count }} />
          }
        </Popover>
      )}
      onChange={(e) => onChange(e.target.value)}
      allowClear
    />
  </Col>
)

const FilterInfo = ({
  isFiltering = false,
  label = 'Items',
  amount,
  loading,
  children,
  onClear
}) => (
  <Col className="filter-tags">
    <div className="d-flex">
      <div className="info">
        <div className="d-flex">
          <span className="text-right">
            <Title level={2}>
              {loading ? '...' : amount}
            </Title>
          </span>
          <span style={{ marginBottom: 15 }}>
            <Text strong>{isFiltering ? 'Matches' : label}</Text>
          </span>
        </div>
      </div>
      <Row type="flex" align="middle" justify="space-between" className={classNames('w-full', { 'd-none': !isFiltering })}>
        <Col lg={20} style={{ padding: 8, minHeight: 83 }}>
          {children}
        </Col>
        <Col lg={2} md={3} sm={4}>
          {isFiltering && (
            <Button type="link" className="btn-clear-all" onClick={onClear}>
              Clear all
              <Icon type="close-circle" />
            </Button>
          )}
        </Col>
      </Row>
    </div>
  </Col>
)

const FilterTag = ({ children, onClose, ...props }) => (
  <Tag {...props}>
    <Icon type="close" onClick={onClose} />
    {children}
  </Tag>
)

Filter.Input = FilterInput
Filter.Info = FilterInfo
Filter.Tag = FilterTag
Filter.Items = FilterItems
Filter.Dropdown = FilterDropdown

export default Filter
