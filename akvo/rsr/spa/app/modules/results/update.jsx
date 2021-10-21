import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Button, Icon, Spin, Input, Collapse, List, Typography } from 'antd'
import Lightbox from 'react-image-lightbox'
import { useTranslation } from 'react-i18next'
import SimpleMarkdown from 'simple-markdown'
import 'react-image-lightbox/style.css'
import api from '../../utils/api'
import { AuditTrail } from '../../components/AuditTrail'

const { Panel } = Collapse
const { Text } = Typography
const mdParse = SimpleMarkdown.defaultBlockParse
const mdOutput = SimpleMarkdown.defaultOutput

const Update = ({ update, period, indicator }) => {
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [scores, setScores] = useState([])
  const [showNewComment, setShowNewComment] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isLbOpen, setLbOpen] = useState(false)
  const [openedPhotoIndex, setOpenedPhotoIndex] = useState(0)
  const [audits, setAudits] = useState([])
  const [textReport, setTextReport] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    setScores([])
    if (update?.id && loading) {
      api.get(`/indicator_period_data_framework/${update.id}/`)
        .then(({ data: { text, narrative, comments: cm, scoreIndices, userDetails, auditTrail } }) => {
          if (narrative.trim().length) setTextReport(mdOutput(mdParse(narrative)))
          setAudits(auditTrail)

          let latestComments = cm?.map(comment => ({ ...comment, userDetails }))
          if (
            text.trim().length &&
            latestComments.find((c) => !c.comment.toLowerCase().includes(text.toLowerCase()))
          ) {
            latestComments?.push({ ...update, comment: text })
          }
          latestComments = latestComments.filter((c) => (c.comment.trim().length))
          setComments(latestComments)
          if (scoreIndices) {
            setScores(scoreIndices.map(index => indicator.scores[index - 1]))
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [update, loading])
  const handleCancelComment = () => {
    setNewComment('')
    setShowNewComment(false)
  }
  const handleSubmitComment = () => {
    // setComments
    if (newComment.length > 0) {
      setSubmitting(true)
      api.post('/indicator_period_data_comment/', {
        comment: newComment,
        data: update.id
      })
        .then(({ data }) => {
          setSubmitting(false)
          setComments([data, ...comments])
          handleCancelComment()
        })
    }
  }
  if (loading) {
    return (
      <div className="update loading">
        <Spin indicator={<Icon type="loading" style={{ fontSize: 32 }} spin />} />
      </div>
    )
  }
  const filterImages = (positive) => (file) => {
    const filename = file.file.toLowerCase().split('.')
    return (filename[filename.length - 1] === 'jpg' || filename[filename.length - 1] === 'png') === positive
  }
  const attachments = update.fileSet.filter(filterImages(false))
  const photos = update.fileSet.filter(filterImages(true))
  return (
    <div className="update">
      {update.disaggregations.length > 0 &&
        <Disaggregations values={update.disaggregations} targets={period.disaggregationTargets} />
      }
      {scores.length > 0 && (
        <ul className="scores">
          {scores.map(score => <li><Icon type="check" /> {score}</li>)}
        </ul>
      )}
      {indicator.measure === '2' && [
        <div className="horizontal">
          {update.numerator ? (
            <div className="labeled">
              <label>Numerator</label>
              <b>{update.numerator}</b>
            </div>
          ) : null}
          {update.denominator ? (
            <div className="labeled">
              <label>Denominator</label>
              <b>{update.denominator}</b>
            </div>
          ) : null}
        </div>
      ]}
      {attachments.length > 0 && [
        <ul className="file-list">
          {attachments.map(file =>
            <li>
              <a href={file.file} target="_blank" rel="noopener noreferrer">
                <Icon type="paper-clip" /> {file.file.split('/').filter((val, index, arr) => index === arr.length - 1)[0]}
              </a>
            </li>
          )}
        </ul>
      ]}
      {photos.length > 0 && [
        <ul className="photo-list">
          {photos.map((photo, index) => [
            <li onClick={() => { setOpenedPhotoIndex(index); setLbOpen(true) }}>
              <img src={photo.file} />
            </li>
          ])}
        </ul>
      ]}
      {isLbOpen && [
        <Lightbox
          mainSrc={photos[openedPhotoIndex].file}
          nextSrc={photos[(openedPhotoIndex + 1) % photos.length]?.file}
          prevSrc={photos[(openedPhotoIndex + photos.length - 1) % photos.length]?.file}
          onCloseRequest={() => setLbOpen(false)}
          onMovePrevRequest={() => setOpenedPhotoIndex((openedPhotoIndex + photos.length - 1) % photos.length)}
          onMoveNextRequest={() => setOpenedPhotoIndex((openedPhotoIndex + photos.length + 1) % photos.length)}
        />
      ]}
      {textReport && (
        <div style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 16 }} strong>{t('Narrative Report')}</Text>
          <Text>{textReport}</Text>
        </div>
      )}
      <Collapse
        accordion
        bordered={false}
        defaultActiveKey={['comment-panel']}
        expandIconPosition="right"
      >
        <Panel
          header={(
            <Text strong>
              <Icon type="message" />&nbsp;
              Value Comment
            </Text>
          )}
          key="comment-panel"
        >
          {showNewComment &&
            <div className="new-comment">
              <Input.TextArea rows={2} value={newComment} onChange={(e) => setNewComment(e.target.value)} />
              <Button type="primary" size="small" loading={submitting} onClick={handleSubmitComment}>Submit</Button>
              <Button type="link" size="small" onClick={handleCancelComment}>Cancel</Button>
            </div>
          }
          <List
            dataSource={comments}
            renderItem={comment => (
              <List.Item key={comment.id}>
                <List.Item.Meta
                  title={`${comment.userDetails.firstName} ${comment.userDetails.lastName}`}
                  description={comment.comment}
                />
                <div>{moment(comment.createdAt).format('DD MMM YYYY')}</div>
              </List.Item>
            )}
          />
        </Panel>
        <Panel
          header={(
            <Text strong>
              <Icon type="history" />&nbsp;
              Audit Trail
            </Text>
          )} key="history-panel"
        >
          <AuditTrail {...{ audits, textReport, disaggregations: update?.disaggregations }} />
        </Panel>
      </Collapse>
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
