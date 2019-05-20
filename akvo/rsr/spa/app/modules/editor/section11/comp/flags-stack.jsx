import React from 'react'
import { connect } from 'react-redux'
import { Select, Button, Collapse, Radio, Icon, Form } from 'antd'

import InputLabel from '../../../../utils/input-label'
import * as actions from '../actions'

const { Item } = Form
const { Option } = Select
const { Panel } = Collapse

const flagCodeOptions = [
  { value: 1, label: 'Free standing technical cooperation'},
  { value: 2, label: 'Programme-based approach'},
  { value: 3, label: 'Investment project'},
  { value: 4, label: 'Associated financing'}
]


class FlagsStack extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      activeKey: props.rdr.length > 0 ? `flag${props.rdr.length - 1}` : 0
    }
  }
  remove = (event, index) => {
    event.stopPropagation()
    this.props.removeFlag(index)
  }
  add = () => {
    this.setState({
      activeKey: `flag${this.props.rdr.length}`
    })
    this.props.addFlag()
  }
  render(){
    return (
      <div>
        <Collapse
          accordion
          activeKey={this.state.activeKey}
          onChange={(key) => { this.setState({ activeKey: key }) }}
        >
          {this.props.rdr.map((flag, index) =>
          <Panel key={`flag${index}`} header={`CRS++ other flag: ${flag.code && `${flag.code} - ${flagCodeOptions.find(it => it.value === flag.code).label}`}`} extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}>
            <div className="channel-code-inputs">
            <Item label={<InputLabel tooltip="...">Code</InputLabel>}>
              <Select value={flag.code} onChange={value => this.props.editFlagField(index, 'code', value)}>
                {flagCodeOptions.map(option =>
                  <Option value={option.value}>{option.value} - {option.label}</Option>
                )}
              </Select>
            </Item>
            <Item label={<InputLabel tooltip="...">Significance</InputLabel>}>
              <Radio.Group value={flag.significance} onChange={ev => this.props.editFlagField(index, 'significance', ev.target.value)}>
                <Radio.Button value={1}>Yes</Radio.Button>
                <Radio.Button value={0}>No</Radio.Button>
              </Radio.Group>
            </Item>
            </div>
          </Panel>
          )}
        </Collapse>
        <Button onClick={this.add} className="bottom-btn" block icon="plus" type="dashed">Add CRS++ other flag</Button>
      </div>
    )
  }
}

export default connect(
  ({ crsAddOtherFlagRdr }) => ({ rdr: crsAddOtherFlagRdr }),
  actions
)(FlagsStack)
