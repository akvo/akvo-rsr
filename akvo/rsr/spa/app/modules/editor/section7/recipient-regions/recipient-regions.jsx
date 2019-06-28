import React from 'react'
import { Button, Form, Row, Col } from 'antd'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'
import { doesFieldExist, getValidationSets } from '../../../../utils/validation-utils'
import validationDefs from './validations'
import REGION_OPTIONS from './regions.json'

const { Item } = Form

const RecipientRegions = ({ formPush, validations }) => {
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  return (
    <div>
      <h3>Recipient region</h3>
      <ItemArray
        setName="recipientRegions"
        sectionIndex={7}
        header={(index, region) => (
          <span>Recipient region: {region && REGION_OPTIONS.find(it => it.value === region).label}</span>
        )}
        headerField="region"
        formPush={formPush}
        panel={name => (
          <div>
            <Item label={<InputLabel tooltip="...">Region</InputLabel>}>
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
                <Item label={<InputLabel optional tooltip="...">Vocabulary</InputLabel>}>
                <FinalField
                  name={`${name}.regionVocabulary`}
                  control="select"
                  options={[
                    {value: '1', label: 'OECD DAC'},
                    {value: '2', label: 'UN'},
                    {value: '99', label: 'Reporting Organisation'}
                  ]}
                  withEmptyOption
                />
                </Item>
                </Col>
                <Col span={12}>
                  <Item label={<InputLabel optional>Vocabulary URI</InputLabel>}>
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
                <Item label="Percentage">
                <FinalField
                  name={`${name}.percentage`}
                  suffix={<span>%</span>}
                  className="percentage-input"
                  control="input"
                />
                </Item>
              )}
              {fieldExists('text') && (
                <Item label={<InputLabel optional>Description</InputLabel>}>
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
            Add recipient region
          </Button>
        )}
      />
    </div>
  )
}

export default RecipientRegions
