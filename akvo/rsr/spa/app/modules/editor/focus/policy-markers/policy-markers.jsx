import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Button, Modal, Select } from 'antd'

import InputLabel from '../../../../utils/input-label'
import _Field from '../../../../utils/field'
import UpdateHalter from '../../../../utils/update-halter'
import { doesFieldExist, isFieldOptional } from '../../../../utils/validation-utils'
import { getValidationSets } from './validations'
import MARKER_OPTIONS from './markers.json'
import SIGNIFICANCE_OPTIONS from './significances.json'

import * as actions from './actions'

const { Panel } = Collapse
const { Item } = Form
const Field = connect(
  ({ policyMarkersRdr }) => ({ rdr: policyMarkersRdr }),
  actions
)(_Field)

class PolicyMarker extends React.Component{
  state = {
    activeKey: '',
    modalVisible: false
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
  addItem = (vocabulary) => {
    this.setState({
      modalVisible: false,
      activeKey: `${this.props.rdr.length}`
    })
    this.props.add(vocabulary)
  }
  itemAdded = (policyMarker) => {
    let ret = false
    for(let i = 0; i < this.props.rdr.length; i += 1){
      if(this.props.rdr[i].policyMarker === policyMarker){
        ret = true
        break
      }
    }
    return ret
  }
  render(){
    const validationSets = getValidationSets(this.props.validations)
    const fieldExists = doesFieldExist(validationSets)
    const isOptional = isFieldOptional(validationSets)
    return (
      <div>
        <h3>Sectors</h3>
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((item, index) =>
          <Panel
            header={`${MARKER_OPTIONS.find(it => it.value === item.policyMarker).label}`}
            extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}
            key={`${index}`}
          >
            <UpdateHalter>
              <Item label={<InputLabel tooltip="...">Policy Marker</InputLabel>}>
                <Field
                  control="select"
                  options={MARKER_OPTIONS}
                  name="policyMarker"
                  index={index}
                />
              </Item>
              <Item label={<InputLabel tooltip="...">Significance</InputLabel>}>
                <Field
                  control="select"
                  options={SIGNIFICANCE_OPTIONS}
                  name="significance"
                  index={index}
                />
              </Item>
              {fieldExists('description') && (
                <Item label={<InputLabel optional>Description</InputLabel>}>
                  <Field
                    control="input"
                    name="description"
                    index={index}
                  />
                </Item>
              )}
              {fieldExists('vocabulary') && (
                <Item label={<InputLabel optional>Vocabulary</InputLabel>}>
                  <Field
                    control="select"
                    options={[{value: '1', label: '1 - OECD DAC CRS'}, {value: '99', label: '99 - Reporting Organisation'}]}
                    name="vocabulary"
                    index={index}
                  />
                </Item>
              )}
              {fieldExists('vocabularyUri') && (
                <Item label={<InputLabel optional>Vocabulary URI</InputLabel>}>
                  <Field
                    control="input"
                    name="vocabularyUri"
                    index={index}
                  />
                </Item>
              )}
            </UpdateHalter>
          </Panel>
        )}
        </Collapse>
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={() => this.setState({ modalVisible: true })}>Add policy marker</Button>

        <Modal
          title="Add Policy Marker"
          visible={this.state.modalVisible}
          footer={null}
          onCancel={() => this.setState({ modalVisible: false })}
          className="add-sector-modal"
        >
          {MARKER_OPTIONS.filter(it => !this.itemAdded(it.value)).map(item => (
            <div className="desc-block">
              <Button block icon="plus" onClick={() => this.addItem(item.value)}>{item.label}</Button>
            </div>
          ))}
        </Modal>
      </div>
    )
  }
}

export default connect(
  ({ policyMarkersRdr }) => ({ rdr: policyMarkersRdr }),
  actions
)(PolicyMarker)
