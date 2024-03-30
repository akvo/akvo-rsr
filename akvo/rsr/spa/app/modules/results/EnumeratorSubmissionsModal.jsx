import React from 'react'
import { Col, Descriptions, Icon, Modal, Row, Skeleton, Table, Typography } from 'antd'
import { orderBy } from 'lodash'
import moment from 'moment'
import ShowMoreText from 'react-show-more-text'
import PeriodTitle from '../results-admin/components/PeriodTitle'
import { setNumberFormat } from '../../utils/misc'

const { Text, Title } = Typography

const EnumeratorSubmissionsModal = ({ enumerator, updates = [], scores = [], item, visible, onClose }) => {
  const { fetched, period, indicator } = item || {}
  const submissions = orderBy(updates, ['actionTime'], ['desc']).filter((u) => u?.userDetails?.id === enumerator.id)
  const data = submissions.flatMap((u) => u?.auditTrail?.filter((t) => t?.user?.id === enumerator.id))
  return (
    <Modal
      centered
      closable
      width={710}
      visible={visible}
      onCancel={onClose}
      cancelText="Close"
      okButtonProps={{ style: { display: 'none' } }}
      title={(
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Icon type="solution" />
          <Title level={4} strong>Submissions</Title>
        </div>
      )}
    >
      <PeriodTitle {...period} />
      <Descriptions>
        <Descriptions.Item label={<Text strong>Title</Text>}>
          <p>{indicator?.title}</p>
        </Descriptions.Item>
      </Descriptions>
      <Skeleton paragraph={{ rows: 3 }} loading={(!fetched)} active>
        <SubmissionsTable data={data} scores={scores} />
        <p />
      </Skeleton>
    </Modal>
  )
}

export const statuses = {
  D: 'Draft',
  P: 'Submitted',
  R: 'Declined',
  A: 'Approved'
}

const getStatus = (current, previous) => {
  if (!previous || current.actionFlag === 'ADDITION') {
    return statuses[current.data.status]
  }
  if (previous.status === 'Draft' && current.data.status === 'P') {
    return statuses.P
  }
  if (previous.status === 'Submitted' && current.data.status === 'P') {
    return 'Revision'
  }
  return statuses[current.data.status]
}

const SubmissionsTable = ({ data, scores }) => {
  const d = data.reduceRight((all, cur) => {
    const prev = all.slice(-1).pop()
    all.push({ ...cur, status: getStatus(cur, prev) })
    return all
  }, [])
  const ds = orderBy(d, ['actionTime'], ['desc']).map(it => ({
    id: it.actionTime,
    user: (it.user.firstName?.length || it.user.lastName?.length) ? `${it.user.firstName} ${it.user.lastName}` : it.user.email,
    date: it.actionTime ? moment(it.actionTime).format('DD MMM YYYY HH:mm') : '',
    details: it.actionTime ? <DetailsValue {...{ data: it.data, status: it.status, scores }} /> : ''
  }))
  const columns = [
    { title: 'USER', dataIndex: 'user', width: '25%' },
    { title: 'CREATED AT', dataIndex: 'date', width: 140 },
    { title: 'DETAILS', dataIndex: 'details', width: '40%' },
  ]

  return <Table columns={columns} dataSource={ds} pagination={false} scroll={{ x: 550 }} />
}

const DetailsValue = ({ data, status, scores }) => (
  <>
    <Row style={{ marginBottom: '16px' }}>
      <Col lg={8} md={8} sm={24} xs={24}><Text type="secondary">Value</Text></Col>
      <Col lg={16} md={16} sm={24} xs={24}>
        <DataValue {...{ ...data, scores }} />
      </Col>
    </Row>
    <Row style={{ marginBottom: '16px' }}>
      <Col span={8}><Text type="secondary">Status</Text></Col>
      <Col span={16}>
        <Text strong>{status}</Text>
      </Col>
    </Row>
    {data.reviewNote && (
      <Row>
        <Col span={8}><Text type="secondary">Notes</Text></Col>
        <Col span={16}>
          {data.reviewNote}
        </Col>
      </Row>
    )}
  </>
)

const DataValue = ({ value, scoreIndices, narrative, scores }) => (
  <>
    {value && <Text strong>{setNumberFormat(value)}</Text>}
    {(scoreIndices?.length > 0) && (
      <details>
        <summary><small>Score</small></summary>
        <br />
        <ul>
          {scoreIndices.map(sx => <li key={sx}>{scores[sx - 1]}</li>)}
        </ul>
      </details>
    )}
    {(narrative?.length > 0) && (
      <ShowMoreText lines={3}>{narrative}</ShowMoreText>
    )}
  </>
)

export default EnumeratorSubmissionsModal
