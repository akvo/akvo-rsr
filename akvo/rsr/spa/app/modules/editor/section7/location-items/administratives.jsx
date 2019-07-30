import React from 'react'
import { Form, Row, Col, Popconfirm, Button, Collapse, Tag, Select, Input } from 'antd'
import { FieldArray } from 'react-final-form-arrays'
import { connect } from 'react-redux'
import { Field } from 'react-final-form'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import VOCABULARY_OPTIONS from './admin-vocab-options.json'
import EUTF_ADMIN_CODES_OPTIONS from './eutf-admin-codes.json'
import Accordion from '../../../../utils/accordion'
import { removeSetItem } from '../../actions'
import AutoSave from '../../../../utils/auto-save'

const { Item } = Form
const { Panel } = Collapse
const { Option } = Select
const Aux = node => node.children

const Administratives = connect(null, { removeSetItem })(({ push, parentName, locationId, removeSetItem, primaryOrganisation }) => { // eslint-disable-line
  const { t } = useTranslation()
  const add = () => {
    push(`${parentName}.administratives`, { location: locationId })
  }
  const remove = (index, fields) => {
    fields.remove(index)
    removeSetItem(7, `${parentName}.administratives`, index)
  }
  return (
    <FieldArray name={`${parentName}.administratives`} subscription={{}}>
    {({ fields }) => (
      <Aux>
      <Accordion
        finalFormFields={fields}
        setName={`${parentName}.administratives`}
        renderPanel={(name, index) => (
          <Panel
            key={`${index}`}
            forceRender
            header={(
              <span>
                {t('Administrative')} {index + 1}
                <FinalField
                  name={`${name}.vocabulary`}
                  render={({input}) => input.value ? <span>&nbsp;<Tag>{input.value}</Tag></span> : ''}
                />
              </span>
            )}
            extra={(
              /* eslint-disable-next-line */
              <div onClick={(e) => { e.stopPropagation() }} style={{ display: 'flex' }}>
              <div className="delete-btn-holder">
              <Popconfirm
                title={t('Are you sure to delete this administrative?')}
                onConfirm={() => remove(index, fields)}
                okText="Yes"
                cancelText="No"
              >
                <Button size="small" icon="delete" className="delete-panel" />
              </Popconfirm>
              </div>
              </div>
            )}
          >
          <div>
            <AutoSave sectionIndex={7} setName={`${parentName}.administratives`} itemIndex={index} />
            <Item label={<InputLabel optional tooltip={t('For reference: <a href="http://iatistandard.org/202/codelists/GeographicVocabulary/" target="_blank">http://iatistandard.org/202/codelists/GeographicVocabulary/</a>.')}>{t('vocabulary')}</InputLabel>}>
            <FinalField
              name={`${name}.vocabulary`}
              control="select"
              options={VOCABULARY_OPTIONS}
              withEmptyOptions
            />
            </Item>
            <Row gutter={16}>
              <Col span={12}>
                <Item label={<InputLabel optional tooltip={t('Coded identification of national and sub-national divisions according to recognised administrative boundary repositories. Multiple levels may be reported.')}>{t('administrative code')}</InputLabel>}>
                <Field
                  name={`${name}.vocabulary`}
                  render={(vocabProps) => (
                    <FinalField
                      name={`${name}.code`}
                      render={({input}) => {
                        if(primaryOrganisation === 3394 && vocabProps.input.value === 'A4'){
                          return (
                            <Select {...input}>
                              {EUTF_ADMIN_CODES_OPTIONS.map(option => <Option value={option.value}>{option.label}</Option>)}
                            </Select>
                          )
                        }
                        return <Input {...input} />
                      }}
                    />
                  )}
                />
                </Item>
              </Col>
              <Col span={12}>
                <Item label={<InputLabel optional>{t('administrative level')}</InputLabel>}>
                <FinalField
                  name={`${name}.level`}
                  control="input"
                />
                </Item>
              </Col>
            </Row>
          </div>
          </Panel>
        )}
      />
      <Button icon="plus" block type="dashed" onClick={add}>{t('Add administrative')}</Button>
      </Aux>
    )}
    </FieldArray>
  )
})


export default Administratives
