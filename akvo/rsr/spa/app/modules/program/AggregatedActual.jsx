import React, { useState, useEffect } from 'react'
import { Button, List, Modal, Spin } from 'antd'
import { connect } from 'react-redux'
import chunk from 'lodash/chunk'

import Icon from '../../components/Icon'
import Aggregation from './Aggregation'
import { aggregatedIcons } from './config'
import { getAllJobByRootPeriod } from './services'
import * as actions from './store/actions'

const AggregatedActual = ({
  value,
  status,
  amount,
  total,
  periodStart,
  periodEnd,
  periodId,
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
      >
        <List
          itemLayout="horizontal"
          dataSource={history}
          loadMore={(
            <LoadMoreButton />
          )}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Icon type={aggregatedIcons[item?.status] || 'info'} />}
                title={item?.period}
                description={item?.updatedAt}
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  )
}

export default connect(
  ({ programmeRdr }) => ({ programmeRdr }), actions
)(AggregatedActual)
