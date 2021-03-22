import { Button, Icon, Tag } from 'antd'
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
              indicator: { id: indicator.id, title: indicator.title, type: indicator.type },
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
        (index > 0 && pendingUpdates[index - 1].period.id === update.period.id) ? '' : (
          <div className="period-caption">{moment(update.period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(update.period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</div>
        ),
        <div className="row">
          <ul>
            {update.indicator.type === 1 &&
            <li>
              <div className="label">value</div>
              <strong className="value">{update.value}</strong>
            </li>
            }
            {update.indicator.type === 2 &&
            <li>
              <div className="label">update</div>
              <div className="qualitative-value">
                <ShowMoreText lines={7}>{update.text}</ShowMoreText>
              </div>
            </li>
            }
            <CondWrap wrap={update.indicator.type === 2}>
              <li>
                <div className="label">submitted</div>
                <div className="value">{moment(update.createdAt).fromNow()} by {update.userDetails.firstName} {update.userDetails.lastName}</div>
              </li>
              {update.fileSet?.length > 0 &&
                <li className="attachments">
                  <div className="label">attachments</div>
                  {update.fileSet.map(file => {
                    const parts = file.file.split('/')
                    const filename = parts[parts.length - 1]
                    const nameParts = filename.split('.')
                    return <a href={file.file}><Tag>{nameParts[nameParts.length - 1]}</Tag>{filename.length > 40 ? `${filename.substr(0, 37)}...` : filename}</a>
                  })}
                </li>
              }
            </CondWrap>
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

const CondWrap = ({ wrap, children }) => {
  if(wrap){
    return <li><ul>{children}</ul></li>
  }
  return children
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
