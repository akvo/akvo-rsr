import React from 'react'
import { Form, Select, Spin } from 'antd'
import { withTranslation } from 'react-i18next'

import InputLabel from '../../../../utils/input-label'
import api from '../../../../utils/api'

const { Item } = Form
const { Option } = Select

let timeout

function $fetch(input, callback) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }

  function req() {
    api.get('/places/search', { input })
      .then((response) => {
        if (response.data.status !== 'OK') {
          console.log('error', response.data.status) // eslint-disable-line no-console
          return
        }
        callback(response.data.predictions)
      })
      .catch((error) => {
        console.error('Places search failed:', error) // eslint-disable-line no-console
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
    if (this.props.setProcessing) {
      this.props.setProcessing(true)
    }
    const placeId = this.state.data[index].placeId
    api.get('/places/geocode', { place_id: placeId })
      .then((response) => {
        if (response.data.results && response.data.results.length > 0) {
          const result = response.data.results[0]
          const coordinates = {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng
          }
          const countryComp = result.addressComponents.find(comp =>
            comp.types.indexOf('country') !== -1
          )
          this.props.onChange({ ...this.state.data[index], coordinates, countryComp })
        }
        if (this.props.setProcessing) {
          this.props.setProcessing(false)
        }
      })
      .catch((error) => {
        console.error('Geocoding failed:', error) // eslint-disable-line no-console
        if (this.props.setProcessing) {
          this.props.setProcessing(false)
        }
      })
  }
  render(){
    const { t, validateStatus } = this.props
    const options = this.state.data.map((d, index) => <Option value={index}>{d.description}</Option>)
    return (
      <Item validateStatus={validateStatus} label={<InputLabel>{t('city')}</InputLabel>}>
        <Select
          value={this.props.value.description}
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
