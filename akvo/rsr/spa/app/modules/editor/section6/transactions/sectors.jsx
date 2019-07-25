import React from 'react'
import { Form, Input, Collapse, Button, Popconfirm } from 'antd'
import { FieldArray } from 'react-final-form-arrays'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import VOCABULARY_OPTIONS from './options/vocabulary.json'
import Accordion from '../../../../utils/accordion'
import AutoSave from '../../../../utils/auto-save'
import { removeSetItem } from '../../actions'

const { Item } = Form
const { Panel } = Collapse

const Aux = node => node.children

const Sectors = connect(null, { removeSetItem })(({ push, parentName, transactionId, removeSetItem}) => { // eslint-disable-line
  const { t } = useTranslation()
  const add = () => {
    push(`${parentName}.sectors`, { transaction: transactionId })
  }
  const remove = (index, fields) => {
    fields.remove(index)
    removeSetItem(6, `${parentName}.sectors`, index)
  }
  return (
    <FieldArray name={`${parentName}.sectors`} subscription={{}}>
    {({ fields }) => (
      <Aux>
      <Accordion
        finalFormFields={fields}
        setName={`${parentName}.sectors`}
        renderPanel={(name, index) => (
          <Panel
            key={`${index}`}
            forceRender
            header={(
              <span>
                Sector {index + 1}
                <FinalField
                  name={`${name}.code`}
                  render={({input}) => input.value ? `: ${input.value}` : ''}
                />
              </span>
            )}
            extra={(
              /* eslint-disable-next-line */
              <div onClick={(e) => { e.stopPropagation() }} style={{ display: 'flex' }}>
              <div className="delete-btn-holder">
              <Popconfirm
                title={t('Are you sure to delete this sector?')}
                onConfirm={() => remove(index, fields)}
                okText={t('Yes')}
                cancelText={t('No')}
              >
                <Button size="small" icon="delete" className="delete-panel" />
              </Popconfirm>
              </div>
              </div>
            )}
          >
          <div>
            <AutoSave sectionIndex={6} setName={`${parentName}.sectors`} itemIndex={index} />
            <FinalField
              name={`${name}.code`}
              render={({ input }) => (
                <Item label={<InputLabel optional tooltip={t('A recognised code, from a recognised vocabulary, classifying the purpose of this transaction. If this element is used then ALL transaction elements should contain a transaction/sector element and iati-activity/sector should NOT be used. This element can be used multiple times, but only one sector can be reported per vocabulary.')}>{t('Name')}</InputLabel>}>
                  <Input {...input} />
                </Item>
              )}
            />
            <Item label={<InputLabel optional tooltip={t('An IATI code for the vocabulary (codelist) used for sector classifications. If omitted, OECD DAC 5-digit Purpose Codes are assumed. Note that at transaction level, only one sector per vocabulary can be reported.')}>{t('vocabulary')}</InputLabel>}>
            <FinalField
              name={`${name}.vocabulary`}
              control="select"
              options={VOCABULARY_OPTIONS}
              withEmptyOption
            />
            </Item>
            <Item label={<InputLabel optional tooltip={t('If the vocabulary is 99 (reporting organisation), the URI where this internal vocabulary is defined.')}>URI</InputLabel>}>
            <FinalField
              name={`${name}.vocabularyUri`}
            />
            </Item>
            <Item label={<InputLabel optional>{t('Description')}</InputLabel>}>
            <FinalField
              name={`${name}.text`}
            />
            </Item>
          </div>
          </Panel>
        )}
      />
      <Button icon="plus" block type="dashed" onClick={add}>{t('Add sector')}</Button>
      </Aux>
    )}
    </FieldArray>
  )
})


export default Sectors
