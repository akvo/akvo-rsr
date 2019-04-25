import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Select, Icon } from 'antd'

import InputLabel from '../../../../utils/input-label'
import countries from '../../../../utils/countries'
import SearchItem from './search-item'
import * as actions from '../actions'
import '../styles.scss'

const { Item } = Form
const { Option } = Select


const Locations = ({ rdr, ...props }) => (
  <div className="locations view">
    <Form layout="vertical">
      <h3>Locations</h3>
      {rdr.locations.map((item, index) =>
        <div className="location-item">
          <SearchItem
            location={item}
            onChange={location => props.editLocation(location, index)}
            onRemove={() => props.removeLocation(index)}
          />
        </div>
      )}
      <Button onClick={() => props.addLocation()} icon="plus" type="dashed" block>
        Add location
      </Button>
      <h3>Recipient country</h3>
      {rdr.countries.map((countryCode, index) =>
      <div className="location-item">
        <Item label={<InputLabel optional tooltip="..." more={<Icon type="delete" onClick={() => props.removeCountry(index)} />}>Country</InputLabel>}>
          <Select
            optionFilterProp="children"
            showSearch
            value={countryCode}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onChange={(value) => { props.editCountry(value, index) }}
          >
            {countries.map(country =>
            <Option value={country.code}>{country.name}</Option>
            )}
          </Select>
        </Item>
      </div>
      )}
      <Button onClick={props.addCountry} className="bottom-btn" icon="plus" type="dashed" block>Add recipient country</Button>
    </Form>
  </div>
)

export default connect(
  ({ locationsRdr }) => ({ rdr: locationsRdr }),
  actions
)(Locations)
