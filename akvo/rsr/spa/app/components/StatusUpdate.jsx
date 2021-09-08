import React from 'react'
import moment from 'moment'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Text } = Typography
export const StatusUpdate = ({ status, userDetails, lastModifiedAt }) => {
  const { t } = useTranslation()
  switch (status) {
    case 'D':
      return (
        <div className="submitted draft">
          <b>{t('Draft from')}</b><span>{moment(lastModifiedAt).format('DD/MM/YYYY')}</span>
          <br />
          <Text type="secondary" style={{ fontStyle: 'italic', fontSize: '12px', paddingLeft: '0.5em' }}>
            {t(`Created by: ${userDetails?.firstName} ${userDetails?.lastName}`)}
          </Text>
        </div>
      )
    case 'SR':
      return (
        <div className="submitted">
          <b>{t('Recently submitted ')}</b><span>{moment(lastModifiedAt).format('DD/MM/YYYY')}</span>
          <br />
          <Text type="secondary" style={{ fontStyle: 'italic', fontSize: '12px', paddingLeft: '0.5em' }}>
            {t(`Created by: ${userDetails?.firstName} ${userDetails?.lastName}`)}
          </Text>
        </div>
      )
    case 'P':
      return (
        <div className="submitted">
          <b>{t('Submitted')}</b>
          <span>{moment(lastModifiedAt).format('DD/MM/YYYY')}</span>&nbsp;
          <i>({moment(lastModifiedAt).fromNow()})</i>
        </div>
      )
    default:
      return null
  }
}
