/* global window, document */
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'

const Disaggregations = ({ disaggTooltipRef: tooltipRef, disaggregationContributions, disaggregationTargets }) => {
  const { t } = useTranslation()
  const barRef = useRef(null)
  const mouseEnterBar = (disagg, ev) => {
    if (tooltipRef.current) {
      tooltipRef.current.innerHTML = `<div><b>${disagg.type}</b><br />${String(disagg.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${(disagg.target > 0) ? t(' of {{target}}', { target: String(disagg.target).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }) : ''}</div>`
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
  const dsgGroups = {}
  disaggregationContributions.forEach(item => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = []
    const target = disaggregationTargets.find(it => it.category === item.category && it.type === item.type)
    dsgGroups[item.category].push({ ...item, target: target ? target.value : null })
  })
  return (
    <div className="disaggregation-groups">
      {
        Object.keys(dsgGroups).map((dsgKey, index) => {
          let maxValue = 0
          dsgGroups[dsgKey].forEach(it => {
            if (it.value > maxValue) {
              maxValue = it.value
            }
            if (it.target > maxValue) {
              maxValue = it.target
            }
          })
          return (
            <div className="stat" key={index}>
              <div className="label">{dsgKey}</div>
              <div className="disaggregations-bar" ref={(ref) => { barRef.current = ref }}>
                {
                  dsgGroups[dsgKey].map(item => (
                    <div
                      key={item?.id}
                      className="dsg-item"
                      onMouseEnter={(ev) => mouseEnterBar(item, ev)}
                      onMouseLeave={mouseLeaveBar}
                    >
                      <div className="color" style={{ height: (item.value / maxValue) * 40 }} />
                      {(item.target !== null) && <div className="target color" style={{ height: (item.target / maxValue) * 40 }} />}
                    </div>
                  ))
                }
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Disaggregations
