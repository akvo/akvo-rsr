import { Button, Icon } from 'antd'
import React from 'react'
import moment from 'moment'
import TimeAgo from 'react-time-ago'
import ShowMoreText from 'react-show-more-text'
import './pending-approval.scss'

const PendingApproval = ({ results }) => {
  const pendingUpdates = []
  results.forEach(result => {
    result.indicators.forEach(indicator => {
      indicator.periods.forEach(period => {
        period.updates.forEach(update => {
          if (update.status === 'P') {
            pendingUpdates.push({
              ...update,
              indicator: { id: indicator.id, title: indicator.title },
              period: { id: period.id, periodStart: period.periodStart, periodEnd: period.periodEnd },
              result: { id: result.id, title: result.title },
            })
          }
        })
      })
    })
  })
  console.log(pendingUpdates)
  return (
    <div className="pending-approval-grid">
      {pendingUpdates.map((update, index) => [
      (index > 0 && pendingUpdates[index - 1].indicator.id === update.indicator.id) ? '' : (
        <ul>
          <li>
            <div className="label">result</div>
            <h4>{update.result.title}</h4>
          </li>
          <Icon type="right" />
          <li>
            <div className="label">indicator</div>
            <h4>{update.indicator.title}</h4>
          </li>
        </ul>
      ),
      <div className="row">
        <ul>
          <li>
            <div className="label">period</div>
            <div className="value">{moment(update.period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(update.period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</div>
          </li>
          <li>
            <div className="label">value</div>
            <strong className="value">{update.value}</strong>
          </li>
          <li>
            <div className="label">submitted</div>
            <div className="value">{moment(update.createdAt).fromNow()} by {update.userDetails.firstName} {update.userDetails.lastName}</div>
          </li>
          {/* <li>
            <div className="label">value comment</div>
            <small>
              {update.text}
            </small>
          </li> */}
          <li>
            <div className="label">attachments</div>
            <a href="#">file_name_here.jpg</a>
            <a href="#">another_file_name_here.jpg</a>
          </li>
        </ul>
        <div className="btns">
          <Button type="primary">Approve</Button>
          <Button type="link">Decline</Button>
        </div>
      </div>
      ])}
    </div>
  )
}

const Ago = ({ isoDate }) => {
  const date = new Date(isoDate)
  const now = new Date()
  const minutesAgo = (now.getTime() - date.getTime()) / (1000 * 60)
  const time = minutesAgo < 70
    ? <TimeAgo date={date} formatter={{ unit: 'minute' }} />
    : (
      <span>{moment(date).calendar(null, {
        sameDay: '[at] h:mma',
        lastDay: '[yesterday at] h:mma',
        lastWeek: '[last] dddd',
        sameElse: `[on] D MMM${now.getFullYear() !== date.getFullYear() ? ' YYYY' : ''}`
      })}
      </span>)
  return time
}

export default PendingApproval
