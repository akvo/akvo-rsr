import React from 'react'
import {
  Row,
  Col,
  Collapse,
  Table,
} from 'antd'

import ExpandIcon from './ExpandIcon'
import { toCapitalize } from '../utils/string'

const { Panel } = Collapse

const DEFAULT_ACTIVE_KEYS = [
  'value',
  'date',
  'user',
]

const setColumns = (value, key) => ({
  key,
  title: toCapitalize(value),
  dataIndex: value,
})

const UpdatesHistory = ({
  columns,
  tables,
  activeKeys = DEFAULT_ACTIVE_KEYS
}) => {
  const _columns = Object.keys(columns)?.length
    ? Object.keys(columns)
      ?.filter((value) => activeKeys?.length
        ? activeKeys?.includes(value)
        : value
      )
      ?.map(setColumns)
    : activeKeys?.map(setColumns)

  return (
    <Row>
      <Col>
        <Collapse
          bordered={false}
          expandIconPosition="right"
          expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} open="close" close="unordered-list" />}
          className="collapse-history"
        >
          <Panel>
            <Table
              className="table-history"
              dataSource={tables}
              columns={_columns}
              pagination={false}
            />
          </Panel>
        </Collapse>
      </Col>
    </Row>
  )
}

export default UpdatesHistory
