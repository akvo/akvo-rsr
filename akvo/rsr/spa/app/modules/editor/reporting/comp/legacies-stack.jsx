import React from 'react'
import { connect } from 'react-redux'
import { Button, Collapse, Icon, Form, Input } from 'antd'

import InputLabel from '../../../../utils/input-label'
import * as actions from '../actions'

const { Item } = Form
const { Panel } = Collapse

class LegaciesStack extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      activeKey: props.rdr.length > 0 ? `legacy${props.rdr.length - 1}` : 0
    }
  }
  remove = (event, index) => {
    event.stopPropagation()
    this.props.removeLegacy(index)
  }
  add = () => {
    this.setState({
      activeKey: `legacy${this.props.rdr.length}`
    })
    this.props.addLegacy()
  }
  render(){
    return (
      <div>
        <Collapse
          accordion
          activeKey={this.state.activeKey}
          onChange={(key) => { this.setState({ activeKey: key }) }}
        >
        {this.props.rdr.map((legacy, index) =>
          <Panel key={`legacy${index}`} header={`Legacy data: ${legacy.name ? legacy.name : 'New'}`} extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}>
            <Item label={<InputLabel optional tooltip="...">Name</InputLabel>}>
              <Input value={legacy.name} onChange={ev => this.props.editLegacyField(index, 'name', ev.target.value)} />
            </Item>
            <Item label={<InputLabel optional tooltip="...">Value</InputLabel>}>
              <Input value={legacy.value} onChange={ev => this.props.editLegacyField(index, 'value', ev.target.value)} />
            </Item>
            <Item label={<InputLabel optional tooltip="...">IATI equivalent</InputLabel>}>
              <Input value={legacy.iatiEquivalent} onChange={ev => this.props.editLegacyField(index, 'iatiEquivalent', ev.target.value)} />
            </Item>
          </Panel>
        )}
        </Collapse>
        <Button onClick={this.add} className="bottom-btn" block icon="plus" type="dashed">Add another legacy data</Button>
      </div>
    )
  }
}

export default connect(({ legaciesRdr }) => ({ rdr: legaciesRdr }), actions)(LegaciesStack)
