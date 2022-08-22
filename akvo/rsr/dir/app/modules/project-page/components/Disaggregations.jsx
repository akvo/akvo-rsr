import React, { useEffect, useState } from 'react'
import { Col, Divider, Row, Skeleton, Typography } from 'antd'
import groupBy from 'lodash/groupBy'
import sumBy from 'lodash/sumBy'
import { setNumberFormat } from '../../../utils/misc'

const { Text } = Typography

const Disaggregations = ({ updates }) => {
  const [preload, setPreload] = useState(true)
  useEffect(() => {
    const fetched = updates.filter((u) => (u.fetched))
    if (preload && (updates.length === fetched.length)) {
      setPreload(false)
    }
  }, [preload, updates])

  const dsgValues = updates.flatMap((u) => u.disaggregations)
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
