import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Button, Icon, Spin, Input } from 'antd'
import api from '../../utils/api'

const Update = ({ update, period }) => {
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [showNewComment, setShowNewComment] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  useEffect(() => {
    if (update.id != null){
      api.get(`/indicator_period_data_framework/${update.id}/`)
      .then(({ data: {text, narrative, comments} }) => {
        if (text || narrative) {
          setComments([{ comment: update.text || update.narrative, createdAt: update.createdAt, userDetails: update.userDetails }, ...comments])
        } else {
          setComments(comments)
        }
        setLoading(false)
      })
    }
  }, [])
  const handleCancelComment = () => {
    setNewComment('')
    setShowNewComment(false)
  }
  const handleSubmitComment = () => {
    // setComments
    if(newComment.length > 0){
      setSubmitting(true)
      api.post('/indicator_period_data_comment/', {
        comment: newComment,
        data: update.id
      })
      .then(({data}) => {
        setSubmitting(false)
        setComments([data, ...comments])
        handleCancelComment()
      })
    }
  }
  if(loading){
    return (
      <div className="update loading">
        <Spin indicator={<Icon type="loading" style={{ fontSize: 32 }} spin />} />
      </div>
    )
  }
  return (
    <div className="update">
      {update.disaggregations.length > 0 &&
        <Disaggregations values={update.disaggregations} targets={period.disaggregationTargets} />
      }
      <div className="comments">
        <header>
          <div className="label">Value comments <div className="count">{comments.length}</div></div>
          {!showNewComment && <Button type="link" icon="plus" size="small" onClick={() => setShowNewComment(true)}>Add comment</Button>}
        </header>
        {showNewComment &&
          <div className="new-comment">
            <Input.TextArea rows={2} value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <Button type="primary" size="small" loading={submitting} onClick={handleSubmitComment}>Submit</Button>
            <Button type="link" size="small" onClick={handleCancelComment}>Cancel</Button>
          </div>
        }
        {comments.map(comment => (
          <div className="comment">
            <div className="top">
              <b>{comment.userDetails.firstName} {comment.userDetails.lastName}</b>
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
                <tr className="dsg-item"><td><b className="color">{String(item.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></td><td><span>{item.type}</span></td></tr>
               )}
            </table>
          </div>
        )
      })}
    </div>
  )
}

export default Update
