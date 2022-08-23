import React, { useState, useEffect } from 'react'
import { Collapse, Skeleton } from 'antd'
import { useDispatch } from 'react-redux'

import ExpandIcon from '../components/ExpandIcon'

import { getIndicatorsByID } from '../queries'
import { setIndicators } from '../../../features/results/resultSlice'
import Indicator from '../components/Indicator/Indicator'
import PanelHeader from '../components/Indicator/PanelHeader'

const { Panel } = Collapse

const ResultItem = ({
  id: resultID,
  indicators,
  fetched,
  search
}) => {
  const defaultKeys = indicators.map((i) => i.id)

  const [loading, setLoading] = useState(!fetched)
  const [activeKeys, setActiveKeys] = useState(defaultKeys)

  const dispatch = useDispatch()
  const { data, size, setSize } = getIndicatorsByID(resultID)

  useEffect(() => {
    if (data && loading) {
      const { next } = data.slice(-1)[0] || {}
      setSize(size + 1)
      if (!next && loading) {
        setLoading(false)
        const items = data.flatMap((d) => d.results)
        setActiveKeys(items.map((i) => i.id))
        dispatch(setIndicators({ id: resultID, items }))
      }
    }
  }, [loading, data, size, activeKeys])
  return (
    <Skeleton loading={loading} paragraph={{ rows: 5 }} active>
      <Collapse
        bordered={false}
        className="indicators-collapse"
        expandIconPosition="right"
        expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
        activeKey={activeKeys}
        onChange={setActiveKeys}
      >
        {
          indicators.map((indicator) => {
            const showProgress = !(activeKeys.includes(`${indicator.id}`))
            return (
              <Panel
                header={(
                  <PanelHeader
                    {...{
                      ...indicator,
                      search,
                      showProgress
                    }}
                  />
                )}
                className="indicators-panel"
                key={indicator.id}
              >
                <Indicator {...indicator} />
              </Panel>
            )
          })
        }
      </Collapse>
    </Skeleton>
  )
}

export default ResultItem
