import React from 'react'
import { Spin, Icon } from 'antd'
import moment from 'moment'
import { useFetch } from '../utils/hooks'

export const DeclinedStatus = ({ updateForRevision, t }) => {
  const [update, loading] = useFetch(`/indicator_period_data_framework/${updateForRevision.id}/`)
  return [
    <div className="declined">
      <div>
        <b className="status">{t('Declined')}</b><span>{moment(updateForRevision.lastModifiedAt).format('DD/MM/YYYY')}</span><i>{t('Returned for revision')}</i>
      </div>
      {loading && <div><Spin indicator={<Icon type="loading" style={{ fontSize: 21 }} spin />} /></div>}
      {update && update.reviewNote && [
        <div>
          <b>{t('Reason')}</b>
          <p>{update.reviewNote}</p>
        </div>
      ]}
    </div>
  ]
}
