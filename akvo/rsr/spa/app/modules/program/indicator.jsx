import React from 'react'
import { Spin, Collapse, Icon } from 'antd'
import moment from 'moment'
import classNames from 'classnames'

const { Panel } = Collapse
const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)
const periods = [
  {
    periodStart: '2019-12-01T08:39:36.055Z',
    periodEnd: '2019-12-30T08:39:36.055Z',
    aggregatedValue: 62023,
    aggregatedTarget: 200000,
    disaggregations: [
      { value: 120, title: 'women' }, { value: 201, title: 'children' }, { value: 419, title: 'men' }
    ],
    countries: [{ isoCode: 'ID' }, { isoCode: 'IN' }],
    projects: [
      {
        title: 'sample',
        countries: [{ isoCode: 'ID' }],
        value: 43
      },
      {
        title: 'sample 2',
        countries: [{ isoCode: 'IN' }],
        value: 59
      }
    ]
  }
]

const Indicator = () => {
  return (
    <div className="indicator">
      <Collapse defaultActiveKey={['0']} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
      {periods.map((period, index) => (
        <Panel
          key={index}
          header={(
            <div>
              <h5>{moment(period.periodStart).format('DD MMM YYYY')} - {moment(period.periodEnd).format('DD MMM YYYY')}</h5>
            </div>
          )}
        >
          graph chart here
        </Panel>
      ))}
      </Collapse>
    </div>
  )
}

export default Indicator
