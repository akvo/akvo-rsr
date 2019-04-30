/* global fetch */
import React from 'react'
import querystring from 'querystring'
import { Form, Select, Spin, Icon } from 'antd'

import InputLabel from '../../../../utils/input-label'
import { googleGeocodeApiKey } from '../../../../utils/constants'

const { Item } = Form
const { Option } = Select

let timeout
let currentValue

function $fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value

  function req() {
    const str = querystring.encode({
      key: googleGeocodeApiKey,
      address: value,
    })
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?${str}`)
      .then(response => response.json())
      .then((d) => {
        if (currentValue === value) {
          const data = d.results.map(r => ({
            value: { address: r.formatted_address, coordinates: r.geometry.location },
            text: r.formatted_address,
          }))
          callback(data)
        }
      })
  }

  timeout = setTimeout(req, 300)
}

class SearchItem extends React.Component{
  state = {
    data: [],
    fetching: false
  }
  handleSearch = (value) => {
    this.setState({
      fetching: true
    })
    $fetch(value, data => this.setState({ data, fetching: false }))
  }
  handleChange = (value) => {
    this.props.onChange(value)
  }
  render(){
    const options = this.state.data.map((d, index) => <Option key={index} value={d.value}>{d.text}</Option>)
    return (
      <Item label={<InputLabel tooltip="..." more={<Icon type="delete" onClick={this.props.onRemove} />}>City</InputLabel>}>
        <Select
          value={this.props.location.address}
          showSearch
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={this.handleSearch}
          onChange={this.handleChange}
          notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
          placeholder="Type to search..."
        >
          {options}
        </Select>
      </Item>
    )
  }
}

export default SearchItem
