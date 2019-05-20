import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Form, Input, Select, Row, Col } from 'antd'

import InputLabel from '../../../../utils/input-label'
import UpdateHalter from '../../../../utils/update-halter'
import _Field from '../../../../utils/field'
import vocabularyOptions from './admin-vocab-options.json'
import * as actions from './actions'

const { Item } = Form
const { Option } = Select
const TabPane = Tabs.TabPane


const AdministrativePane = ({locationItemIndex, index}) => {
  const Field = connect(
    ({ locationItemsRdr }) => ({ rdr: locationItemsRdr[locationItemIndex].administratives }),
    { editField: (pindex, key, value) => actions.editFieldAdministrative(locationItemIndex, pindex, key, value)}
  )(_Field)
  return (
    <div>
      <UpdateHalter>
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
      <Row gutter={16}>
        <Col span={12}>
          <Field
            name="code"
            index={index}
            render={props => (
              <Item label={<InputLabel optional>Administrative code</InputLabel>}>
                <Input {...props} />
              </Item>
            )}
          />
        </Col>
        <Col span={12}>
          <Field
            name="level"
            index={index}
            render={props => (
              <Item label={<InputLabel optional>Level</InputLabel>}>
                <Input {...props} />
              </Item>
            )}
          />
        </Col>
      </Row>
      </UpdateHalter>
    </div>
  )
}

class Administratives extends React.Component{
  state = {
    activeKey: '0'
  }
  shouldComponentUpdate(nextProps, nextState){
    if(this.props.rdr[this.props.locationItemIndex].administratives.length !== nextProps.rdr[this.props.locationItemIndex].administratives.length){
      return true
    }
    return nextState !== this.state
  }
  add = () => {
    const activeKey = `${this.props.rdr[this.props.locationItemIndex].administratives.length}`
    this.props.addAdministrative(this.props.locationItemIndex)
    this.setState({ activeKey })
  }
  remove = (targetKey) => {
    this.props.removeAdministrative(this.props.locationItemIndex, Number(targetKey))
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
          {this.props.rdr[this.props.locationItemIndex].administratives.map((item, index) =>
            <TabPane tab={`Administrative ${index + 1}`} key={`${index}`} closable>
              <AdministrativePane index={index} locationItemIndex={this.props.locationItemIndex} editField={(field, value) => this.props.editFieldAdministrative(this.props.locationItemIndex, index, field, value)} />
            </TabPane>)
          }
        </Tabs>
      </div>
    )
  }
}

export default connect(
  ({ locationItemsRdr }) => ({ rdr: locationItemsRdr }),
  actions
)(Administratives)
