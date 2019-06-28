import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Collapse, Col, Row, Popconfirm } from 'antd'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'

import RTE from '../../../../utils/rte'
import FinalField from '../../../../utils/final-field'
import InputLabel from '../../../../utils/input-label'
import Accordion from '../../../../utils/accordion'
import AutoSave from '../../../../utils/auto-save'
import { addSetItem, removeSetItem } from '../../actions'

const { Item } = Form
const { Panel } = Collapse
const Aux = node => node.children

const Periods = connect(null, { addSetItem, removeSetItem })(({ fieldName, formPush, addSetItem, removeSetItem, indicatorId, primaryOrganisation }) => { // eslint-disable-line
  const add = () => {
    const newItem = { indicator: indicatorId }
    formPush(`${fieldName}.periods`, newItem)
  }
  const remove = (index, fields) => {
    fields.remove(index)
    removeSetItem(5, `${fieldName}.periods`, index)
  }
  return (
    <Aux>
    <FieldArray name={`${fieldName}.periods`} subscription={{}}>
      {({ fields }) => (
        <Aux>
        <div className="ant-col ant-form-item-label">
          <InputLabel tooltip="...">Periods</InputLabel>
        </div>
        {fields.length > 0 &&
        <Accordion
          className="periods-list"
          finalFormFields={fields}
          setName={`${fieldName}.periods`}
          renderPanel={(name, index) => (
            <Panel
              header={(
                <span>
                  Period {index + 1}:&nbsp;
                  <Field
                    name={`${name}.periodStart`}
                    render={({input}) => input.value}
                  />
                  &nbsp;-&nbsp;
                  <Field
                    name={`${name}.periodEnd`}
                    render={({input}) => input.value}
                  />
                </span>
              )}
              key={index}
              extra={(
                /* eslint-disable-next-line */
                <div onClick={(e) => { e.stopPropagation() }} style={{ display: 'flex' }}>
                <div className="delete-btn-holder">
                <Popconfirm
                  title="Are you sure to delete this period?"
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
              <AutoSave sectionIndex={5} setName={`${fieldName}.periods`} itemIndex={index} />
              <Row gutter={16}>
                <Col span={12}>
                  <Item label="Start">
                    <FinalField
                      name={`${name}.periodStart`}
                      control="datepicker"
                      disabled={primaryOrganisation === 3394}
                    />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item label="End">
                    <FinalField
                      name={`${name}.periodEnd`}
                      control="datepicker"
                      disabled={primaryOrganisation === 3394}
                    />
                  </Item>
                </Col>
              </Row>
              <Item label={<InputLabel optional>Target value</InputLabel>}>
                <FinalField name={`${name}.targetValue`} />
              </Item>
              <Item label={<InputLabel optional>Comment</InputLabel>}>
                <FinalField name={`${name}.targetComment`} render={({input}) => <RTE {...input} />} />
              </Item>
            </Panel>
          )}
        />
        }
        <Button icon="plus" block type="dashed" onClick={add}>Add period</Button>
        </Aux>
      )}
    </FieldArray>
    </Aux>
  )
})

export default Periods
