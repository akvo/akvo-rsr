import React, { useState } from 'react'
import { List } from 'antd'
import { IndicatorCard } from '../components/IndicatorCard'
import './Framework.scss'
import { IndicatorDrawer, PanelBadge } from '../components'

const Framework = ({
  sections,
  indicators,
  countries,
  periods,
  selectedCountries,
  selectedPeriod,
  onPeriod,
  onCountry
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [result, setResult] = useState(null)
  const handleOnShowDrawer = (resultID) => {
    const resultItem = Object.values(indicators)
      .flatMap(item => item)
      .find(item => item.id === resultID)
    setResult(resultItem)
    setDrawerVisible(true)
  }

  return (
    <>
      <IndicatorDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        {...{
          result,
          countries,
          periods,
          selectedCountries,
          selectedPeriod,
          onPeriod,
          onCountry
        }}
      />
      <List
        itemLayout="horizontal"
        dataSource={sections}
        style={{ padding: '0 2em 0 2em' }}
        renderItem={item => (
          <List.Item>
            {indicators && indicators[item.name] && (
              <List
                header={(
                  <>
                    {item.name.toUpperCase()}&nbsp;
                    <PanelBadge count={indicators[item.name].length || 0} />
                  </>
                )}
                grid={{ gutter: 16, column: 3 }}
                dataSource={indicators[item.name]}
                className="wcaro-framework-indicator"
                renderItem={value => (
                  <List.Item style={{ paddingTop: '1em' }}>
                    <IndicatorCard
                      indicator={value}
                      onShow={handleOnShowDrawer}
                    />
                  </List.Item>
                )}
              />
            )}
          </List.Item>
        )}
      />
    </>
  )
}

export default Framework
