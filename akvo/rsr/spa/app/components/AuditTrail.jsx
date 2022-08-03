import React from 'react'
import moment from 'moment'
import { Col, Row, Table, Typography } from 'antd'
import { setNumberFormat } from '../utils/misc'

const { Text } = Typography

const DetailsValue = ({ data, disaggregations, scores }) => {
  const status = {
    D: 'Draft',
    P: 'Pending Approval',
    R: 'Declined',
    A: 'Approved'
  }
  return (
    <>
      <Row style={{ marginBottom: '16px' }}>
        <Col span={8}><Text type="secondary">Value</Text></Col>
        <Col span={16}>
          {data.value && <Text strong>{setNumberFormat(data.value)}</Text>}
          {data?.disaggregations && (
            <details>
              <summary>Disaggregations</summary>
              <br />
              <ul>
                {disaggregations.length > 0 && disaggregations.map((ds) => (
                  <li key={ds.id}>
                    <Text strong>{ds?.type} :</Text><br />
                    {ds?.value}
                  </li>
                ))}
              </ul>
            </details>
          )}
          {data?.scoreIndices?.length > 0 && (
            <details>
              <summary>Score</summary>
              <br />
              <ul>
                {data.scoreIndices.map(sx => <li key={sx}>{scores[sx - 1]}</li>)}
              </ul>
            </details>
          )}
        </Col>
      </Row>
      <Row style={{ marginBottom: '16px' }}>
        <Col span={8}><Text type="secondary">Status</Text></Col>
        <Col span={16}>
          <Text strong>{status[data.status] || data.status}</Text>
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
}

const ActionFlagValue = ({ data, status }) => {
  switch (data) {
    case 'ADDITION':
      return <Text>VALUE ADDED</Text>
    default:
      return status
        ? status === 'R' ? <Text>VALUE REVIEWED</Text> : status === 'P' ? <Text>VALUE SUBMITTED</Text> : data
        : <Text>VALUE MODIFIED</Text>
  }
}

export const AuditTrail = ({ audits, textReport, disaggregations, scores }) => {
  const columns = [
    {
      title: 'TIME',
      dataIndex: 'actionTime',
      width: 160,
      fixed: 'left',
    },
    {
      title: 'ACTION',
      dataIndex: 'actionFlag',
      width: '20%'
    },
    {
      title: 'USER',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: 'DETAILS',
      dataIndex: 'data',
      width: '35%',
    },
  ]

  const data = audits
    .map((a) => ({
      ...a,
      name: (a?.user?.firstName?.length || a?.user?.lastName?.length) ? `${a.user.firstName} ${a.user.lastName}` : a.user.email,
      data: <DetailsValue {...{ ...a, textReport, disaggregations, scores }} />,
      actionFlag: <ActionFlagValue data={a.actionFlag} status={a?.data?.status} />,
      actionTime: moment(a.actionTime).format('DD MMM YYYY HH:mm')
    }))
  return <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 240, x: 800 }} />
}
