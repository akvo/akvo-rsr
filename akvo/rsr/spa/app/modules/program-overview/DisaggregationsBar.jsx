/* eslint-disable no-restricted-globals */
/* global document */
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import maxBy from 'lodash/maxBy'
import { setNumberFormat } from '../../utils/misc'

const DisaggregationsBar = ({ dsgItems, tooltipRef }) => {
  const { t } = useTranslation()
  const barRef = useRef(null)
  const mouseEnterBar = (disagg, ev) => {
    if (tooltipRef.current) {
      tooltipRef.current.innerHTML = `<div><b>${disagg.type}</b><br />${setNumberFormat(disagg.total)}${(disagg.target > 0) ? t(' of {{target}}', { target: setNumberFormat(disagg.target) }) : ''}</div>`
      tooltipRef.current.style.opacity = 1
      const rect = ev.target.getBoundingClientRect()
      const barRect = barRef.current.getBoundingClientRect()
      const bodyRect = document.body.getBoundingClientRect()
      tooltipRef.current.style.top = `${(barRect.top - bodyRect.top) + 50}px`
      tooltipRef.current.style.left = `${rect.left + (rect.right - rect.left) / 2 - 2}px`
    }
  }
  const mouseLeaveBar = () => {
    tooltipRef.current.style.opacity = 0
  }
  return (
    <div className="disaggregation-groups">
      {dsgItems?.map((item, index) => {
        const maxValue = maxBy(item.items, 'total')?.total
        return (
          <div className="stat" key={index}>
            <div className="label">{item.name}</div>
            <div className="disaggregations-bar" ref={(ref) => { barRef.current = ref }}>
              {
                item?.items?.map((it) => {
                  let height = (it.total / maxValue) * 40
                  height = isNaN(height) ? 0 : height
                  let targetHeight = (it.target / maxValue) * 40
                  targetHeight = isNaN(targetHeight) ? 0 : targetHeight
                  return (
                    <div
                      key={it?.id}
                      className="dsg-item"
                      onMouseEnter={(ev) => mouseEnterBar(it, ev)}
                      onMouseLeave={mouseLeaveBar}
                    >
                      <div className="color" style={{ height }} />
                      {(it.target !== null) && <div className="target color" style={{ height: targetHeight }} />}
                    </div>
                  )
                })
              }
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DisaggregationsBar
