import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Form, Input, Select } from 'antd'

import InputLabel from '../../../../utils/input-label'
import UpdateHalter from '../../../../utils/update-halter'
import _Field from '../../../../utils/field'
import vocabularyOptions from './options/vocabulary.json'
import * as actions from './actions'

const { Item } = Form
const { Option } = Select
const TabPane = Tabs.TabPane


const SectorPane = ({transactionIndex, index}) => {
  const Field = connect(
    ({ transactionsRdr }) => ({ rdr: transactionsRdr[transactionIndex].sectors }),
    { editField: (pindex, key, value) => actions.editFieldSector(transactionIndex, pindex, key, value)}
  )(_Field)
  return (
    <div>
      <UpdateHalter>
      <Field
        name="name"
        index={index}
        render={props => (
          <Item label={<InputLabel optional>Name</InputLabel>}>
            <Input {...props} />
          </Item>
        )}
      />
      <Field
        name="vocabulary"
        index={index}
        render={props => (
          <Item label={<InputLabel optional>Vocabulary</InputLabel>}>
            <Select {...props}>
              <Option value="">&nbsp;</Option>
              {vocabularyOptions.map(option => <Option value={option.value}>{option.label}</Option>)}
            </Select>
          </Item>
        )}
      />
      <Field
        name="uri"
        index={index}
        render={props => (
          <Item label={<InputLabel optional>URI</InputLabel>}>
            <Input {...props} />
          </Item>
        )}
      />
      <Field
        name="description"
        index={index}
        render={props => (
          <Item label={<InputLabel optional>Description</InputLabel>}>
            <Input {...props} />
          </Item>
        )}
      />
      </UpdateHalter>
    </div>
  )
}

class Sectors extends React.Component{
  state = {
    activeKey: '0'
  }
  shouldComponentUpdate(nextProps, nextState){
    if(this.props.rdr[this.props.transactionIndex].sectors.length !== nextProps.rdr[this.props.transactionIndex].sectors.length){
      return true
    }
    return nextState !== this.state
  }
  add = () => {
    const activeKey = `${this.props.rdr[this.props.transactionIndex].sectors.length}`
    this.props.addSector(this.props.transactionIndex)
    this.setState({ activeKey })
  }
  remove = (targetKey) => {
    this.props.removeSector(this.props.transactionIndex, Number(targetKey))
  }
  onChange = (activeKey) => {
    this.setState({ activeKey })
  }
  onEdit = (targetKey, action) => {
    this[action](targetKey)
  }
  render(){
    return (
      <div>
        <Tabs
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {this.props.rdr[this.props.transactionIndex].sectors.map((sector, index) =>
            <TabPane tab={`Sector ${index + 1}`} key={`${index}`} closable>
              <SectorPane index={index} transactionIndex={this.props.transactionIndex} editField={(field, value) => this.props.editFieldSector(this.props.transactionIndex, index, field, value)} />
            </TabPane>)
          }
        </Tabs>
      </div>
    )
  }
}

export default connect(
  ({ transactionsRdr }) => ({ rdr: transactionsRdr }),
  actions
)(Sectors)
