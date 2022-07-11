/* eslint-disable react/no-danger */
import React from 'react'
import ShowMoreText from 'react-show-more-text'
import moment from 'moment'
import classNames from 'classnames'

const ValueComments = ({ items }) => (
  <div className={classNames('comments', { 'no-comments': items.length === 0 })}>
    {
      items.length
        ?
        <ul>
          {items.map((item, key) =>
            <li key={key}>
              <b>{`${item?.userDetails?.firstName} ${item?.userDetails?.lastName}`}</b> <span className="date">{moment(item.createdAt).format('HH:mm, DD MMM YYYY')}</span>
              <ShowMoreText lines={7}>
                <p dangerouslySetInnerHTML={{ __html: item.narrative.replace(/\n/g, '<br />') }} />
              </ShowMoreText>
            </li>
          )}
        </ul>
        : <p>No comments for this period</p>
    }
  </div>
)

export default ValueComments
