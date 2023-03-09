import React, { useState } from 'react'
import {
  Row,
  Col,
  Collapse,
  Table,
  Tooltip,
  Button,
  Icon,
} from 'antd'
import classNames from 'classnames'

import ExpandIcon from './ExpandIcon'
import { toCapitalize } from '../utils/string'
import { AllSubmissionsModal } from './AllSubmissionsModal'

const { Panel } = Collapse
const { Column } = Table

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
  updates,
  disaggregations,
  disaggregationTargets,
  activeKeys = DEFAULT_ACTIVE_KEYS,
  mneView = false,
}) => {
  const [visible, setVisible] = useState(false)

  const getActiveKeys = (value) => activeKeys?.length
    ? [...activeKeys, ...DEFAULT_ACTIVE_KEYS]?.includes(value)
    : value

  const MAX_COLUMN = mneView ? 4 : 6
  const _columns = Object.keys(columns)?.length
    ? Object.keys(columns)?.filter(getActiveKeys)
    : activeKeys
  const hColumns = _columns?.map(setColumns)
  const vColumns = ['key', ...tables?.map((_, tx) => `user${tx + 1}`)]
    ?.map(setColumns)
    ?.map((c, cx) => cx === 0 ? ({ ...c, fixed: 'left', width: 200 }) : ({ ...c, width: 200 }))
  const vDataSource = _columns
    ?.map((field, fx) => {
      const users = tables
        ?.filter((values) => (Object.keys(values)?.length))
        ?.map((values, key) => ({
          [`user${key + 1}`]: values[field]
        }))
      const _user = {}
      for (let x = 0; x < users.length; x += 1) {
        Object.assign(_user, users[x])
      }
      return ({
        ..._user,
        key: toCapitalize(field),
        rowKey: fx
      })
    })
    ?.sort((a, b) => b.rowKey - a.rowKey)
  const dataSource = (_columns?.length > MAX_COLUMN) ? vDataSource : tables
  const dataColumn = (_columns?.length > MAX_COLUMN) ? vColumns : hColumns
  const tableProps = mneView ? { pagination: false, scroll: { x: 500 } } : { pagination: false }
  return (
    <Row>
      <Col className="table-history-sm">
        <Tooltip title="Updates history">
          <Button type="link" onClick={() => setVisible(true)}>
            <Icon type="unordered-list" />
          </Button>
        </Tooltip>
        <AllSubmissionsModal
          {...{
            visible,
            updates,
            disaggregations,
            disaggregationTargets,
          }}
          onCancel={() => setVisible(false)}
        />
      </Col>
      <Col className="table-history-md">
        <Collapse
          bordered={false}
          expandIconPosition="right"
          expandIcon={({ isActive }) => (
            <Tooltip title="Updates history">
              <ExpandIcon isActive={isActive} open="close" close="unordered-list" />
            </Tooltip>
          )}
          className="collapse-history"
        >
          <Panel>
            <Table
              className={classNames('table-history', { mneView })}
              dataSource={dataSource}
              {...tableProps}
            >
              {dataColumn?.map(col => {
                if (col?.dataIndex === 'key') {
                  return (
                    <Column
                      {...col}
                      render={value => {
                        return <Tooltip title={value} placement="top">{value}</Tooltip>
                      }}
                    />
                  )
                }
                return <Column {...col} />
              })}
            </Table>
          </Panel>
        </Collapse>
      </Col>
    </Row>
  )
}

export default UpdatesHistory
