import React from 'react'
import {
  Row,
  Col,
  Select,
  Progress,
  Typography
} from 'antd'
import sumBy from 'lodash/sumBy'
import { useSelector, useDispatch } from 'react-redux'

import Highlighted from '../../../components/Highlighted'
import { indicatorTypes } from '../../../../utils/constants'
import { setApply } from '../../../../features/periods/filterSlice'

const { Text } = Typography

const PanelHeader = ({
  id: indicatorID,
  type,
  title,
  periods,
  search,
  showProgress
}) => {
  const { options, apply } = useSelector((state) => state.filterPeriods)
  const dispatch = useDispatch()

  const optionPeriods = options[indicatorID] || []
  const defaultValue = apply[indicatorID] || null
  const values = periods.map((p) => ({
    ...p,
    targetValue: parseInt(p.targetValue, 10),
    actualValue: parseInt(p.actualValue, 10)
  }))
  const actual = sumBy(values, 'actualValue')
  const target = sumBy(values, 'targetValue')
  const progress = (target > 0 && actual) ? parseInt((actual / target) * 100, 10) : 0
  return (
    <Row onClick={event => event.stopPropagation()}>
      <Col lg={14} md={14} sm={24} xs={24} style={{ paddingRight: 5 }}>
        <Highlighted text={title} highlight={search} /><br />
        {(!showProgress) && (
          <div className="indicatorTypes">
            <Text>{type ? indicatorTypes.find((it) => it.value === parseInt(type, 10)).label : 'Loading...'}</Text>
            <Text strong>{periods ? `${periods.length} Periods` : ''}</Text>
          </div>
        )}
      </Col>
      <Col lg={10} md={10} sm={24} xs={24} className="indicatorExtra">
        {(progress > 0 && showProgress) && <Progress type="circle" percent={progress} width={50} height={50} />}
        {(!showProgress && optionPeriods.length > 0) && (
          <Row>
            <Col lg={{ span: 12, offset: 12 }} md={{ span: 14, offset: 10 }} sm={24} xs={24}>
              <Select
                className="w-full"
                defaultValue={defaultValue}
                onChange={(value) => dispatch(setApply({ id: indicatorID, value }))}
              >
                <Select.Option value="0">All Periods</Select.Option>
                {
                  optionPeriods
                    .map((option, ox) => (
                      <Select.Option value={option} key={ox}>
                        {option}
                      </Select.Option>
                    ))
                }
              </Select>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  )
}

export default PanelHeader
