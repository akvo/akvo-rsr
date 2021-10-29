import React from 'react'
import { List, Skeleton, Button, Icon } from 'antd'
import classNames from 'classnames'
import { IndicatorCard } from '../components/IndicatorCard'
import { PanelBadge } from '../components'
import rsample from '../data/rsample.json'
import { queryGeoData } from '../components/map-view/queries'
import { splitStartEndPeriod } from '../../../utils/misc'

const ListHeader = ({
  name,
  amount,
  page,
  total,
  onPage
}) => (
  <div>
    <div style={{ float: 'left' }}>
      {name ? `${name.toUpperCase()} ` : ''}
      <PanelBadge count={amount} />
    </div>
    <div style={{ float: 'right' }}>
      <Button.Group size="small">
        {page >= 1 && (
          <Button onClick={() => onPage(name, 'prev')}>
            <Icon type="left" />
          </Button>
        )}
        <Button onClick={() => onPage(name, 'next')} disabled={(parseInt(total - 1, 10) === page)}>
          <Icon type="right" />
        </Button>
      </Button.Group>
    </div>
    <div style={{ clear: 'both' }} />
  </div>
)

const FrameworkOverview = ({
  selectedPeriod,
  selectedCountries,
  connected,
  open,
  loading,
  filtering,
  pages,
  onShow,
  onConnect,
  onPage
}) => {
  const { data: geo } = queryGeoData()
  return (
    <List
      itemLayout="horizontal"
      dataSource={pages}
      className={classNames({ 'ls-empty': !pages.length })}
      renderItem={(item, ix) => (
        <List.Item className={`parent-${item.id}${ix}`}>
          <List
            style={{ width: '100%' }}
            header={pages ?
              (
                <ListHeader
                  {...{
                    ...item,
                    onPage,
                    amount: item.data.flatMap((d) => d).length
                  }}
                />
              )
              : 'LOADING...'
            }
            grid={{ gutter: 16, column: 3 }}
            dataSource={item.data[item.page]}
            renderItem={value => {
              const { features } = geo || {}
              let updates = []
              if (features) {
                const si = value.indicators.map((i) => i.id)
                updates = features.flatMap((g) => g.properties).map((p) => ({
                  ...p,
                  indicators: Object.keys(p.indicators)
                    .filter((i) => si.includes(parseInt(i, 10)))
                    .map((i) => ({
                      id: parseInt(i, 10),
                      ...p.indicators[i]
                    }))
                }))
                if (selectedPeriod) {
                  updates = updates.map((u) => ({
                    ...u,
                    indicators: u.indicators.map((ids) => ({
                      ...ids,
                      periods: ids.periods.filter((pd) => {
                        const [periodStart, periodEnd] = splitStartEndPeriod(selectedPeriod)
                        return pd.periodStart === periodStart && pd.periodEnd === periodEnd
                      })
                    }))
                  }))
                }
              }
              return (
                <List.Item>
                  <Skeleton loading={loading || filtering || !geo} active>
                    <IndicatorCard
                      {...{
                        active: open ? open.includes(value.id) : false,
                        result: loading ? rsample : value,
                        selectedCountries,
                        onConnect,
                        connected,
                        updates,
                        onShow
                      }}
                    />
                  </Skeleton>
                </List.Item>
              )
            }}
          />
        </List.Item>
      )}
    />
  )
}

export default FrameworkOverview
