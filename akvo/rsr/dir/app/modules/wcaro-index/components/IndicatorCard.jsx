import React from 'react'
import { Card, Row, Col, Typography, Progress, Button, Icon } from 'antd'
import { sum, sumBy } from 'lodash'
import classNames from 'classnames'
import { QuantityLabel } from './QuantityLabel'
import { calculatePercentagePeriods, calculateUnitPeriods, subString } from '../../../utils/misc'
import relationship from '../data/relationship.json'

const { Text } = Typography

export const IndicatorCard = ({
  selectedCountries: sc,
  connected,
  updates,
  result,
  onShow,
  onConnect,
  onLoad,
  active = false,
  ...props
}) => {
  let values = []
  if (updates.length) {
    values = updates.map((u) => ({
      isoCode: u.isoCode.toLowerCase(),
      progress: sum(u.indicators.map((i) => i.isPercentage ? calculatePercentagePeriods(i.periods) : calculateUnitPeriods(i.periods)))
    }))
    if (sc.length) values = values.filter((v) => sc.includes(v.isoCode))
  }
  const progress = sumBy(values, 'progress').toFixed(2).replace(/\.0+$/, '')
  const countries = (sc && sc.length) ? sc : result.countries
  const pgprops = active ?
    {
      percent: parseFloat(progress, 10),
      showInfo: false,
      strokeLinecap: 'square'
    } : {
      percent: parseFloat(progress, 10),
      showInfo: false,
      strokeLinecap: 'square',
      strokeColor: {
        '0%': '#7ED7D0',
        '100%': '#03AD8C',
      }
    }

  return (
    <Card
      key={result.id}
      cover={<Progress {...pgprops} />}
      className={classNames(
        `wo-card${result.id}`, {
        'active-card': (active && connected.from),
        'active-card-single': (active && !connected.from)
      })}
      {...props}
    >
      <Text strong>{subString(result.title)}</Text>
      <div style={{ padding: '1em 0' }}>
        <QuantityLabel
          onClick={() => onShow(result.id, progress)}
          {...{
            ...result,
            countries,
            nCountry: countries ? countries.length : 0
          }}
        />
      </div>
      <Row>
        <Col lg={6} xs={12}>
          <small className="wcaro-text success">PROGRESS</small><br />
          <Text className="wcaro-text success" strong>{`${progress} %`}</Text>
        </Col>
        <Col lg={18} xs={12} style={{ textAlign: 'right', paddingTop: 15 }}>
          {
            (
              onConnect &&
              relationship.map((r) => r.from).includes(result.id)
            )
              ?
              (
                <Button onClick={() => onConnect(result.id)}>
                  <Icon
                    type="share-alt"
                    style={{
                      WebkitTransform: 'rotate(90deg)',
                      msTransform: 'rotate(90deg)',
                      transform: 'rotate(90deg)',
                      fontSize: 18
                    }}
                  />
                </Button>
              )
              : null
          }
        </Col>
      </Row>
    </Card>
  )
}
