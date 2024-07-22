import React from 'react'
import { Col, Descriptions, Icon, Modal, Row, Skeleton, Table, Typography } from 'antd'
import { orderBy, sortBy } from 'lodash'
import moment from 'moment'
import ShowMoreText from 'react-show-more-text'
import PeriodTitle from './PeriodTitle'
import { setNumberFormat } from '../../../utils/misc'
import { statusUpdate } from '../../../utils/constants'

const { Text, Title } = Typography

const SubmissionsModal = ({ updates = [], enumerators = [], scores = [], item, visible, onClose }) => {
  const { fetched, period, indicator } = item || {}
  const haveSubsEnumerators = orderBy(updates, ['createdAt'], ['desc']).reduce((ret, update) => {
    const { userDetails: { email } } = update
    if (!ret.hasOwnProperty(email)) {
      ret[email] = update
    }
    return ret
  }, {})
  const noSubsEnumerators = enumerators.filter(enumerator => !haveSubsEnumerators.hasOwnProperty(enumerator.email))
  // eslint-disable-next-line no-unused-vars
  const data = sortBy(Object.entries(haveSubsEnumerators).map(([_, update]) => {
    const { userDetails: { email, firstName, lastName } } = update
    return {
      ...update,
      user: (firstName?.length || lastName?.length) ? `${firstName} ${lastName}` : email
    }
  }), ['createdAt'], ['asc'])
  noSubsEnumerators.forEach(({ email, name }) => {
    data.push({ user: (name.length) ? name : email })
  })
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
        <SubmissionsTable {...{ data, scores }} />
      </Skeleton>
    </Modal>
  )
}

const SubmissionsTable = ({ data, scores }) => {
  const ds = data.map(it => ({
    id: it.id,
    user: it.user,
    date: it.createdAt ? moment(it.createdAt).format('DD MMM YYYY HH:mm') : '',
    details: it.createdAt ? <DetailsValue {...{ data: it, scores }} /> : <Text type="secondary">No submissions yet</Text>
  }))
  const columns = [
    { title: 'USER', dataIndex: 'user', width: '25%' },
    { title: 'LAST UPDATE AT', dataIndex: 'date', width: 140 },
    { title: 'DETAILS', dataIndex: 'details', width: '40%' },
  ]

  return <Table columns={columns} dataSource={ds} pagination={false} scroll={{ x: 550 }} />
}

const DetailsValue = ({ data, scores }) => (
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
        <Text strong>{statusUpdate[data.status] || data?.statusDisplay}</Text>
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
    {(narrative.length > 0) && (
      <ShowMoreText lines={3}>{narrative}</ShowMoreText>
    )}
  </>
)

export default SubmissionsModal
