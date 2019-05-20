import React from 'react'
import { connect } from 'react-redux'
import { Collapse, Icon, Form, Button, Radio, Select, Col, Row } from 'antd'

import InputLabel from '../../../../utils/input-label'
import _Field from '../../../../utils/field'
import UpdateHalter from '../../../../utils/update-halter'

import * as actions from './actions'

const { Panel } = Collapse
const { Item } = Form
const Field = connect(
  ({ humanitarianScopesRdr }) => ({ rdr: humanitarianScopesRdr }),
  actions
)(_Field)

class HumanitarianScopes extends React.Component{
  state = {
    activeKey: '',
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
  addItem = () => {
    this.setState({
      activeKey: `${this.props.rdr.length}`
    })
    this.props.add()
  }
  render(){
    return (
      <div>
        <h3>Humanitarian Scopes</h3>
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((item, index) =>
          <Panel
            header={`Humanitarian scope ${index + 1}`}
            extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}
            key={`${index}`}
          >
            <UpdateHalter except={['type']} item={item}>
              <Row gutter={16}>
                <Col span={12}>
                  <Item label={<InputLabel optional tooltip="...">Type</InputLabel>}>
                    <Field
                      name="type"
                      index={index}
                      render={input => (
                        <Radio.Group {...input}>
                          <Radio.Button value="1">Emergency</Radio.Button>
                          <Radio.Button value="2">Appeal</Radio.Button>
                        </Radio.Group>
                      )}
                    />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item label={<InputLabel optional={item.type === '' || item.type === undefined}>Code</InputLabel>}>
                    <Field name="code" index={index} control="input" />
                  </Item>
                </Col>
              </Row>
              <Item label={<InputLabel optional>Description</InputLabel>}>
                <Field
                  control="input"
                  name="description"
                  index={index}
                />
              </Item>
              <Item label={<InputLabel optional={item.type === '' || item.type === undefined}>Vocabulary</InputLabel>}>
                <Field
                  control="select"
                  options={[{value: '1-2', label: '1-2 Glide'}, {value: '2-1', label: '2-1 Humanitarian plan'}, {value: '99', label: '99 Reporting organisation'}]}
                  name="vocabulary"
                  index={index}
                />
              </Item>
              <Item label={<InputLabel optional>Vocabulary URI</InputLabel>}>
                <Field
                  control="input"
                  name="vocabularyUri"
                  index={index}
                />
              </Item>
            </UpdateHalter>
          </Panel>
        )}
        </Collapse>
        <Button className="bottom-btn" icon="plus" type="dashed" block onClick={this.addItem}>Add Humanitarian Scope</Button>
      </div>
    )
  }
}

export default connect(
  ({ humanitarianScopesRdr }) => ({ rdr: humanitarianScopesRdr }),
  actions
)(HumanitarianScopes)
