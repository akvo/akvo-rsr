import React from 'react'
import {
  Row,
  Col,
  Icon,
  Button,
  Typography,
  Tag
} from 'antd'
import classNames from 'classnames'
import './Filter.scss'

import FilterItems from './FilterItems'
import FilterDropdown from './FilterDropdown'
import FilterInput from './FilterInput'

const { Title, Text } = Typography

const Filter = ({ children, id, ...props }) => (
  <Row {...props} id="rsr-advanced-filter">
    {children}
  </Row>
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
