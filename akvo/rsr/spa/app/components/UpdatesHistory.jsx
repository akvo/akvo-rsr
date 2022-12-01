import React from 'react'
import moment from 'moment'
import {
  Row,
  Col,
  Collapse,
  Table,
} from 'antd'

import ExpandIcon from './ExpandIcon'
import { toCapitalize } from '../utils/string'
import { getUserFullName, setNumberFormat } from '../utils/misc'

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
  period = {
    updates: [],
  },
  activeKeys = DEFAULT_ACTIVE_KEYS
}) => {
  /* eslint-disable no-use-before-define */
  const columns = dataSource?.length
    ? Object
      .keys(dataSource?.shift())
      ?.filter((value) => activeKeys?.length ? activeKeys?.includes(value) : value)
      ?.map(setColumns)
    : activeKeys?.map(setColumns)
  const dataSource = period
    ?.updates
    ?.map((update) => {
      const logItem = {
        value: setNumberFormat(update?.value),
        date: moment(update?.createdAt).format('DD MMM YYYY HH:mm'),
        user: getUserFullName(update?.userDetails),
      }
      if (update?.disaggregations?.length) {
        const _dsg = update.disaggregations.map((d) => ({ [d.type]: d.value }))
        const _logItem = {}
        for (let x = 0; x < _dsg.length; x += 1) {
          Object.assign(_logItem, _dsg[x])
        }
        return ({
          ..._logItem,
          ...logItem
        })
      }
      return logItem
    })
  const dsgDataKeys = dataSource.length ? Object.keys(dataSource.shift())?.filter((a) => !DEFAULT_ACTIVE_KEYS.includes(a)) : []
  const dsgKeys = activeKeys?.filter((a) => !DEFAULT_ACTIVE_KEYS.includes(a))
  const dsgDiff = dsgKeys.filter((a) => !dsgDataKeys.includes(a))

  if ((dsgKeys.length && dsgDiff.length) || dataSource?.length === 0) {
    return null
  }

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
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </Panel>
        </Collapse>
      </Col>
    </Row>
  )
}

export default UpdatesHistory
