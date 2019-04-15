import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Modal, Icon } from 'antd'

import * as actions from './actions'
import RTE from '../../../utils/rte'
import './styles.scss'

const { Item } = Form

const dict = {
  summary: 'Project summary',
  goals: 'Goals overview',
  background: 'Background',
  baseline: 'Baseline situation',
  'target-group': 'Target group',
  'project-plan': 'Project plan',
  sustainability: 'Sustainability'
}
const infoDict = {
  summary: 'Enter a brief summary, try to restrict the number of characters to 400 in order to display the summary nicely on the project page.',
  goals: 'Provide a brief description of the overall project goals.',
  background: 'This should describe the geographical, political, environmental, social and/or cultural context of the project, and any related activities that have already taken place or are underway.',
  baseline: 'Describe the situation at the start of the project.',
  'target-group': 'This should include information about the people, organisations or resources that are being impacted by this project.',
  'project-plan': 'Detailed information about the implementation of the project: the what, how, who and when.',
  sustainability: 'Describe how you aim to guarantee sustainability of the project until 10 years after project implementation. Think about the institutional setting, capacity-building, a cost recovery plan, products used, feasible arrangements for operation and maintenance, anticipation of environmental impact and social integration.'
}

class Descriptions extends React.Component {
  constructor(props){
    super(props)
    const added = props.rdr.filter(it => it.value !== '' || it.required).map(it => it.key)
    this.state = {
      added,
      modalVisible: false
    }
  }
  addDesc = (key) => {
    const updatedState = {}
    if(this.state.added.indexOf(key) === -1){
      updatedState.added = [...this.state.added, key]
    }
    updatedState.modalVisible = false
    this.setState(updatedState)
  }
  removeDesc = (key) => {
    this.setState({
      added: this.state.added.filter(it => it !== key)
    })
  }
  filterDesc = it => (it.required || it.value !== '' || this.state.added.indexOf(it.key) !== -1)
  render(){
    return (
      <div className="descriptions view">
        <Form layout="vertical">
          {this.state.added.map((descKey) => {
            const desc = this.props.rdr.find(it => it.key === descKey)
            return (
              <Item key={descKey} label={<div className="desc-label"><span>{dict[descKey]}</span>{!desc.required && <Icon type="delete" onClick={() => this.removeDesc(desc.key)} />}</div>}>
                <RTE value={desc.value} onChange={value => this.props.editDescription(desc.key, value)} />
              </Item>
            )
          })}
          {this.props.rdr.filter((...args) => !this.filterDesc(...args)).length > 0 &&
            <Button onClick={() => this.setState({ modalVisible: true })} className="bottom-btn" icon="plus" type="dashed" block>Add description</Button>
          }
        </Form>
        <Modal
          title="Add Description"
          visible={this.state.modalVisible}
          footer={null}
          onCancel={() => this.setState({ modalVisible: false })}
          className="add-description-modal"
        >
          {this.props.rdr.filter((...args) => !this.filterDesc(...args)).map(desc => (
            <div className="desc-block">
              <Button block icon="plus" onClick={() => this.addDesc(desc.key)}>{dict[desc.key]}</Button>
              <p>{infoDict[desc.key]}</p>
            </div>
          ))}
        </Modal>
      </div>
    )
  }
}

export default connect(
  ({ descsRdr }) => ({ rdr: descsRdr }),
  actions
)(Descriptions)
