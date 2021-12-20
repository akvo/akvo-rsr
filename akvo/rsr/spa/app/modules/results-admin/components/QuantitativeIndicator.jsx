import React from 'react'
import { Form, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { nicenum } from '../../../utils/misc'

const { Text } = Typography

const QuantitativeIndicator = ({ indicator, period, numerator, denominator, amountValue }) => {
  const { t } = useTranslation()
  let currentActualValue = null
  if (period?.updates?.length) {
    currentActualValue = period?.updates?.filter(it => it.status === 'A').reduce((acc, val) => acc + val.value, 0)
  }
  return (
    <Form layout="vertical">
      {
        indicator.measure === '1'
          ? (
            <>
              <Form.Item label={period?.disaggregationTargets.length > 0 ? t('Total value') : t('Value')}>
                <Text strong>{amountValue}</Text>
              </Form.Item>
              <br />
              <div className="updated-actual">
                <div className="cap">{t('Updated actual value')}</div>
                <div className="value">
                  <b>{currentActualValue ? nicenum(currentActualValue) : '-'}</b>
                  {period.targetValue > 0 && <small>{(Math.round((currentActualValue / period.targetValue) * 100 * 10) / 10)}% of target</small>}
                </div>
              </div>
            </>
          )
          : (
            <>
              <Form.Item label={t('Numerator')}>
                <Text>{numerator || '-'}</Text>
              </Form.Item>
              <Form.Item label={t('Denominator')}>
                <Text strong>{denominator || '-'}</Text>
              </Form.Item>
              <div className="perc">
                {(numerator && denominator) && `${Math.round((numerator / denominator) * 100 * 10) / 10} %`}
              </div>
            </>
          )
      }
    </Form>
  )
}

export default QuantitativeIndicator
