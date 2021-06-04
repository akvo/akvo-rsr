import React from 'react'
import { PageHeader as AntPageHeader, Switch, Typography } from 'antd'

const { Text } = Typography

export const PageHeader = ({ title, isMapView, onChange, children }) => {
  return (
    <AntPageHeader
      className="wcaro-page-header"
      title={(
        <>
          <small>PROGRAMME</small>
          <h1 className="wcaro-title">{title}</h1>
        </>
      )}
      extra={(
        <div style={{ paddingTop: '0.5em' }}>
          {title === 'Loading...'
            ? title
            : (
              <>
                <Switch defaultChecked={isMapView} size="small" key={1} onChange={checked => onChange(checked)} />&nbsp;
                <Text key={2} style={{ fontSize: '12px' }} strong>
                  MAP VIEW
                </Text>
              </>
            )
          }
        </div>
      )}
      style={{ position: 'fixed', width: '100%', marginTop: '3.5em', zIndex: 2 }}
    >
      {children}
    </AntPageHeader>
  )
}
