import React from 'react'
import moment from 'moment'

const Update = ({ update, period }) => {
  return (
    <div className="update">
      {update.disaggregations.length > 0 &&
        <Disaggregations values={update.disaggregations} targets={period.disaggregationTargets} />
      }
      <div className="comments">
        <div className="label">Value comments <div className="count">{update.comments.length}</div></div>
        {update.comments.map(comment => (
          <div className="comment">
            <div className="top">
              <b>{comment.user.name}</b>
              <b>{moment(comment.createdAt).format('DD MMM YYYY')}</b>
            </div>
            <p>{comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}


const Disaggregations = ({ values, targets }) => {
  const dsgGroups = {}
  values.forEach(item => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = []
    const target = targets.find(it => it.category === item.category && it.type === item.type)
    dsgGroups[item.category].push({ ...item, target: target ? target.value : null })
  })
  return (
    <div className="disaggregations disaggregation-groups">
      {Object.keys(dsgGroups).map(dsgKey => {
        let maxValue = 0
        dsgGroups[dsgKey].forEach(it => { if (it.value > maxValue) maxValue = it.value; if (it.target > maxValue) maxValue = it.target })
        return (
          <div className="disaggregation-group">
            <div>
              <h5>Disaggregations: {dsgKey}</h5>
              <div className="disaggregations-bar">
                {dsgGroups[dsgKey].map(item => (
                  <div>
                    <div style={{ height: (item.value / maxValue) * 40 }} />
                    {(item.target !== null) && <div className="target" style={{ height: (item.target / maxValue) * 40 }} />}
                  </div>
                ))}
              </div>
            </div>
            <ul>
              {dsgGroups[dsgKey].map(item =>
                <li><span>{item.type}</span><span>{item.value} (of {item.target})</span></li>
              )}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default Update
