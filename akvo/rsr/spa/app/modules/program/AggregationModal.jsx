import React, { useState, useEffect } from 'react'
import {
  Button,
  Row,
  Col,
  List,
  Modal,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { connect } from 'react-redux'
import chunk from 'lodash/chunk'
import moment from 'moment'

import Icon from '../../components/Icon'
import {
  aggregatedIcons,
  jobStatusColor,
  toolTips
} from './config'
import { printIndicatorPeriod } from '../../utils/dates'
import { getAllPeriods, getIndicatorByPeriodID, getProjectByPeriodID } from './services'

const { Text, Title } = Typography

const AggregationModal = ({
  popUp,
  handleOnOk,
  programmeRdr,
  periodStart,
  periodEnd,
  periodId,
  jobs,
}) => {
  const [history, setHistory] = useState([])
  const [page, setPage] = useState(0)
  const pages = chunk(jobs || [], 12)
  const _periods = getAllPeriods(programmeRdr)

  const handleOnLoadMore = (_page) => {
    setPage(_page)
    setHistory([...history, ...pages[_page]])
  }

  const LoadMoreButton = () => {
    if (jobs && (history.length < jobs.length)) {
      return (
        <div className="load-more-container">
          <Button onClick={() => handleOnLoadMore(page + 1)}>
            Load more...
          </Button>
        </div>
      )
    }
    return null
  }

  const dataIndicator = getIndicatorByPeriodID(_periods, periodId)

  useEffect(() => {
    if (jobs && history.length === 0) {
      setHistory(pages[page])
    }
  }, [jobs, history])
  return (
    <Modal
      closable={false}
      visible={popUp}
      onOk={handleOnOk}
      cancelButtonProps={{ style: { display: 'none' } }}
      title="Aggregation Job History"
      width={650}
    >
      <div className="modal-descriptions">
        <Text type="secondary">Indicator</Text>
        <Title level={4}>
          {dataIndicator?.indicator?.title || ''}
        </Title>
        <Text type="secondary">Period</Text>
        <Title level={4}>
          {printIndicatorPeriod(periodStart, periodEnd)}
        </Title>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={history}
        loadMore={(
          <LoadMoreButton />
        )}
        header={(
          <Text strong>Details</Text>
        )}
        renderItem={item => {
          const _project = getProjectByPeriodID(_periods, item?.period)
          return (
            <List.Item>
              <List.Item.Meta
                avatar={(
                  <Tooltip title={toolTips[item?.status]}>
                    <Icon type={aggregatedIcons[item?.status] || 'info'} className={item?.status} />
                  </Tooltip>
                )}
                title={(
                  <>
                    <Text type="secondary">{moment(item?.updatedAt).format('DD MMM YYYY H:mm:ss')}</Text>
                    {` - ${_project?.projectTitle}`}
                  </>
                )}
                description={(
                  <Row type="flex" justify="space-between">
                    <Col>
                      <Tag color={jobStatusColor[item?.status] || 'red'}>{item?.status}</Tag>
                    </Col>
                  </Row>
                )}
              />
            </List.Item>
          )
        }}
      />
    </Modal>
  )
}

export default connect(
  ({ programmeRdr }) => ({ programmeRdr }), null
)(AggregationModal)
