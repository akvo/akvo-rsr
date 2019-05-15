import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Form } from 'antd'

import InputLabel from '../../../../utils/input-label'
import UpdateHalter from '../../../../utils/update-halter'
import _Field from '../../../../utils/field'
import * as actions from './actions'
import CATEGORY_OPTIONS from './categories.json'

const { Item } = Form
const TabPane = Tabs.TabPane

const CategoryPane = ({docIndex, index}) => {
  const Field = connect(
    ({ docsRdr }) => ({ rdr: docsRdr[docIndex].categories }),
    { editField: (pindex, key, value) => actions.editFieldCategory(docIndex, pindex, key, value)}
  )(_Field)
  return (
    <div>
      <UpdateHalter>
        <Item label={<InputLabel optional>Category</InputLabel>}>
          <Field
            name="category"
            index={index}
            control="select"
            options={CATEGORY_OPTIONS}
          />
        </Item>
      </UpdateHalter>
    </div>
  )
}

class Categories extends React.Component{
  state = {
    activeKey: '0'
  }
  shouldComponentUpdate(nextProps, nextState){
    if(this.props.rdr[this.props.docIndex].categories.length !== nextProps.rdr[this.props.docIndex].categories.length){
      return true
    }
    return nextState !== this.state
  }
  add = () => {
    const activeKey = `${this.props.rdr[this.props.docIndex].categories.length}`
    this.props.addCategory(this.props.docIndex)
    this.setState({ activeKey })
  }
  remove = (targetKey) => {
    this.props.removeCategory(this.props.docIndex, Number(targetKey))
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
          {this.props.rdr[this.props.docIndex].categories.map((item, index) =>
            <TabPane tab={`Category ${index + 1}`} key={`${index}`} closable>
              <CategoryPane index={index} docIndex={this.props.docIndex} />
            </TabPane>)
          }
        </Tabs>
      </div>
    )
  }
}

export default connect(
  ({ docsRdr }) => ({ rdr: docsRdr }),
  actions
)(Categories)
