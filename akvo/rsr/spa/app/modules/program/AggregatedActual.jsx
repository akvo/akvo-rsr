import React, { useState, useEffect } from 'react'
import {
  Button,
  Row,
  Col,
  List,
  Modal,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { connect } from 'react-redux'
import chunk from 'lodash/chunk'
import moment from 'moment'

import Icon from '../../components/Icon'
import Aggregation from './Aggregation'
import { aggregatedIcons, jobStatusColor, toolTips } from './config'
import { getAllJobByRootPeriod } from './services'
import * as actions from './store/actions'
import { printIndicatorPeriod } from '../../utils/dates'

const { Text, Title } = Typography

const AggregatedActual = ({
  value,
  status,
  amount,
  total,
  periodStart,
  periodEnd,
  periodId,
  programmeRdr,
  setRootPeriodJobStatus,
  jobs,
}) => {
  const [popUp, setPopUp] = useState(false)
  const [page, setPage] = useState(0)
  const [history, setHistory] = useState([])
  const [items, setItems] = useState([])
  const [preload, setPreload] = useState({
    fetched: (jobs === undefined),
    created: (jobs === undefined),
  })
  const pages = chunk(jobs || [], 12)
  const _periods = programmeRdr
    ?.flatMap((r) => r?.indicators)
    ?.flatMap((i) => i?.periods?.map((p) => ({ ...p, indicator: { id: i?.id, title: i?.title } })))

  const getProjectByPeriodID = (ID) => {
    const _contrib = _periods?.flatMap((p) => p?.contributors)
    const _contributors = [
      ..._contrib,
      ..._contrib?.flatMap((cb) => cb?.contributors)
    ]
    return _contributors?.find((cb) => cb?.periodId === ID)
  }

  const getIndicatorByPeriodID = (ID) => _periods?.find((p) => p?.periodId === ID)

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

  useEffect(() => {
    if (items.length === 0 && preload.fetched && preload.created) {
      setPreload({
        ...preload,
        fetched: false,
      })
      getAllJobByRootPeriod(periodId)
        .then((res) => {
          if (res.length === 0) {
            setPreload({
              created: false,
              fetched: false,
            })
          }
          setItems(res)
        })
        .catch(() => {
          setPreload({
            created: false,
            fetched: false,
          })
        })
    }
    if (items.length && !preload.fetched && preload.created) {
      setPreload({
        ...preload,
        created: false,
      })
      setRootPeriodJobStatus(periodId, items)
    }
    if (jobs && history.length === 0) {
      setHistory(pages[page])
    }
  }, [items, preload, history, jobs])

  const iconType = aggregatedIcons[status] || null
  const dataIndicator = getIndicatorByPeriodID(periodId)
  return (
    <>
      <Aggregation>
        <Aggregation.Col icon>
          {iconType && (
            <Aggregation.Popover status={status} amount={amount} total={total} callback={() => setPopUp(!popUp)}>
              <Icon type={iconType} className={status} width="20px" height="20px" />
            </Aggregation.Popover>
          )}
          {(preload.fetched || preload.created) && <Spin indicator={<Icon type="loading" />} spinning />}
        </Aggregation.Col>
        <Aggregation.Col>
          <Aggregation.Value>
            {value}
          </Aggregation.Value>
        </Aggregation.Col>
      </Aggregation>
      <Modal
        closable={false}
        visible={popUp}
        onOk={() => setPopUp(!popUp)}
        cancelButtonProps={{ style: { display: 'none' } }}
        title="Cron Job History"
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
            const _project = getProjectByPeriodID(item?.period)
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={(
                    <Tooltip title={toolTips[item?.status]}>
                      <Icon type={aggregatedIcons[item?.status] || 'info'} className={item?.status} />
                    </Tooltip>
                  )}
                  title={_project?.projectTitle}
                  description={(
                    <Row type="flex" justify="space-between">
                      <Col span={8}>
                        <Tag color={jobStatusColor[item?.status] || 'red'}>{item?.status}</Tag>
                      </Col>
                      <Col span={16} className="text-right">
                        {moment(item?.updatedAt).format('DD MMM YYYY H:mm:ss')}
                      </Col>
                    </Row>
                  )}
                />
              </List.Item>
            )
          }}
        />
      </Modal>
    </>
  )
}

export default connect(
  ({ programmeRdr }) => ({ programmeRdr }), actions
)(AggregatedActual)
