import React from 'react'
import moment from 'moment'
import { Col, Row, Table, Typography } from 'antd'

const { Text } = Typography

const DetailsValue = ({ data, textReport, disaggregations, scores }) => {
  const status = {
    D: 'Draft',
    P: 'Pending Approval',
    R: 'Declined',
    A: 'Approved'
  }
  const span = textReport ? [3, 21] : [8, 16]
  return (
    <Row gutter={[8, 8]}>
      {data?.disaggregations ? (
        <>
          <Col span={8}><Text type="secondary">Value</Text></Col>
          <Col span={16}>
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
          </Col>
        </>
      ) : null}
      {(data?.value && !data?.disaggregations)
        ? (
          <>
            <Col span={span[0]}><Text type="secondary">Value</Text></Col>
            <Col span={span[1]}>
              <Text strong>{data.value}</Text>
            </Col>
          </>
        ) : null}
      {data?.status ? (
        <>
          <Col span={span[0]}><Text type="secondary">Status</Text></Col>
          <Col span={span[1]}>
            <Text strong>{status[data.status] || data.status}</Text>
          </Col>
        </>
      ) : null}
      {data?.scoreIndices?.length > 0 && (
        <>
          <Col span={span[0]}><Text type="secondary">Score</Text></Col>
          <Col span={span[1]}>
            <Text strong>{data.scoreIndices.map(sx => scores[sx - 1])}</Text>
          </Col>
        </>
      )}
    </Row>
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
      width: 200,
    },
    {
      title: 'ACTION',
      dataIndex: 'actionFlag',
      width: 150,
    },
    {
      title: 'USER',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: 'DETAILS',
      dataIndex: 'data',
    },
  ]

  const data = audits
    .map((a) => ({
      ...a,
      name: `${a.user.firstName} ${a.user.lastName}`,
      data: <DetailsValue {...{ ...a, textReport, disaggregations, scores }} />,
      actionFlag: <ActionFlagValue data={a.actionFlag} status={a?.data?.status} />,
      actionTime: moment(a.actionTime).format('DD MMM YYYY HH:mm')
    }))
  return <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} />
}
