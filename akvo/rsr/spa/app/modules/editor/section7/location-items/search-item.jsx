import React from 'react'
import { Form, Select, Spin } from 'antd'
import { withTranslation } from 'react-i18next'
import loadGoogleMapsApi from 'load-google-maps-api'

import InputLabel from '../../../../utils/input-label'
import { googleApiKey } from '../../../../utils/constants'

const { Item } = Form
const { Option } = Select

let timeout

function $fetch(input, callback, gservice) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }

  function req() {
    gservice.getPlacePredictions({ input, types: ['(cities)'] }, (results, status) => {
      if (status !== 'OK') {
        console.log('error', status)
        return
      }
      callback(results)
    })
  }

  timeout = setTimeout(req, 300)
}

class SearchItem extends React.Component{
  state = {
    data: [],
    fetching: false
  }
  componentWillMount(){
    loadGoogleMapsApi({ libraries: ['places'], key: googleApiKey })
      .then((googleMaps) => {
        this.gservice = new googleMaps.places.AutocompleteService()
        this.geocoder = new googleMaps.Geocoder()
      }).catch((error) => {
        console.error(error)
      })
  }
  handleSearch = (value) => {
    this.setState({
      fetching: true
    })
    $fetch(value, data => this.setState({ data, fetching: false }), this.gservice)
  }
  handleChange = (index) => {
    this.geocoder.geocode({ placeId: this.state.data[index].place_id }, (d) => {
      if(d.length < 1) return
      const coordinates = {
        lat: d[0].geometry.location.lat(),
        lng: d[0].geometry.location.lng()
      }
      this.props.onChange({ ...this.state.data[index], coordinates})
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
