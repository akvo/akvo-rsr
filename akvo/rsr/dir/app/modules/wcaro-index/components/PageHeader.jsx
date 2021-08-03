import React from 'react'
import { Link } from 'react-router-dom'
import { PageHeader as AntPageHeader, Switch, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Text } = Typography

export const PageHeader = ({
  title,
  user,
  isMapView,
  onChange,
  children
}) => {
  const { t } = useTranslation()
  return (
    <AntPageHeader
      className="wcaro-page-header"
      title={(
        <>
          <small>{t('PROGRAMME')}</small>
          <Link to="/"><h1 className="wcaro-title">{title || t('Loading...')}</h1></Link>
        </>
      )}
      extra={(
        <div style={{ paddingTop: '0.5em' }}>
          {user && title && (
            <>
              <Switch defaultChecked={isMapView} size="small" key={1} onChange={checked => onChange(checked)} />&nbsp;
              <Text key={2} style={{ fontSize: '12px' }} strong>
                {t('MAP VIEW')}
              </Text>
            </>
          )}
        </div>
      )}
      style={{ position: 'fixed', width: '100%', marginTop: '3.5em', zIndex: 2 }}
    >
      {children}
    </AntPageHeader>
  )
}
