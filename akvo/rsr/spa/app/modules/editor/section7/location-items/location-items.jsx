import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input, Collapse, Icon, Row, Col, Select } from 'antd'

import InputLabel from '../../../../utils/input-label'
import _Field from '../../../../utils/field'
import { Aux } from '../../../../utils/misc'
import { validationType } from '../../../../utils/validation-utils'
import UpdateHalter from '../../../../utils/update-halter'
import SearchItem from './search-item'
import Administratives from './administratives'
import featureOptions from './feature-options.json'
import * as actions from './actions'
import '../styles.scss'

const { Item } = Form
const { Panel } = Collapse
const { TextArea } = Input
const { Option } = Select
const Field = connect(
  ({ locationItemsRdr }) => ({ rdr: locationItemsRdr }),
  actions
)(_Field)

class Locations extends React.Component{
  state = {
    activeKey: ''
  }
  constructor(props){
    super(props)
    if(props.rdr.length > 0){
      this.state = {
        activeKey: `${props.rdr.length - 1}`
      }
    }
  }
  add = () => {
    this.setState({
      activeKey: `${this.props.rdr.length}`
    })
    this.props.add()
  }
  remove = (event, index) => {
    event.stopPropagation()
    this.props.remove(index)
  }
  render(){
    const isIATI = this.props.validations.indexOf(validationType.IATI) !== -1
    return (
      <Aux>
        <h3>Locations</h3>
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((item, index) =>
          <Panel
            header={`Location ${index + 1}`}
            extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}
            key={`${index}`}
          >
            <UpdateHalter except={['city']} item={item}>
            <SearchItem
              location={item}
              onChange={(result) => {
                this.props.editField(index, 'coordinates', result.coordinates)
                this.props.editField(index, 'city', result.text)
              }}
              onRemove={() => this.props.remove(index)}
            />
            <Field
              name="address1"
              index={index}
              render={props => (
                <Item label={<InputLabel optional>Address 1</InputLabel>}>
                  <Input {...props} />
                </Item>
              )}
            />
            <Field
              name="address2"
              index={index}
              render={props => (
                <Item label={<InputLabel optional>Address 2</InputLabel>}>
                  <Input {...props} />
                </Item>
              )}
            />
            <Field
              name="postalCode"
              index={index}
              render={props => (
                <Item label={<InputLabel optional>Postal code</InputLabel>}>
                  <Input {...props} />
                </Item>
              )}
            />
            {isIATI && (
              <Aux>
                <Row gutter={16}>
                  <Col span={8}>
                    <Field
                      name="name"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Name</InputLabel>}>
                          <Input {...props} />
                        </Item>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Field
                      name="reference"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Reference</InputLabel>}>
                          <Input {...props} />
                        </Item>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Field
                      name="code"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Code</InputLabel>}>
                          <Input {...props} />
                        </Item>
                      )}
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Field
                      name="locationDescription"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Location description</InputLabel>}>
                          <TextArea rows={3} {...props} />
                        </Item>
                      )}
                    />
                  </Col>
                  <Col span={12}>
                    <Field
                      name="activityDescription"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Activity description</InputLabel>}>
                          <TextArea rows={3} {...props} />
                        </Item>
                      )}
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Field
                      name="locationPrecision"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Location precision</InputLabel>}>
                          <Select {...props}>
                            <Option value="">&nbsp;</Option>
                            <Option value={1}>Exact</Option>
                            <Option value={2}>Approximate</Option>
                          </Select>
                        </Item>
                      )}
                    />
                  </Col>
                  <Col span={12}>
                    <Field
                      name="reach"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Reach</InputLabel>}>
                          <Select {...props}>
                            <Option value="">&nbsp;</Option>
                            <Option value={1}>Activity</Option>
                            <Option value={2}>Indended beneficiaries</Option>
                          </Select>
                        </Item>
                      )}
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Field
                      name="class"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Class</InputLabel>}>
                          <Select {...props}>
                            <Option value="">&nbsp;</Option>
                            <Option value="1">Administrative Region</Option>
                            <Option value="2">Populated Place</Option>
                            <Option value="3">Structure</Option>
                            <Option value="4">Other Topographical Feature</Option>
                          </Select>
                        </Item>
                      )}
                    />
                  </Col>
                  <Col span={12}>
                    <Field
                      name="featureDesignation"
                      index={index}
                      render={props => (
                        <Item label={<InputLabel optional>Feature designation</InputLabel>}>
                          <Select {...props} showSearch optionFilterProp="children">
                            <Option value="">&nbsp;</Option>
                            {featureOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
                          </Select>
                        </Item>
                      )}
                    />
                  </Col>
                </Row>
                <Administratives locationItemIndex={index} />
              </Aux>
            )}
            </UpdateHalter>
          </Panel>
        )}
        </Collapse>
        <Button onClick={this.add} icon="plus" type="dashed" block>
          Add location
        </Button>
      </Aux>
    )
  }
}

export default connect(
  ({ locationItemsRdr, infoRdr }) => ({ rdr: locationItemsRdr, validations: infoRdr.validations }),
  actions
)(Locations)
