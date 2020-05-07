import React from 'react'

const DsgOverview = ({values, targets, period}) => {
  const dsgGroups = {
    // Gender: [
    //   { category: 'Gender', type: 'Men', value: 50, target: 100},
    //   { category: 'Gender', type: 'Women', value: 70, target: 100 },
    //   { category: 'Gender', type: 'Women', value: 70, target: 100 },
    //   { category: 'Gender', type: 'Women', value: 70, target: 100 }
    // ]
  }
  values.forEach(item => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = []
    const target = targets.find(it => it.category === item.category && it.type === item.type)
    dsgGroups[item.category].push({ ...item, target: target ? target.value : null })
  })
  console.log(dsgGroups)
  const approvedUpdates = period.updates.filter(it => it.status.code === 'A')
  const unapprovedUpdates = period.updates.filter(it => it.status.code !== 'A')
  const totalValue = approvedUpdates.reduce((acc, val) => acc + val.value, 0)
  return (
    <div className="dsg-overview">
      <header>
        <div className="actual">
          <div className="cap">actual value</div>
          <div className="val">
            <b>{String(totalValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
            {period.targetValue > 0 && <small>{Math.round((totalValue / period.targetValue) * 100 * 10) / 10}%</small>}
          </div>
        </div>
        {period.targetValue > 0 &&
          <div className="target">
            <div className="cap">target value</div>
            <b>{String(period.targetValue).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
          </div>
        }
      </header>
      <div className="groups">
      {Object.keys(dsgGroups).map(dsgKey => {
        let maxValue = 0
        dsgGroups[dsgKey].forEach(it => { if (it.value > maxValue) maxValue = it.value; if (it.target > maxValue) maxValue = it.target })
        return (
          <div className="disaggregation-group">
            <div>
              <h5>Disaggregations: {dsgKey}</h5>
              <div className="horizontal bar-chart">
                <ul className="disaggregations-bar">
                {dsgGroups[dsgKey].map(item => (
                  <li className="dsg-item">
                    <div className="labels">
                      <div className="label">{item.type}</div>
                      {item.target > 0 && <div className="target"><b>{Math.round((item.value / item.target) * 100 * 10) / 10}%</b><span>of target</span></div>}
                    </div>
                    <div className="bar">
                      <div className="fill color" style={{ flex: item.target > 0 ? (item.value / item.target) : 1 }}>
                        {item.value}{(item.value > item.target && item.target > 0) && ` of ${item.target}`}
                      </div>
                      {item.target > 0 && <div className="target">{item.target}</div>}
                    </div>
                  </li>
                ))}
                </ul>
              </div>
            </div>
          </div>
        )
      })}
      </div>
    </div>
  )
}

export default DsgOverview
