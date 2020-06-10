import React from 'react'


const Timeline = ({ updates, period, pinned, updatesListRef, setHover }) => {
  let svgHeight = 260
  const approvedUpdates = updates.filter(it => it.status === 'A')
  const unapprovedUpdates = updates.filter(it => it.status !== 'A')
  const totalValue = approvedUpdates.reduce((acc, val) => acc + val.value, 0)
  const totalProjectedValue = totalValue + unapprovedUpdates.reduce((acc, val) => acc + val.value, 0)
  if (!period.targetValue && totalValue === 0) { svgHeight = 50 }
  const points = [[0, svgHeight]]
  const chartWidth = 350
  let value = 0
  let maxValue = totalProjectedValue > period.targetValue ? totalProjectedValue : period.targetValue
  if (maxValue === 0) maxValue = 1
  // console.log(maxValue)
  const goalReached = period.targetValue && totalValue >= period.targetValue
  approvedUpdates.forEach((update, index) => { value += update.value; points.push([((index + 1) / updates.length) * chartWidth, svgHeight - (value / maxValue) * (svgHeight - 10)]) })

  const projectedPoints = [points[points.length - 1]]
  unapprovedUpdates.forEach((update, index) => { value += update.value; projectedPoints.push([((points.length + index) / updates.length) * chartWidth, svgHeight - (value / maxValue) * (svgHeight - 10)]) })

  const handleBulletEnter = (index) => {
    setHover(index)
  }
  const handleBulletLeave = (index) => {
    setHover(null)
  }
  const handleBulletClick = (index) => {
    updatesListRef.current.children[0].children[index].children[0].click()
  }
  return (
    <div className="timeline-container">
      {updates.length === 0 && (
        <div className="no-updates" style={period.targetValue ? { transform: 'translateY(150px)' } : {}}>No updates yet</div>
      )}
      {(period.targetValue > 0 || updates.length > 0) &&
        <div className="timeline" style={{ height: svgHeight + 50 }}>
          {period.targetValue > 0 &&
            <div className="target">
              <div className="cap">target value</div>
              <div><b>{String(period.targetValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></div>
            </div>
          }
          <div
            className="actual"
            style={{
              top: (!period.targetValue && approvedUpdates.length === 0) ? 0 : svgHeight - ((totalValue / maxValue) * (svgHeight - 10)) - 12,
              right: (unapprovedUpdates.length > 0 && approvedUpdates.length > 0) ? (unapprovedUpdates.length / updates.length) * chartWidth + 7 : 0
            }}
          >
            <div className="cap">actual value</div>
            <div className="val">
              {period.targetValue > 0 && <small>{Math.round((totalValue / period.targetValue) * 100 * 10) / 10}%</small>}
              <b>{String(totalValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
            </div>
          </div>
          {unapprovedUpdates.length > 0 && (
            <div
              className="projected actual"
              style={{
                top: (!period.targetValue && approvedUpdates.length === 0) ? 0 : svgHeight - ((value / maxValue) * (svgHeight - 10)) - 12,
              }}
            >
              <div>
                <small>projected</small>
                <div className="cap">actual value</div>
                <div className="val">
                  {period.targetValue > 0 && <small>{Math.round((value / period.targetValue) * 100 * 10) / 10}%</small>}
                  <b>{String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
                </div>
              </div>
            </div>
          )}
          {svgHeight > 50 && <div className="actual-line" style={{ top: svgHeight - ((totalValue / maxValue) * (svgHeight - 10)) + 43 }} />}
          <svg width="370px" height={svgHeight + 10} version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <line x1="0" y1={svgHeight} x2="365" y2={svgHeight} stroke="#43998f" strokeWidth="1" />
              <g transform={`translate(364, ${svgHeight - 3.5})`}>
                <polygon id="Path-2" fill="#43998f" points="0.897746169 0 0.897746169 6.63126533 6.47011827 3.31563267" />
              </g>
              {svgHeight > 50 && [
                <polyline fill="#eaf3f2" points={[...points, [points[points.length - 1][0], svgHeight]].map(p => p.join(' ')).join(' ')} />,
                <polyline stroke="#43998f" strokeWidth="3" points={points.map(p => p.join(' ')).join(' ')} />
              ]}
              {projectedPoints.length > 1 && [
              <polyline fill="#eaf3f2" opacity="0.7" points={[points.length > 1 ? [points[points.length - 1][0], svgHeight] : null, ...projectedPoints, [projectedPoints[projectedPoints.length - 1][0], svgHeight]].filter(it => it !== null).map(p => p.join(' ')).join(' ')} />,
                <polyline stroke="#43998f" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.3 4" points={projectedPoints.map(p => p.join(' ')).join(' ')} />,
                projectedPoints.slice(1).map(point => [
                  <line x1={point[0]} y1={point[1]} x2={point[0]} y2={svgHeight + 10} stroke="#43998f" strokeWidth="1.5" strokeDasharray="1.3 4" strokeLinecap="round" />,
                  <circle {...point[1] > 10 ? { fill: '#fff', r: 6, stroke: '#43998f' } : { fill: '#bed3d0', stroke: '#debda8', r: 9 }} strokeWidth="1.5" cx={point[0]} cy={point[1]} />
                ])
              ]}
              <g>
                {points.slice(1).map((point, pi) => [
                  <line x1={point[0]} y1={point[1]} x2={point[0]} y2={svgHeight + 10} stroke="#43998f" strokeWidth="1.5" {...pi === points.length - 2 ? {} : { strokeDasharray: '1.3 4' }} strokeLinecap="round" />,
                  <circle {...(pi === points.length - 2 && approvedUpdates[approvedUpdates.length - 1].value > 0) ? { fill: point[1] === 10 ? '#43998f' : '#fff', stroke: '#43998f', strokeWidth: 2, r: 9 } : { fill: '#43998f', r: 6 }} cx={point[0]} cy={point[1]} />
                ])}
              </g>
              {goalReached && (
                <g transform="translate(340, 0)">
                  <path d="M20,10 C20,4.4771525 15.5228475,0 10,0 C4.4771525,0 0,4.4771525 0,10" fill="#ecbaa1" />
                </g>
              )}
            </g>
          </svg>
          <div className="bullets">
            {points.slice(1).map((point, pi) => <div style={{ left: point[0] }} className={Number(pinned) === pi && 'pinned'} onMouseEnter={() => handleBulletEnter(pi)} onMouseLeave={() => handleBulletLeave(pi)} onClick={() => handleBulletClick(pi)} role="button" tabIndex="-1"><span>{pi + 1}</span></div>)}
          {projectedPoints.slice(1).map((point, pi) => <div style={{ left: point[0] }} className={Number(pinned) === points.length - 1 + pi && 'pinned'} onMouseEnter={() => handleBulletEnter(points.length - 1 + pi)} onMouseLeave={() => handleBulletLeave(points.length - 1 + pi)} onClick={() => handleBulletClick(points.length - 1 + pi)} role="button" tabIndex="-1"><span>{points.length - 1 + pi + 1}</span></div>)}
          </div>
        </div>
      }
    </div>
  )
}

export default Timeline
