import React, { useEffect, useState } from 'react'
import { Col, Divider, Row, Skeleton, Typography } from 'antd'
import groupBy from 'lodash/groupBy'
import sumBy from 'lodash/sumBy'
import api from '../../../utils/api'
import { setNumberFormat } from '../../../utils/misc'

const { Text } = Typography

const Disaggregations = ({
  id,
  updates,
  items,
  setItems
}) => {
  const initial = updates.filter((u) => (u.disaggregations === undefined)).length
  const [preload, setPreload] = useState((initial > 0))
  const [disaggregations, setDisaggregations] = useState(updates)
  useEffect(() => {
    const filtering = disaggregations.filter((f) => !(f.fetched))
    filtering.forEach((f) => {
      api
        .get(`/indicator_period_data_framework/${f.id}/`)
        .then((res) => {
          const updated = disaggregations.map((ds) => ds.id === f.id ? ({ ...res.data, fetched: true }) : ds)
          setDisaggregations(updated)
        })
    })
    if (preload && filtering.length === 0) {
      setPreload(false)
      const newItems = items.map((it) => ({
        ...it,
        indicators: it.indicators.map((i) => {
          if (i.id === id) {
            return ({
              ...i,
              periods: i.periods.map((p) => {
                const up = disaggregations.filter((u) => u.period === p.id)
                if (up.length) {
                  return ({
                    ...p,
                    updates: up
                  })
                }
                return p
              })
            })
          }
          return i
        })
      }))
      setItems(newItems)
    }
  }, [disaggregations, preload])

  const dsgValues = disaggregations.flatMap((dsg) => dsg.disaggregations)
  const dsgCategories = groupBy(dsgValues, 'category')
  const size = Math.round(24 / Object.keys(dsgCategories).length)
  return (
    <Skeleton loading={preload} active>
      <div className="disaggregations">
        <Row type="flex" align="middle" justify="start">
          {Object.keys(dsgCategories).map((category, cx) => (
            <Col lg={size} key={cx}>
              <Text strong>{category}</Text>
            </Col>
          ))}
        </Row>
        <Divider />
        <Row type="flex" align="middle" justify="start" gutter={[8, 16]}>
          {Object.keys(dsgCategories).map((category, cx) => {
            const dsgTypes = groupBy(dsgCategories[category], 'type')
            return (
              <Col lg={12} className="disaggregations-bar" key={cx}>
                {Object.keys(dsgTypes).map((type, tx) => {
                  const sumValues = sumBy(dsgTypes[type], 'value')
                  return (
                    <div className="dsg-item" key={tx}>
                      <div>
                        <span className="color">
                          <b>{setNumberFormat(sumValues)}</b>
                        </span>
                      </div>
                      <div>
                        <Text strong>{type}</Text>
                      </div>
                    </div>
                  )
                })}
              </Col>
            )
          })}
        </Row>
      </div>
    </Skeleton>
  )
}

export default Disaggregations
