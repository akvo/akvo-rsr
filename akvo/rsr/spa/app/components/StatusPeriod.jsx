import React from 'react'
import SVGInline from 'react-svg-inline'
import { Button } from 'antd'
import approvedSvg from '../images/status-approved.svg'
import pendingSvg from '../images/status-pending.svg'
import revisionSvg from '../images/status-revision.svg'
import { DeclinePopup } from './DeclinePopup'

const Aux = node => node.children

export const StatusPeriod = ({ update, pinned, index, handleUpdateStatus, t }) => {
  if (update.status === 'A') {
    return (
      <div className="status approved">
        <SVGInline svg={approvedSvg} />
        <div className="text">
          {t('Approved')}
          {pinned === String(index) && [
            <Aux><br />{update.approvedBy && update.approvedBy.name && `by ${update.approvedBy.name}`}</Aux>
          ]}
        </div>
      </div>
    )
  }
  if (update.status === 'P') {
    return [
      <div className="status pending" key="status-pending">
        <SVGInline svg={pendingSvg} />
        <div className="text">{t('Pending')}</div>
      </div>,
      handleUpdateStatus && String(pinned) === String(index) &&
      <div className="btns" key="status-btns">
        <Button type="primary" size="small" onClick={(e) => handleUpdateStatus(update, 'A', undefined, e)}>{t('Approve')}</Button>
        <DeclinePopup onConfirm={(reviewNote) => handleUpdateStatus(update, 'R', reviewNote)}>
          <Button type="link" size="small">{t('Decline')}</Button>
        </DeclinePopup>
      </div>
    ]
  }
  if (update.status === 'R') {
    return (
      <div className="status returned">
        <SVGInline svg={revisionSvg} />
        <div className="text">{t('Returned for revision')}</div>
      </div>
    )
  }
  if (update.status === 'D' && update.statusDisplay) {
    return (
      <div className="status label">
        <span>{update.statusDisplay}</span>
      </div>
    )
  }
  return null
}
