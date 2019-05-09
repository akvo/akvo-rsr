import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Select, Icon } from 'antd'

import InputLabel from '../../../../utils/input-label'
import countries from '../../../../utils/countries'
import * as actions from './actions'
import '../styles.scss'

const { Item } = Form
const { Option } = Select


const RecipientCountries = ({ rdr, ...props }) => (
  <div>
      <h3>Recipient country</h3>
      {rdr.map((country, index) =>
      <div className="location-item">
        <Item label={<InputLabel optional tooltip="..." more={<Icon type="delete" onClick={() => props.remove(index)} />}>Country</InputLabel>}>
          <Select
            optionFilterProp="children"
            showSearch
            value={country.code}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onChange={(value) => { props.editField(index, 'code', value) }}
          >
            {countries.map(item =>
            <Option value={item.code}>{item.name}</Option>
            )}
          </Select>
        </Item>
      </div>
      )}
      <Button onClick={() => props.add()} icon="plus" type="dashed" block>
        Add recipient country
      </Button>
  </div>
)

export default connect(
  ({ recipientCountriesRdr }) => ({ rdr: recipientCountriesRdr }),
  actions
)(RecipientCountries)
