import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Button, Modal, Select } from 'antd'

import InputLabel from '../../../../utils/input-label'
import _Field from '../../../../utils/field'
import UpdateHalter from '../../../../utils/update-halter'
import { doesFieldExist, isFieldOptional } from '../../../../utils/validation-utils'
import { getValidationSets } from './validations'
import codes from '../codes.json'
import vocab from '../vocab.json'

import * as actions from './actions'
// import './styles.scss'

const { Panel } = Collapse
const { Item } = Form
const Field = connect(
  ({ sectorsRdr }) => ({ rdr: sectorsRdr }),
  actions
)(_Field)

class Sectors extends React.Component{
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
  addSector = (vocabulary) => {
    this.setState({
      modalVisible: false,
      activeKey: `${this.props.rdr.length}`
    })
    this.props.add(vocabulary)
  }
  vocabAdded = (vocabulary) => {
    let ret = false
    for(let i = 0; i < this.props.rdr.length; i += 1){
      if(this.props.rdr[i].vocabulary === vocabulary){
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
        {this.props.rdr.map((sectorItem, index) =>
          <Panel
            header={`${vocab.find(it => it.value === sectorItem.vocabulary).label}`}
            extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}
            key={`${index}`}
          >
            <UpdateHalter>
              <Item label={<InputLabel tooltip="...">Vocabulary</InputLabel>}>
                <Field
                  control="select"
                  options={vocab}
                  name="vocabulary"
                  index={index}
                />
              </Item>
              {fieldExists('vocabularyUri') && (
                <Item label={<InputLabel optional>Vocabulary URI</InputLabel>}>
                  <Field
                    control="input"
                    name="vocabularyUri"
                    index={index}
                  />
                </Item>
              )}
              <Item label={<InputLabel optional={isOptional('code')} tooltip="...">Additional info</InputLabel>}>
                <Field
                  control="select"
                  options={codes}
                  name="code"
                  index={index}
                  showSearch
                  optionFilterProp="children"
                />
              </Item>
              {fieldExists('percentage') && (
                <div>
                  <div className="percentage-row">
                    <Item label={<InputLabel>Percentage</InputLabel>}>
                      <Field
                        control="input"
                        name="percentage"
                        index={index}
                        suffix={<span>%</span>}
                        className="percentage-input"
                      />
                    </Item>
                    {fieldExists('description') && (
                      <Item label={<InputLabel optional>Description</InputLabel>}>
                        <Field
                          control="textarea"
                          rows={2}
                          index={index}
                          name="description"
                        />
                      </Item>
                    )}
                  </div>
                </div>
              )}
            </UpdateHalter>
          </Panel>
        )}
        </Collapse>
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={() => this.setState({ modalVisible: true })}>Add sector</Button>

        <Modal
          title="Add Sector"
          visible={this.state.modalVisible}
          footer={null}
          onCancel={() => this.setState({ modalVisible: false })}
          className="add-sector-modal"
        >
          {vocab.filter(it => !this.vocabAdded(it.value)).map(item => (
            <div className="desc-block">
              <Button block icon="plus" onClick={() => this.addSector(item.value)}>{item.label}</Button>
            </div>
          ))}
        </Modal>
      </div>
    )
  }
}

export default connect(
  ({ sectorsRdr }) => ({ rdr: sectorsRdr }),
  actions
)(Sectors)
