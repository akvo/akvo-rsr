import React from 'react'
import { Form, Input, Collapse, Button, Popconfirm } from 'antd'
import { FieldArray } from 'react-final-form-arrays'
import { connect } from 'react-redux'

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
                title="Are you sure to delete this sector?"
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
            <AutoSave sectionIndex={6} setName={`${parentName}.sectors`} itemIndex={index} />
            <FinalField
              name={`${name}.code`}
              render={({ input }) => (
                <Item label={<InputLabel optional>Name</InputLabel>}>
                  <Input {...input} />
                </Item>
              )}
            />
            <Item label={<InputLabel optional>Vocabulary</InputLabel>}>
            <FinalField
              name={`${name}.vocabulary`}
              control="select"
              options={VOCABULARY_OPTIONS}
              withEmptyOption
            />
            </Item>
            <Item label={<InputLabel optional>URI</InputLabel>}>
            <FinalField
              name={`${name}.vocabularyUri`}
            />
            </Item>
            <Item label={<InputLabel optional>Description</InputLabel>}>
            <FinalField
              name={`${name}.text`}
            />
            </Item>
          </div>
          </Panel>
        )}
      />
      <Button icon="plus" block type="dashed" onClick={add}>Add sector</Button>
      </Aux>
    )}
    </FieldArray>
  )
})


export default Sectors
