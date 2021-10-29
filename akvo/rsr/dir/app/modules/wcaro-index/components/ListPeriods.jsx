import React from 'react'
import { Collapse, List, Typography, Row, Col, Badge, Icon } from 'antd'
import { groupBy, orderBy, sortBy, sumBy } from 'lodash'
import classNames from 'classnames'

import { getProgress, setNumberFormat, splitStartEndPeriod } from '../../../utils/misc'
import jsoncountries from '../../../utils/countries.json'

const { Panel } = Collapse
const { Text } = Typography

const handleColorCoding = (progress, target = 0, actual = 0) => ({
  'success': ((actual > 0 && target > 0) && progress > 100),
  'warning': ((actual > 0 && target > 0) && (progress > 50 && progress <= 100)),
  'danger': ((actual > 0 && target > 0) && (progress >= 0 && progress < 50)),
  'secondary': (actual === 0),
  'primary': ((target === 0 || !target) && actual > 0)
})

const HeaderPeriod = ({
  contributors,
  title,
  actual,
  target,
  progress,
  country,
  type
}) => {
  const cl = contributors.map((cb) => cb.country.isoCode)
  let countryText = cl.length === 1
    ? jsoncountries.find((c) => c.code === cl[0].toUpperCase()).name || `${cl.length} Country`
    : `${cl.length} Countries`
  countryText = country ? country.name : countryText
  const txtcolors = handleColorCoding(progress, target, actual)
  const icon = (progress > 100) ? 'arrow-up' : (progress > 50 && progress <= 100) ? 'arrow-right' : (target === 0) ? 'dash' : 'arrow-down'
  return (
    <Row>
      <Col lg={17} xs={16}>

        <div style={{ display: 'flex' }}>
          <div style={{ textAlign: 'left', marginRight: '3em' }}>
            <Text className="wcaro-text" strong>
              {(type && Number.isNaN(type)) ? type.toUpperCase() : 'QUANTITATIVE'}
            </Text>
          </div>
          <div style={{ textAlign: 'left' }}>
            <span className="wcaro-text">
              <Icon style={{ marginRight: 8 }} type="global" />
              {countryText}
            </span>
          </div>
        </div>
        <div style={{ marginTop: 18, paddingLeft: 5 }}>
          {title}
        </div>
      </Col>
      <Col lg={7} xs={8}>
        <Row>
          <Col span={17} className="text-center">
            <Text
              className={classNames(
                'wcaro-text',
                'small-size',
                { ...txtcolors }
              )}
            >
              ACTUAL VALUE
            </Text>
            <br />
            <Text
              className={classNames(
                'wcaro-text',
                'normal-size',
                { ...txtcolors }
              )}
              strong
            >
              {actual ? setNumberFormat(actual) : 'UNREPORTED'}
            </Text>
          </Col>
          <Col span={7} style={{ left: '8%', textAlign: 'center' }}>
            <small className="text-white">
              {actual ? `${progress} %` : '- %'}
            </small>
          </Col>
        </Row>
        <Row>
          <Col span={18} className="text-center">
            <br />
            <Text className="wcaro-text small-size text-black">TARGET VALUE</Text><br />
            <Text className="text-black" strong>{setNumberFormat(target)}</Text>
          </Col>
          <Col span={6} className="fw-header-progress">
            <hr />
            <span className="text-white">
              <Icon type={icon} />
            </span>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

const CollapsePeriods = ({ country, contribGroups, bgcolors, ...props }) => (
  <Collapse bordered={false} style={{ marginBottom: '1em' }} className="wcaro-collapsable">
    <Panel
      header={<HeaderPeriod {...{ country, contributors: contribGroups, ...props }} />}
      className={classNames({ ...bgcolors })}
    >
      <List
        bordered
        dataSource={contribGroups}
        renderItem={(x, index) => {
          const ac = jsoncountries.map((c) => ({ ...c, code: c.code.toLowerCase() }))
          const cn = ac.find((a) => a.code === x.country.isoCode)
          const pgx = getProgress(x.actualValue, x.targetValue)
          const txtcolors = handleColorCoding(pgx, x.targetValue, x.actualValue)
          return (
            <List.Item key={x.periodId} className={classNames({ 'opacity-25': (country && index > 0) })}>
              <Row style={{ width: '100%' }}>
                <Col span={10}>
                  <h5 className="text-maroon">
                    <Icon style={{ marginRight: 8 }} type="global" />
                    {cn ? cn.name : ''}
                  </h5>
                </Col>
                <Col span={5}>
                  <Text
                    className={classNames(
                      'wcaro-text',
                      { ...txtcolors }
                    )}
                  >
                    ACTUAL VALUE
                  </Text>
                  <br />
                  <Text
                    className={classNames(
                      'wcaro-text',
                      'normal-size',
                      { ...txtcolors }
                    )}
                    strong
                  >
                    {setNumberFormat(x.actualValue)}
                  </Text>
                </Col>
                <Col span={5}>
                  <Text className="wcaro-text">TARGET VALUE</Text><br />
                  <Text strong>{setNumberFormat(x.targetValue)}</Text>
                </Col>
                <Col span={3}>
                  <Text
                    className={classNames(
                      'wcaro-text',
                      'normal-size',
                      { ...txtcolors }
                    )}
                    strong
                  >
                    {(x.actualValue && x.targetValue > 0) ? `${pgx} %` : x.actualValue === 0 ? '- %' : '0 %'}
                  </Text>
                </Col>
                <Col span={1} className="fw-badge-container">
                  <Badge
                    color="#44988F"
                    className={classNames({
                      'fw-empty-success': (!txtcolors.success)
                    })}
                  />
                  <Badge
                    color="#DC8749"
                    className={classNames({
                      'fw-empty-warning': (!txtcolors.warning)
                    })}
                  />
                  <Badge
                    color="#CD514C"
                    className={classNames({
                      'fw-empty-danger': (!txtcolors.danger)
                    })}
                  />
                  <Badge
                    color="#1890ff"
                    className={classNames({
                      'fw-empty-primary': (!txtcolors.primary)
                    })}
                  />
                </Col>
              </Row>
            </List.Item>
          )
        }}
      />
    </Panel>
  </Collapse>
)

export const ListPeriods = ({ sc, indicators, country, period }) => (
  <List
    bordered
    className="fw-result-pane"
    itemLayout="vertical"
    size="large"
    dataSource={indicators}
    renderItem={item => {
      const { periods, title, type } = item || {}
      const contributors = periods
        .filter((pd) => {
          if (period) {
            const [periodStart, periodEnd] = splitStartEndPeriod(period)
            return pd.periodStart === periodStart && pd.periodEnd === periodEnd
          }
          return pd
        })
        .flatMap((p) => p.contributors.filter((cb) => (cb.country)))
        .flatMap((cb) => cb.contributors)
        .filter((cb) => {
          if (sc.length) {
            return sc.includes(cb.country.isoCode)
          }
          return cb
        })
      const actual = contributors.length ? sumBy(contributors, 'actualValue') : null
      const target = contributors.length ? sumBy(contributors, 'targetValue') : null
      const progress = getProgress(actual, target)
      const bgcolors = handleColorCoding(progress, target, actual)

      let contribGroups = Object.values(groupBy(contributors, 'country.isoCode')).map((g) => ({
        country: {
          isoCode: g[0].country.isoCode
        },
        actualValue: sumBy(g, 'actualValue'),
        targetValue: sumBy(g, 'targetValue')
      }))
      contribGroups = country
        ? orderBy(contribGroups, (it) => it.country.isoCode === country.code, ['desc', 'asc'])
        : sortBy(contribGroups, 'country.isoCode')
      const isVisible = (
        (!country && contribGroups.length) ||
        (country && contribGroups.map((cb) => cb.country.isoCode).includes(country.code))
      )
      return (
        <List.Item key={item.id} className={classNames({ 'opacity-25': !isVisible })}>
          <CollapsePeriods
            {...{
              contribGroups,
              progress,
              bgcolors,
              country,
              actual,
              target,
              title,
              type
            }}
          />
        </List.Item>
      )
    }}
  />
)
