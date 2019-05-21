import React from 'react'
import { Form, Button, Radio, Col, Row } from 'antd'

import FinalField from '../../../../utils/final-field'
import ItemArray from '../../../../utils/item-array'
import InputLabel from '../../../../utils/input-label'

const { Item } = Form

class HumanitarianScopes extends React.Component{
  render(){
    return (
      <div>
        <h3>Humanitarian Scopes</h3>
        <ItemArray
          setName="humanitarianScopes"
          sectionIndex={8}
          header="Humanitarian scope $index"
          formPush={this.props.formPush}
          panel={name => (
            <div>
              <Row gutter={16}>
                <Col span={12}>
                  <Item label={<InputLabel optional tooltip="...">Type</InputLabel>}>
                    <FinalField
                      name={`${name}.type`}
                      render={({ input }) => (
                        <Radio.Group {...input}>
                          <Radio.Button value="1">Emergency</Radio.Button>
                          <Radio.Button value="2">Appeal</Radio.Button>
                        </Radio.Group>
                      )}
                    />
                  </Item>
                </Col>
                <Col span={12}>
                  <FinalField name={`${name}.type`} subscription={{ value: true }}>
                  {({ input: { value } }) => (
                    <Item label={<InputLabel optional={value === '' || value === undefined}>Code</InputLabel>}>
                      <FinalField
                        name={`${name}.code`}
                        control="input"
                      />
                    </Item>
                  )}
                  </FinalField>
                </Col>
              </Row>
              <Item label={<InputLabel optional>Description</InputLabel>}>
                <FinalField
                  control="input"
                  name={`${name}.description`}
                />
              </Item>
              <FinalField name={`${name}.type`} subscription={{ value: true }}>
                {({ input: { value } }) => (
                  <Item label={<InputLabel optional={value === '' || value === undefined}>Vocabulary</InputLabel>}>
                    <FinalField
                      control="select"
                      options={[{value: '1-2', label: '1-2 Glide'}, {value: '2-1', label: '2-1 Humanitarian plan'}, {value: '99', label: '99 Reporting organisation'}]}
                      name={`${name}.vocabulary`}
                    />
                  </Item>
                )}
              </FinalField>
              <Item label={<InputLabel optional>Vocabulary URI</InputLabel>}>
                <FinalField
                  control="input"
                  name={`${name}.vocabularyUri`}
                />
              </Item>
            </div>
          )}
          addButton={({ onClick }) => (
            <Button className="bottom-btn" icon="plus" type="dashed" block onClick={onClick}>Add Humanitarian Scope</Button>
          )}
        />
      </div>
    )
  }
}

export default HumanitarianScopes
