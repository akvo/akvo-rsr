/* global document */
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { maxBy, groupBy } from 'lodash'
import { setNumberFormat } from '../../utils/misc'

const DisaggregationsBar = ({ disaggregations, disaggregationTargets, tooltipRef }) => {
  const { t } = useTranslation()
  const barRef = useRef(null)
  const mouseEnterBar = (disagg, ev) => {
    if (tooltipRef.current) {
      tooltipRef.current.innerHTML = `<div><b>${disagg.type}</b><br />${setNumberFormat(disagg.value)}${(disagg.target > 0) ? t(' of {{target}}', { target: setNumberFormat(disagg.target) }) : ''}</div>`
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
  const _disaggregations = disaggregations
    ?.filter((d) => (d?.value))
    ?.map((d) => {
      const target = disaggregationTargets?.find((dt) => dt?.dimentionValue === d?.dimentionValue?.id)
      return ({
        ...d,
        target: target?.value,
        category: d?.dimensionName?.name,
        type: d?.dimensionValue?.value
      })
    })
  const dsgGrouped = groupBy(_disaggregations, 'category')
  return (
    <div className="disaggregation-groups">
      {Object.keys(dsgGrouped)?.map((dsgKey, ix) => {
        const dsgItems = dsgGrouped[dsgKey] || []
        const maxValue = maxBy(dsgItems, 'value')?.value
        return (
          <div className="stat" key={ix}>
            <div className="label">{dsgKey}</div>
            <div className="disaggregations-bar" ref={(ref) => { barRef.current = ref }}>
              {
                dsgItems?.map((it) => {
                  const height = maxValue ? (it.value / maxValue) * 40 : 0
                  const targetHeight = (maxValue && it.target) ? (it.target / maxValue) * 40 : 0
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
