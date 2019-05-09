import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input, Collapse, Icon } from 'antd'

import InputLabel from '../../../../utils/input-label'
// import _Field from '../../../../utils/field'
import { Aux } from '../../../../utils/misc'
import SearchItem from './search-item'
import * as actions from './actions'
import '../styles.scss'

const { Item } = Form
const { Panel } = Collapse
// const Field = connect(
//   ({ locationItemsRdr }) => ({ rdr: locationItemsRdr }),
//   actions
// )(_Field)
// const Locations = ({ rdr, ...props }) =>

class Locations extends React.Component{
  state = {
    activeKey: ''
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
  render(){
    return (
      <Aux>
        <h3>Locations</h3>
        <Collapse accordion activeKey={this.state.activeKey} onChange={(key) => { this.setState({ activeKey: key }) }}>
        {this.props.rdr.map((item, index) =>
          <Panel
            header={`Location ${index + 1}`}
            extra={<Icon type="delete" onClick={event => this.remove(event, index)} />}
            key={`${index}`}
          >
            <SearchItem
              location={item}
              onChange={(result) => {
                this.props.editField(index, 'coordinates', result.coordinates)
                this.props.editField(index, 'city', result.text)
              }}
              onRemove={() => this.props.remove(index)}
            />
            <Item label={<InputLabel optional>Address 1</InputLabel>}>
              <Input value={item.address1} onChange={ev => this.props.editField(index, 'address1', ev.target.value)} />
            </Item>
            <Item label={<InputLabel optional>Address 2</InputLabel>}>
            <Input value={item.address2} onChange={ev => this.props.editField(index, 'address2', ev.target.value)} />
            </Item>
            <Item label={<InputLabel optional>Postal code</InputLabel>}>
              <Input value={item.postalCode} onChange={ev => this.props.editField(index, 'postalCode', ev.target.value)} style={{ width: 150 }} />
            </Item>
          </Panel>
        )}
        </Collapse>
        <Button onClick={this.add} icon="plus" type="dashed" block>
          Add location
        </Button>
      </Aux>
    )
  }
}

export default connect(
  ({ locationItemsRdr }) => ({ rdr: locationItemsRdr }),
  actions
)(Locations)
