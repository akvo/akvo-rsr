import React from 'react'
import {
  Row,
  Col,
  Select,
  Progress,
  Typography
} from 'antd'
import moment from 'moment'
import sumBy from 'lodash/sumBy'

import Highlighted from '../../../components/Highlighted'
import { indicatorTypes } from '../../../../utils/constants'

const { Text } = Typography

const PanelHeader = ({
  id: indicatorID,
  type,
  title,
  search,
  period,
  onPeriod,
  periods,
  showProgress
}) => {
  periods = periods.map((p) => ({
    ...p,
    targetValue: parseInt(p.targetValue, 10),
    actualValue: parseInt(p.actualValue, 10)
  }))
  const actual = sumBy(periods, 'actualValue')
  const target = sumBy(periods, 'targetValue')
  const progress = (target > 0 && actual) ? parseInt((actual / target) * 100, 10) : 0
  const optionPeriods = periods.map((p) => moment(p.periodEnd, 'YYYY-MM-DD').format('YYYY'))
  return (
    <Row onClick={event => event.stopPropagation()}>
      <Col span={14} style={{ paddingRight: 5 }}>
        <Highlighted text={title} highlight={search} /><br />
        {(!showProgress) && (
          <div className="indicatorTypes">
            <Text>{type ? indicatorTypes.find((it) => it.value === parseInt(type, 10)).label : 'Loading...'}</Text>
            <Text strong>{periods ? `${periods.length} Periods` : ''}</Text>
          </div>
        )}
      </Col>
      <Col span={10} style={{ textAlign: 'right', paddingTop: 6 }}>
        {(progress > 0 && showProgress) && <Progress type="circle" percent={progress} width={50} height={50} />}
        {(!showProgress) && (
          <Row>
            <Col span={12} offset={12}>
              <Select defaultValue={period} className="w-full" onChange={(value) => onPeriod(indicatorID, value)}>
                <Select.Option value="0">All Periods</Select.Option>
                {optionPeriods.map((option, ox) => <Select.Option value={option} key={ox}>{option}</Select.Option>)}
              </Select>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  )
}

export default PanelHeader
