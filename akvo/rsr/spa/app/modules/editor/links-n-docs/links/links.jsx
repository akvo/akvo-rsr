import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Button, Radio, Upload, Row, Col, Input } from 'antd'

import _Field from '../../../../utils/field'
import UpdateHalter from '../../../../utils/update-halter'
import InputLabel from '../../../../utils/input-label'
import { getValidations } from '../../../../utils/validation-utils'

import * as actions from './actions'

const { Panel } = Collapse
const { Item } = Form
const Field = connect(
  ({ linksRdr }) => ({rdr: linksRdr}),
  { editField: actions.editField }
)(_Field)

class Links extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      activeKey: props.rdr.length > 0 ? `${props.rdr.length - 1}` : 0,
    }
  }
  addLink = () => {
    this.setState({
      activeKey: `${this.props.rdr.length}`
    })
    this.props.add()
  }
  removeLink = (event, index) => {
    event.stopPropagation()
    this.props.remove(index)
  }
  render(){
    return (
      <div className="links view">
        <Form layout="vertical">
        <h3>Links</h3>
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((link, index) =>
          <Panel
            header={`Link ${index + 1}: ${link.caption ? link.caption : 'Untitled'}`}
            extra={<Icon type="delete" onClick={event => this.removeLink(event, index)} />}
            key={`${index}`}
          >
            <UpdateHalter>
              <Item label={<InputLabel tooltip="...">URL</InputLabel>}>
                <Field index={index} name="url" control="input" placeholder="http://..." />
              </Item>
              <Item label={<InputLabel optional tooltip="...">Caption</InputLabel>}>
              <Field index={index} name="caption" control="input" />
              </Item>
            </UpdateHalter>
          </Panel>
        )}
        </Collapse>
        <Button
          className="bottom-btn"
          icon="plus"
          type="dashed"
          block
          onClick={this.addLink}
        >
          Add another link
        </Button>
        </Form>
      </div>
    )
  }
}

export default connect(
  ({ linksRdr }) => ({ rdr: linksRdr }),
  actions
)(Links)
