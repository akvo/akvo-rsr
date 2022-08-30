import React from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { statusTerminology } from '../utils/constants'

export const DeclinedStatus = ({ update }) => {
  const { t } = useTranslation()
  return [
    <div className="declined">
      <div>
        <b className="status">{t(statusTerminology.R)}</b><span>{moment(update?.lastModifiedAt).format('DD/MM/YYYY')}</span>
      </div>
      {update && update.reviewNote && [
        <div>
          <b>{t('Reason')}</b>
          <p>{update.reviewNote}</p>
        </div>
      ]}
    </div>
  ]
}
