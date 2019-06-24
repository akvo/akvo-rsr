import React from 'react'
import { Form, Row, Col, Popconfirm, Button, Collapse, Tag } from 'antd'
import { FieldArray } from 'react-final-form-arrays'
import { connect } from 'react-redux'

import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import VOCABULARY_OPTIONS from './admin-vocab-options.json'
import Accordion from '../../../../utils/accordion'
import { removeSetItem } from '../../actions'
import AutoSave from '../../../../utils/auto-save'

const { Item } = Form
const { Panel } = Collapse
const Aux = node => node.children

const Administratives = connect(null, { removeSetItem })(({ push, parentName, locationId, removeSetItem }) => { // eslint-disable-line
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
                Administrative {index + 1}
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
                title="Are you sure to delete this administrative?"
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
            <Item label={<InputLabel optional>Vocabulary</InputLabel>}>
            <FinalField
              name={`${name}.vocabulary`}
              control="select"
              options={VOCABULARY_OPTIONS}
              withEmptyOptions
            />
            </Item>
            <Row gutter={16}>
              <Col span={12}>
                <Item label={<InputLabel optional>Administrative code</InputLabel>}>
                <FinalField
                  name={`${name}.code`}
                  control="input"
                />
                </Item>
              </Col>
              <Col span={12}>
                <Item label={<InputLabel optional>Level</InputLabel>}>
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
      <Button icon="plus" block type="dashed" onClick={add}>Add administrative</Button>
      </Aux>
    )}
    </FieldArray>
  )
})


export default Administratives
