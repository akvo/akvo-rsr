/* eslint-disable react/no-danger */
import React from 'react'
import ShowMoreText from 'react-show-more-text'
import moment from 'moment'

const ApprovedUpdates = ({ items }) => (
  <ul className="updates">
    {items.map(item => (
      <li>
        <div className="leftside">
          <i>{moment(item.createdAt).format('HH:mm, DD MMM YYYY')}</i>
          <i>{item.user.name}</i>
        </div>
        <div className="text">
          <ShowMoreText lines={7}>
            <p dangerouslySetInnerHTML={{ __html: item.narrative.replace(/\n/g, '<br />') }} />
          </ShowMoreText>
        </div>
        {item.scoreIndex != null && (
          <div className={`score-box score-${item.scoreIndex}`}>score {item.scoreIndex + 1}</div>
        )}
      </li>
    ))}
  </ul>
)

export default ApprovedUpdates
