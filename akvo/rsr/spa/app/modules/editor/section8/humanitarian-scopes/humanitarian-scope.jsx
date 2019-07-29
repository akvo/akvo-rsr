import React from 'react'
import { Form, Button, Radio, Col, Row } from 'antd'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'

const { Item } = Form

const HumanitarianScopes = ({ formPush }) => {
  const { t } = useTranslation()
  return (
    <div>
      <h3>{t('humanitarian scopes')}</h3>
      <ItemArray
        setName="humanitarianScopes"
        sectionIndex={8}
        header={`${t('Humanitarian scope')} $index`}
        formPush={formPush}
        panel={name => (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Item label={<InputLabel optional tooltip={t('The type of event or action being classified. See the <a href="http://iatistandard.org/202/codelists/HumanitarianScopeType/" target="_blank">IATI codelist</a>.')}>{t('Type')}</InputLabel>}>
                  <FinalField
                    name={`${name}.type`}
                    render={({ input }) => (
                      <Radio.Group {...input}>
                        <Radio.Button value="1">{t('Emergency')}</Radio.Button>
                        <Radio.Button value="2">{t('Appeal')}</Radio.Button>
                      </Radio.Group>
                    )}
                  />
                </Item>
              </Col>
              <Col span={12}>
                <FinalField name={`${name}.type`} subscription={{ value: true }}>
                  {({ input: { value } }) => (
                    <Item label={<InputLabel optional={value === '' || value === undefined}>{t('Code')}</InputLabel>}>
                      <FinalField
                        name={`${name}.code`}
                        control="input"
                      />
                    </Item>
                  )}
                </FinalField>
              </Col>
            </Row>
            <Item label={<InputLabel optional>{t('Description')}</InputLabel>}>
              <FinalField
                control="input"
                name={`${name}.text`}
              />
            </Item>
            <FinalField name={`${name}.type`} subscription={{ value: true }}>
              {({ input: { value } }) => (
                <Item label={<InputLabel optional={value === '' || value === undefined}>{t('Vocabulary')}</InputLabel>}>
                  <FinalField
                    control="select"
                    options={[{ value: '1-2', label: '1-2 Glide' }, { value: '2-1', label: `2-1 ${t('Humanitarian plan')}` }, { value: '99', label: `99 ${t('Reporting organisation')}` }]}
                    name={`${name}.vocabulary`}
                  />
                </Item>
              )}
            </FinalField>
            <Item label={<InputLabel optional>{t('vocabulary URI')}</InputLabel>}>
              <FinalField
                control="input"
                name={`${name}.vocabularyUri`}
              />
            </Item>
          </div>
        )}
        addButton={({ onClick }) => (
          <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>{t('Add Humanitarian Scope')}</Button>
        )}
      />
    </div>
  )
}

export default HumanitarianScopes
