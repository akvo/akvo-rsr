import React from 'react'
import { Button, Form } from 'antd'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'

const { Item } = Form

const LegaciesStack = ({ formPush }) => {
  const { t } = useTranslation()
  return (
    <ItemArray
      setName="legacies"
      sectionIndex={11}
      header={`${t('Legacy data')} $index: $name`}
      formPush={formPush}
      panel={name => (
        <div>
          <Item label={<InputLabel optional tooltip={t('The original field name in the reporting organisation\'s system.')}>{t('name')}</InputLabel>}>
            <FinalField name={`${name}.name`} />
          </Item>
          <Item label={<InputLabel optional tooltip={t('The original field value in the reporting organisation\'s system.')}>{t('value')}</InputLabel>}>
          <FinalField name={`${name}.value`} />
          </Item>
          <Item label={<InputLabel optional tooltip={t('The name of the equivalent IATI element.')}>{t('IATI equivalent')}</InputLabel>}>
          <FinalField name={`${name}.iatiEquivalent`} />
          </Item>
        </div>
      )}
      addButton={({onClick}) => <Button onClick={onClick} className="bottom-btn" block icon="plus" type="dashed">{t('Add legacy data')}</Button>}
    />
  )
}

export default LegaciesStack
