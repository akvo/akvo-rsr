import React from 'react'
import moment from 'moment'
import { Col, Row, Table, Typography } from 'antd'
import { setNumberFormat } from '../utils/misc'
import { statusTerminology } from '../utils/constants'

const { Text } = Typography

const flagDescription = {
  ADDITION: 'VALUE ADDED',
  R: 'VALUE REVIEWED',
  P: 'VALUE SUBMITTED',
}

const DataValue = ({ value, disaggregations, scoreIndices, scores }) => (
  <>
    {value && <Text strong>{setNumberFormat(value)}</Text>}
    {(disaggregations.length > 0) && (
      <details>
        <summary><small>Disaggregations</small></summary>
        <br />
        <ul>
          {disaggregations.map((ds) => (
            <li key={ds.id}>
              <Text strong>{ds?.type} :</Text><br />
              {ds?.value}
            </li>
          ))}
        </ul>
      </details>
    )}
    {(scoreIndices?.length > 0) && (
      <details>
        <summary><small>Score</small></summary>
        <br />
        <ul>
          {scoreIndices.map(sx => <li key={sx}>{scores[sx - 1]}</li>)}
        </ul>
      </details>
    )}
  </>
)

const DetailsValue = ({ data, disaggregations, scores }) => (
  <>
    <Row style={{ marginBottom: '16px' }}>
      <Col lg={8} md={8} sm={24} xs={24}><Text type="secondary">Value</Text></Col>
      <Col lg={16} md={16} sm={24} xs={24}>
        <DataValue {...{ ...data, disaggregations, scores }} />
      </Col>
    </Row>
    <Row style={{ marginBottom: '16px' }}>
      <Col span={8}><Text type="secondary">Status</Text></Col>
      <Col span={16}>
        <Text strong>{statusTerminology[data.status] || data?.statusDisplay}</Text>
      </Col>
    </Row>
    <Row>
      <Col span={8}><Text type="secondary">Notes</Text></Col>
      <Col span={16}>
        {data.reviewNote || '-'}
      </Col>
    </Row>
  </>
)

const ActionFlagValue = ({ data, status }) => <Text>{flagDescription[data] ? flagDescription[data] : status ? flagDescription[status] || data : 'VALUE MODIFIED'}</Text>

const DescriptionValue = ({ user, actionFlag, data, disaggregations, scores }) => (
  <ul>
    <li>
      <strong>Action</strong><br />
      <ActionFlagValue data={actionFlag} status={data?.status} />
    </li>
    <li>
      <strong>User</strong><br />
      {`${user.firstName} ${user.lastName}`}
    </li>
    <li>
      <strong>Value</strong><br />
      <DataValue {...{ ...data, disaggregations, scores }} />
    </li>
    <li>
      <strong>Status</strong><br />
      {statusTerminology[data.status] || data?.statusDisplay}
    </li>
    <li>
      <strong>Notes</strong><br />
      {data.reviewNote || '-'}
    </li>
  </ul>
)

export const AuditTrail = ({ audits, disaggregations, scores, mobileView = false }) => {
  const columns = [
    {
      title: 'TIME',
      dataIndex: 'actionTime',
      width: 140,
      fixed: 'left',
    },
    {
      title: 'USER',
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: 'DETAILS',
      dataIndex: 'data',
      width: '40%',
    },
    {
      title: 'ACTION',
      dataIndex: 'actionFlag',
      width: '20%'
    },
  ]

  const data = audits
    .map((a, ax) => ({
      id: ax,
      name: (a?.user?.firstName?.length || a?.user?.lastName?.length) ? `${a.user.firstName} ${a.user.lastName}` : a.user.email,
      data: <DetailsValue {...{ ...a, disaggregations, scores }} />,
      actionFlag: <ActionFlagValue data={a.actionFlag} status={a?.data?.status} />,
      actionTime: moment(a.actionTime).format('DD MMM YYYY HH:mm'),
      description: <DescriptionValue {...{ ...a, disaggregations, scores }} />,
    }))

  let tableProps = {
    columns,
    dataSource: data,
    pagination: false,
    scroll: { x: 550 },
  }
  if (mobileView) {
    tableProps = {
      ...tableProps,
      expandedRowRender: record => <span style={{ margin: 0 }}>{record.description}</span>
    }
  }
  return <Table {...tableProps} rowKey="id" />
}
