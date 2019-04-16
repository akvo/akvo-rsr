import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Button, Modal, Select } from 'antd'

import InputLabel from '../../../utils/input-label'
import codes from './codes.json'
import vocab from './vocab.json'

import * as actions from './actions'
import './styles.scss'

const { Panel } = Collapse
const { Item } = Form
const { Option } = Select

class Focus extends React.Component{
  state = {
    activeKey: '',
    modalVisible: false
  }
  constructor(props){
    super(props)
    if(props.rdr.length > 0){
      this.state = {
        activeKey: `p${props.rdr.length - 1}`
      }
    }
  }
  add = () => {
    this.setState({
      activeKey: `p${this.props.rdr.length}`
    })
    this.props.addSector()
  }
  remove = (event, index) => {
    event.stopPropagation()
    this.props.removeSector(index)
  }
  addSector = (vocabulary) => {
    this.setState({
      modalVisible: false,
      activeKey: `p${this.props.rdr.length}`
    })
    this.props.addSector(vocabulary)
  }
  render(){
    return (
      <div className="focus view">
        <h3>Sectors</h3>
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((sectorItem, index) =>
          <Panel
            header={`${vocab.find(it => it.value === sectorItem.vocabulary).label}`}
            extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}
            key={`p${index}`}
          >
            <Form layout="vertical">
              <Item label={<InputLabel tooltip="...">Vocabulary</InputLabel>}>
                <Select value={sectorItem.vocabulary} onChange={value => this.props.editSectorField(index, 'vocabulary', value)}>
                  {vocab.map(item =>
                  <Option value={item.value}>{item.label}</Option>
                  )}
                </Select>
              </Item>
              <Item label={<InputLabel optional tooltip="...">Additional info</InputLabel>}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  value={sectorItem.code}
                  onChange={value => this.props.editSectorField(index, 'code', value)}
                >
                  {codes.map(code => <Option value={code.value}>{code.label}</Option>)}
                </Select>
              </Item>
            </Form>
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
          {vocab.map(item => (
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
  ({ focusRdr }) => ({ rdr: focusRdr }),
  actions
)(Focus)
