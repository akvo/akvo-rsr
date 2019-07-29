/* global fetch */
import React from 'react'
import querystring from 'querystring'
import { Form, Select, Spin } from 'antd'
import { withTranslation } from 'react-i18next'

import InputLabel from '../../../../utils/input-label'
import { opencagedataKey } from '../../../../utils/constants'

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
      key: opencagedataKey,
      q: value,
      pretty: 1
    })
    fetch(`https://api.opencagedata.com/geocode/v1/json?${str}`)
      .then(response => response.json())
      .then((d) => {
        if (currentValue === value) {
          const data = d.results.filter(it => it.components._type === 'city').map(r => ({
            coordinates: r.geometry,
            text: `${r.components.city}, ${r.components.country}`,
            // name: r.components.city
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
  handleChange = (index) => {
    this.props.onChange(this.state.data[index])
  }
  render(){
    const { t } = this.props
    const options = this.state.data.map((d, index) => <Option value={index}>{d.text}</Option>)
    return (
      <Item label={<InputLabel>{t('city')}</InputLabel>}>
        <Select
          value={this.props.value.text}
          showSearch
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={this.handleSearch}
          onChange={this.handleChange}
          notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
          placeholder={t('Type to search...')}
        >
          {options}
        </Select>
      </Item>
    )
  }
}

export default withTranslation()(SearchItem)
