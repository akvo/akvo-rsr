import React from 'react'
import moment from 'moment'
import { Button } from 'antd'

const Update = ({ update, period }) => {
  return (
    <div className="update">
      {update.disaggregations.length > 0 &&
        <Disaggregations values={update.disaggregations} targets={period.disaggregationTargets} />
      }
      <div className="comments">
        <header>
          <div className="label">Value comments <div className="count">{update.comments.length}</div></div>
          <Button type="link" icon="plus" size="small">Add comment</Button>
        </header>
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
  values.filter(it => it.value > 0).forEach(item => {
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
            <h5>{dsgKey}</h5>
            <table cellPadding="0" cellSpacing="0" className="disaggregations-bar">
              {dsgGroups[dsgKey].map(item =>
              <tr className="dsg-item"><td><b className="color">{item.value}</b></td><td><span>{item.type}</span></td></tr>
               )}
            </table>
          </div>
        )
      })}
    </div>
  )
}

export default Update
