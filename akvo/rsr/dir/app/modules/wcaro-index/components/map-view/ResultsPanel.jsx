import React, { useEffect, useState } from 'react'
import { Collapse, List, Typography, Card, Icon, Badge, Skeleton } from 'antd'
import classnames from 'classnames'
import { sumBy } from 'lodash'
import SVGInline from 'react-svg-inline'

import { queryResult } from './queries'
import {
  calculatePercentagePeriods,
  calculateUnitPeriods,
  setNumberFormat,
  splitStartEndPeriod
} from '../../../../utils/misc'
import { groupIcon } from '../../data'
import groups from '../../data/groups.json'
import config from '../../config'
import EmptyPage from '../EmptyPage'

const { Text } = Typography

const ProgressBar = ({ percent, status = 'default' }) => (
  <div className="ant-progress ant-progress-line ant-progress-default" style={{ margin: '10px 0' }}>
    <div>
      <div className="ant-progress-outer">
        <div className="ant-progress-inner" style={{ height: 18 }}>
          <div className={classnames('ant-progress-bg', status)} style={{ width: percent > 100 ? '100%' : `${percent}%`, height: 18, textAlign: 'right', padding: '2px 20px' }}>
            <small style={{ color: '#fff', position: 'absolute', right: 5 }}>{`${percent} %`}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const Result = ({
  id,
  search,
  updates,
  filtering,
  indicator,
  setIndicator,
  items,
  outcome
}) => {
  const { data, error } = queryResult(id)
  useEffect(() => {
    if (data && !indicator) {
      setIndicator(data[0])
    }
  }, [data, indicator])
  return <>
    {error ? (
      <div style={{ color: 'red' }}>Failed to load data!</div>
    ) : (!data || filtering) ? (
      <div style={{ paddingTop: 20 }}>
        <Skeleton paragraph={{ rows: 3 }} active />
      </div>
    ) : (
      <List
        className="item-list"
        bordered={false}
        dataSource={data.filter((d) => items.includes(d.id)).filter((d) => {
          if (search) {
            return d.title.toLowerCase().includes(search.toLowerCase())
          }
          return d
        })}
        renderItem={(item, index) => {
          const values = updates
            .map((u) => u.indicators.find((it) => it.id === item.id))
            .map((i) => ({
              actualValue: i.isPercentage ? sumBy(i.periods, 'numerator') : sumBy(i.periods, 'value'),
              targetValue: i.isPercentage ? sumBy(i.periods, 'denominator') : sumBy(i.periods, 'periodTarget'),
              progress: i.isPercentage ? calculatePercentagePeriods(i.periods) : calculateUnitPeriods(i.periods)
            }))
          const actualValue = sumBy(values, 'actualValue')
          const targetValue = sumBy(values, 'targetValue')
          const progress = parseFloat(sumBy(values, 'progress'), 10).toFixed(2)
          return (
            <List.Item>
              <Card
                className={classnames('wcaro-map-indicator', { active: indicator && indicator.id === item.id })}
                onClick={() => setIndicator(item)}
                bordered={false}
                hoverable
              >
                <h4>{`OUTPUT ${outcome}.${index + 1}`}</h4>
                <Text>{item.title}</Text>
                <ProgressBar
                  percent={progress}
                  status={progress > 50 ? 'success' : progress <= 25 ? 'danger' : 'warning'}
                />
                <div>
                  <div style={{ float: 'left' }}>
                    <Text className="text-green-muted">Aggregated Value</Text>&nbsp;
                    <Text strong>{setNumberFormat(actualValue)}</Text>
                  </div>
                  <div style={{ float: 'right' }}>
                    <Text className="text-green-muted">Target</Text>&nbsp;
                    <Text strong>{setNumberFormat(targetValue)}</Text>
                  </div>
                </div>
                <div style={{ clear: 'both' }} />
              </Card>
            </List.Item>
          )
        }}
      />
    )}
  </>
}

const CollapseHeader = ({ title, icon, height = 30, ...props }) => (
  <div style={{ display: 'flex' }}>
    <SVGInline svg={groupIcon[icon]} height={`${height}px`} {...props} />
    <span style={{ marginLeft: 10, textTransform: 'uppercase' }}>{title}</span>
  </div>
)

const ResultsPanel = ({
  geo,
  loading,
  search,
  period,
  countries,
  indicator,
  setIndicator,
  setLoading
}) => {
  const { data: result, error } = queryResult(config.RESULT_ID)
  const [filtering, setFiltering] = useState(false)
  const [parentKey, setParentKey] = useState(groups.map((g) => g.id))

  useEffect(() => {
    if (loading && result) {
      setParentKey(groups[0].id)
      setLoading(false)
    }
    if (loading && (search || period || countries.length)) {
      setFiltering(true)
      setLoading(false)
      setTimeout(() => {
        setFiltering(false)
      }, 1000)
    }
  }, [loading, filtering, result])

  const results = groups.map((g) => ({
    ...g,
    items: g.items.map((it) => {
      const find = result ? result.find((d) => d.id === it.id) || {} : {}
      return {
        ...it,
        ...find
      }
    })
  }))
  const si = groups.flatMap((g) => g.items).flatMap((i) => i.items)
  let updates = geo ? geo.features.flatMap((g) => g.properties).map((p) => ({
    ...p,
    indicators: Object.keys(p.indicators)
      .filter((i) => si.includes(parseInt(i, 10)))
      .map((i) => ({
        id: parseInt(i, 10),
        ...p.indicators[i]
      }))
  })) : []
  if (updates.length && (period || countries.length)) {
    updates = updates
      .filter((u) => countries.length ? countries.includes(u.isoCode.toLowerCase()) : u)
      .map((u) => ({
        ...u,
        indicators: u.indicators.map((ids) => ({
          ...ids,
          periods: ids.periods.filter((pd) => {
            if (period) {
              const [periodStart, periodEnd] = splitStartEndPeriod(period)
              return pd.periodStart === periodStart && pd.periodEnd === periodEnd
            }
            return pd
          })
        }))
      }))
  }

  return <>
    {!result && (
      <div style={{ padding: '50% 0', textAlign: 'center' }}>
        <EmptyPage error={error} />
      </div>
    )}
    {(!error && result) && (
      <Collapse
        className="sidebar-items"
        bordered={false}
        accordion={!loading}
        destroyInactivePanel={!loading}
        activeKey={parentKey}
        onChange={setParentKey}
      >
        {results.map((r) => {
          const { items, ...header } = r
          return (
            <Collapse.Panel
              className="item-header"
              header={<CollapseHeader {...header} />}
              key={r.id}
            >
              {items.map((it) => (
                <div key={it.id}>
                  <div className="item-label">
                    <Text strong>{it.unit}</Text>
                  </div>
                  <div className="box">
                    <div>
                      <div style={{ float: 'left', color: '#357594' }}>
                        {`OUTCOME ${it.outcome}`}
                      </div>
                      <div style={{ float: 'right' }}>
                        <Badge count={it.items.length} className="item-badge" />
                      </div>
                    </div>
                    <div style={{ clear: 'both' }} />
                    <Collapse
                      bordered={false}
                      expandIcon={({ isActive }) => (
                        <div className="expander-container">
                          <Icon type="down" className={classnames('expander', { isActive })} />
                        </div>
                      )}
                      defaultActiveKey={it.id}
                    >
                      <Collapse.Panel header={it.title} key={it.id}>
                        {it.resultId.map(id => (
                          <Result
                            {...{
                              id,
                              search,
                              updates,
                              countries,
                              filtering,
                              indicator,
                              setIndicator,
                              items: it.items,
                              outcome: it.outcome
                            }}
                            key={id}
                          />
                        ))}
                      </Collapse.Panel>
                    </Collapse>
                  </div>
                </div>
              ))}
            </Collapse.Panel>
          )
        })}
      </Collapse>
    )}
  </>
}

export default ResultsPanel
