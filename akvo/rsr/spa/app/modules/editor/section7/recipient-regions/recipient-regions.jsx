import React from 'react'
import { Button, Form, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import { doesFieldExist, getValidationSets } from '../../../../utils/validation-utils'
import validationDefs from './validations'
import REGION_OPTIONS from './regions.json'

const { Item } = Form

const RecipientRegions = ({ formPush, validations }) => {
  const { t } = useTranslation()
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  return (
    <div>
      <h3>{t('Recipient region')}</h3>
      <ItemArray
        setName="recipientRegions"
        sectionIndex={7}
        header={(index, region) => (
          <span>{t('recipient region')}: {region && REGION_OPTIONS.find(it => it.value === region).label}</span>
        )}
        headerField="region"
        formPush={formPush}
        panel={name => (
          <div>
            <Item label={<InputLabel tooltip={t('This identifies the region in which the activity takes place. Regions can be supra-national (a geographical or administrative grouping of countries into a region - e.g. Sub-Saharan Africa, Mekong Delta) or \'global\' (activities benefiting substantially all developing countries). For the codes to use, please see <a href="http://iatistandard.org/202/codelists/Region/" target="_blank">http://iatistandard.org/202/codelists/Region/</a>.')}>{t('region')}</InputLabel>}>
              <FinalField
                name={`${name}.region`}
                control="select"
                options={REGION_OPTIONS}
                optionFilterProp="children"
                showSearch
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                withEmptyOption
              />
            </Item>
            {fieldExists('regionVocabulary') && (
              <Row gutter={16}>
                <Col span={12}>
                <Item label={<InputLabel optional tooltip={t('The vocabulary from which the region code is drawn. If it is not present 1 – \'OECD DAC\' is assumed. For more information, see <a href="http://iatistandard.org/202/codelists/RegionVocabulary/" target="_blank">http://iatistandard.org/202/codelists/RegionVocabulary/</a>.')}>{t('vocabulary')}</InputLabel>}>
                <FinalField
                  name={`${name}.regionVocabulary`}
                  control="select"
                  options={[
                    {value: '1', label: 'OECD DAC'},
                    {value: '2', label: 'UN'},
                    {value: '99', label: t('Reporting organisation')}
                  ]}
                  withEmptyOption
                />
                </Item>
                </Col>
                <Col span={12}>
                  <Item label={<InputLabel optional tooltip={t('If the vocabulary is 99 (reporting organisation), the URI where this internal vocabulary is defined.')}>{t('vocabulary URI')}</InputLabel>}>
                  <FinalField
                    name={`${name}.regionVocabularyUri`}
                    control="input"
                  />
                  </Item>
                </Col>
              </Row>
            )}
            <div className="percentage-row">
              {fieldExists('percentage') && (
                <Item label={<InputLabel tooltip={t('If the activity occurs in more than one region, the percentage of activity commitment allocated to each region should be provided if available. Percentages should add up to 100% of the activity being reported if they are shown for each region. Use a period to denote decimals.')}>{t('Percentage')}</InputLabel>}>
                <FinalField
                  name={`${name}.percentage`}
                  suffix={<span>%</span>}
                  className="percentage-input"
                  control="input"
                />
                </Item>
              )}
              {fieldExists('text') && (
                <Item label={<InputLabel optional>{t('description')}</InputLabel>}>
                <FinalField
                  name={`${name}.text`}
                  control="textarea"
                  rows={2}
                />
                </Item>
              )}
            </div>
          </div>
        )}
        addButton={({onClick}) => (
          <Button onClick={onClick} icon="plus" type="dashed" block>
            {t('Add recipient region')}
          </Button>
        )}
      />
    </div>
  )
}

export default RecipientRegions
