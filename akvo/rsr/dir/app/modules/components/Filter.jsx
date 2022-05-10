import React from 'react'
import {
  Row,
  Col,
  Icon,
  Input,
  Button,
  Popover,
  Typography,
  Tag
} from 'antd'
import SVGInline from 'react-svg-inline'

import filterSvg from '../../images/icFilter.svg'

const { Title, Text } = Typography

const Filter = ({ children, ...props }) => {
  return (
    <Row {...props}>
      {children}
    </Row>
  )
}

const FilterTitle = ({
  col = {},
  level = 2,
  bottomLine = true,
  className = 'text-dark bold',
  children,
  ...props
}) => (
  <Col className="mb-3" {...col}>
    <Title level={level} className={className} {...props}>
      {children}
    </Title>
    {bottomLine && <span className="bottom-line" />}
  </Col>
)

const FilterInput = ({
  visible = false,
  children,
  loading,
  onChange,
  onPopOver,
  ...props
}) => (
  <Col className="filter-search">
    <Input
      {...props}
      prefix={<Icon type="search" />}
      size="large"
      disabled={loading}
      addonAfter={(
        <Popover
          placement="bottomRight"
          content={(
            <>
              {children}
            </>
          )}
          visible={visible}
        >
          <Button
            type="link"
            onClick={onPopOver}
            disabled={loading}
            style={{ width: 88, color: '#2b2f56' }}
          >
            {loading && <Icon type="loading" style={{ fontSize: 24 }} spin />}
            {!loading && (visible ? <Icon type="close" style={{ fontSize: 24 }} /> : <SVGInline svg={filterSvg} />)}
          </Button>
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
      <div className="w-full">
        <Row type="flex" align="middle" justify="space-between">
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
    </div>
  </Col>
)

const FilterTag = ({ children, onClose, ...props }) => (
  <Tag {...props}>
    <Icon type="close" onClick={onClose} />
    {children}
  </Tag>
)

Filter.Title = FilterTitle
Filter.Input = FilterInput
Filter.Info = FilterInfo
Filter.Tag = FilterTag

export default Filter
