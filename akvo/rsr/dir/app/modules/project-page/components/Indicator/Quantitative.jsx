import React from 'react'
import {
  Row,
  Col,
  Switch,
  Typography,
  Form
} from 'antd'
import moment from 'moment'
import classNames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import uniqBy from 'lodash/uniqBy'

import { setNumberFormat } from '../../../../utils/misc'
import AreaChart from '../../../components/AreaChart'
import BarChart from '../../../components/BarChart'
import Disaggregations from '../Disaggregations'

const { Text, Title } = Typography

const Quantitative = ({
  id,
  period,
  periods,
  dsgOpen,
  items,
  setItems,
  setDsgOpen,
  dimensionNames
}) => {
  const sumActual = periods
    .map(p => isEmpty(p.actualValue) ? 0 : parseInt(p.actualValue, 10))
    .reduce((prev, curr) => prev + curr, 0)
  const sumTarget = periods
    .map(p => (isEmpty(p.targetValue) || p.targetValue === null) ? 0 : parseInt(p.targetValue, 10))
    .reduce((prev, curr) => prev + curr, 0)
  const yearlyValues = periods
    .map(p => {
      const { actualValue, targetValue, periodEnd } = p
      return {
        year: periodEnd ? moment(periodEnd, 'YYYY-MM-DD').format('YYYY') : '-',
        actualValue: isEmpty(actualValue) ? 0 : parseInt(actualValue, 10),
        targetValue: isEmpty(targetValue) ? 0 : parseInt(targetValue, 10)
      }
    })
    .filter(p => ((period !== '0' && p.year === period) || period === '0'))
    .sort((a, b) => a.year - b.year)
  let actualValues = [{ label: null, y: 0, x: 0 }, ...yearlyValues
    .map((v, index) => ({
      label: v.year,
      y: v.actualValue,
      x: index + 1
    }))]
  actualValues = uniqBy(actualValues, 'label')
  let targetValues = [{ label: null, y: 0, x: 0 }, ...yearlyValues
    .map((v, index) => ({
      label: v.year,
      y: v.targetValue,
      x: index + 1
    }))]
  targetValues = uniqBy(targetValues, 'label')
  const updates = periods.flatMap((p) => p.updates.filter((u) => u.status === 'A'))
  const yLabel = period === '0' ? null : period
  return (
    <Row>
      <Col lg={10} className="indicatorSummary">
        <Row gutter={[8, 8]} className="summary">
          <Col className="aggregatedActualValue">
            <Text>AGGREGATED ACTUAL VALUE</Text>
          </Col>
          <Col className="value">
            <Title level={3}>{setNumberFormat(sumActual)}</Title>
          </Col>
          <Col>
            <Text>OF <strong>{setNumberFormat(sumTarget)}</strong> TARGET</Text>
          </Col>
        </Row>
      </Col>
      <Col lg={14}>
        {(dimensionNames.length > 0 && updates.length > 0) && (
          <Form layout="inline" className="mb-1">
            <Form.Item label="Disaggregated View">
              <Switch checked={dsgOpen} onChange={(checked) => setDsgOpen(checked)} size="small" />
            </Form.Item>
          </Form>
        )}
        <div
          className={classNames({
            'has-dsg': (dimensionNames.length > 0 && updates.length > 0),
            'chart-wrapper': (!dsgOpen),
            'dsg-wrapper': (dsgOpen)
          })}
        >
          {dsgOpen && <Disaggregations {...{ id, updates, items, setItems }} />}
          {(!dsgOpen && (sumActual > 0 || sumTarget > 0) && period === '0') && (
            <AreaChart
              width={610}
              height={255}
              precision={2}
              horizontalGuides={1}
              verticalGuides={actualValues.length}
              actualValues={actualValues}
              targetValues={targetValues}
              id={id}
            />
          )}
          {(yearlyValues.length > 0 && (!dsgOpen && (period !== '0'))) && (
            <BarChart
              yLabel={yLabel}
              width={810}
              height={255}
              precision={2}
              target={yearlyValues[0].targetValue}
              actual={yearlyValues[0].actualValue}
              id={id}
            />
          )}
        </div>
      </Col>
    </Row>
  )
}

export default Quantitative
