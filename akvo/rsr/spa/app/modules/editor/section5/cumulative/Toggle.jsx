import React from 'react'
import { connect } from 'react-redux'
import { Form, Radio } from 'antd'
import { useTranslation } from 'react-i18next'

import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'
import BlockToggleApi from './BlockToggleApi'

const { Item } = Form

const Toggle = ({
  id: indicatorID,
  name,
  results,
}) => {
  const { t } = useTranslation()

  const allIndicators = results?.flatMap((r) => r?.indicators)
  const _indicator = allIndicators?.find((i) => i?.id === indicatorID)
  const disabled = (_indicator?.contributionCount === undefined || _indicator?.contributionCount > 0)
  return (
    <>
      {_indicator && <BlockToggleApi name={name} indicator={_indicator} />}
      <Item
        label={
          <InputLabel tooltip={t('Select if indicators report a running total so that each reported actual includes the previously reported actual and adds any progress made since the last reporting period.')}>
            {t('Cumulative')}
          </InputLabel>
        }
      >
        <FinalField
          name={`${name}.cumulative`}
          render={({ input }) => (
            <Radio.Group {...input} disabled={disabled}>
              <Radio.Button value={true}>{t('Yes')}</Radio.Button>
              <Radio.Button value={false}>{t('No')}</Radio.Button>
            </Radio.Group>
          )}
        />
      </Item>
    </>
  )
}

export default connect(
  ({
    editorRdr: {
      section5: {
        fields: {
          results,
        },
        errors
      }
    }
  }) => ({ results, errors }),
  null
)(Toggle)
