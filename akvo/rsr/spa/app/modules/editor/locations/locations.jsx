import React from 'react'
import { Form } from 'antd'

import LocationsItems from './location-items/location-items'
import Countries from './countries/countries'

class LocationsView extends React.Component{
  render(){
    return (
      <div className="locations view">
        <Form layout="vertical">
          <LocationsItems />
          <hr />
          <Countries />
        </Form>
      </div>
    )
  }
}

export default LocationsView
