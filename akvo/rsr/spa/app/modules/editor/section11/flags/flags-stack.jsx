import React from 'react'
import { Button, Radio, Form } from 'antd'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'

const { Item } = Form

const FLAG_CODES = [
  { value: '1', label: 'Free standing technical cooperation'},
  { value: '2', label: 'Programme-based approach'},
  { value: '3', label: 'Investment project'},
  { value: '4', label: 'Associated financing'}
]

const FlagsStack = ({ formPush, crsParent }) => {
  const { t } = useTranslation()
  return (
    <ItemArray
      setName="flags"
      sectionIndex={11}
      header={(index, code) => {
        return <span>{t('CRS++ other flag')}: {code && FLAG_CODES.find(it => it.value === code).label}</span>
      }}
      headerField="code"
      newItem={{ crs: crsParent ? crsParent.id : null }}
      formPush={formPush}
      panel={name => (
        <div className="channel-code-inputs">
          <FinalField
            name={`${name}.code`}
            control="select"
            options={FLAG_CODES}
            withLabel
            dict={{ label: t('Code'), tooltip: t('An IATI code describing the equivalent CRS++ columns. See the <a href="http://iatistandard.org/202/codelists/CRSAddOtherFlags/" target="_blank">IATI codelist</a>.') }}
          />
          <Item label={<InputLabel tooltip={t('Indicate whether the flag applies or not.')}>{t('significance')}</InputLabel>}>
            <FinalField
              name={`${name}.significance`}
              render={({ input, validateStatus}) => {
                console.log(validateStatus)
                return (
                  <Radio.Group {...input} className={validateStatus === 'error' ? 'required' : null}>
                    <Radio.Button value>{t('Yes')}</Radio.Button>
                    <Radio.Button value={false}>{t('No')}</Radio.Button>
                  </Radio.Group>
                )
              }}
            />
          </Item>
        </div>
      )}
      addButton={({ onClick }) => <Button onClick={onClick} className="bottom-btn" block icon="plus" type="dashed" disabled={!crsParent}>{t('Add CRS++ other flag')}</Button>}
    />
  )
}

export default FlagsStack
