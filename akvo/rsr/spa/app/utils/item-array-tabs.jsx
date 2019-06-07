import React from 'react'
import { Tabs } from 'antd'
import { FormSpy } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { get } from 'lodash'

const { TabPane } = Tabs

class ActiveKeyUpdater extends React.Component{
  componentDidUpdate(prevProps){ // eslint-disable-line
    const thisValues = get(this.props.values, this.props.name)
    if(thisValues !== undefined){
      const prevValues = get(prevProps.values, this.props.name)
      if(thisValues.length > prevValues.length || thisValues.length <= this.props.activeKey){
        const activeKey = thisValues.length - 1
        setTimeout(() => {
          this.props.setActiveKey(activeKey)
        }, 200)
      }
    }
  }
  render(){
    return null
  }
}

class ItemArrayTabs extends React.Component{
  state = {
    activeKey: '0'
  }
  removeItem = (event, index, fields) => {
    event.stopPropagation()
    fields.remove(index)
  }
  handleChange = (activeKey) => {
    this.setState({
      activeKey
    })
  }
  add = () => {
    this.props.push(this.props.name, {})
  }
  remove = (fields, targetKey) => {
    fields.remove(targetKey)
  }
  onEdit = fields => (targetKey, action) => {
    this[action](fields, targetKey)
  }
  render(){
    return (
      <FieldArray name={this.props.name} subscription={{ pristine: true }}>
        {({ fields }) => (
          <div>
            <Tabs
              onChange={this.handleChange}
              activeKey={this.state.activeKey}
              type="editable-card"
              onEdit={this.onEdit(fields)}
            >
              {fields.map((name, index) => (
                <TabPane tab={`${this.props.tabName} ${index + 1}`} key={`${index}`} closable>
                {this.props.pane(name, index)}
                </TabPane>
              ))}
            </Tabs>
            <FormSpy subscription={{ values: true }}>
              {({ values }) => <ActiveKeyUpdater values={values} name={this.props.name} activeKey={this.state.activeKey} setActiveKey={this.handleChange} />}
            </FormSpy>
          </div>
        )}
      </FieldArray>
    )
  }
}

export default ItemArrayTabs
