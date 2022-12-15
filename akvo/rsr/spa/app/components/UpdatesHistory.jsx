import React from 'react'
import {
  Row,
  Col,
  Collapse,
  Table,
} from 'antd'
import classNames from 'classnames'

import ExpandIcon from './ExpandIcon'
import { toCapitalize } from '../utils/string'
import { setNumberFormat } from '../utils/misc'

const { Panel } = Collapse

const DEFAULT_ACTIVE_KEYS = [
  'value',
  'date',
  'user',
  'status',
]

const setColumns = (value, key) => ({
  key,
  title: toCapitalize(value),
  dataIndex: value,
})

const UpdatesHistory = ({
  columns,
  tables,
  activeKeys = DEFAULT_ACTIVE_KEYS,
  mneView = false,
}) => {
  const getActiveKeys = (value) => activeKeys?.length
    ? [...activeKeys, ...DEFAULT_ACTIVE_KEYS]?.includes(value)
    : value

  const MAX_COLUMN = mneView ? 4 : 6
  const _columns = Object.keys(columns)?.length
    ? Object.keys(columns)?.filter(getActiveKeys)
    : activeKeys
  const hColumns = _columns?.map(setColumns)
  const vWidth = mneView ? 150 : 200
  const vColumns = ['key', ...tables?.map((_, tx) => `user${tx + 1}`)]
    ?.map(setColumns)
    ?.map((c, cx) => cx === 0 ? ({ ...c, fixed: 'left', width: vWidth }) : ({ ...c, width: 100 }))
  const vDataSource = _columns
    ?.map((field, fx) => {
      const users = tables
        ?.filter((values) => (Object.keys(values)?.length))
        ?.map((values, key) => ({
          [`user${key + 1}`]: Number.isNaN(values[field])
            ? values[field]
            : setNumberFormat(values[field])
        }))
      const _user = {}
      for (let x = 0; x < users.length; x += 1) {
        Object.assign(_user, users[x])
      }
      return ({ ..._user, key: toCapitalize(field), rowKey: fx })
    })
    ?.sort((a, b) => b.rowKey - a.rowKey)
  const dataSource = (_columns?.length > MAX_COLUMN) ? vDataSource : tables
  const dataColumn = (_columns?.length > MAX_COLUMN) ? vColumns : hColumns
  const tableProps = mneView ? { pagination: false, scroll: { x: 500 } } : { pagination: false }
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
              className={classNames('table-history', { mneView })}
              dataSource={dataSource}
              columns={dataColumn}
              {...tableProps}
            />
          </Panel>
        </Collapse>
      </Col>
    </Row>
  )
}

export default UpdatesHistory
