import React from 'react'
import { Dropdown, Menu, Checkbox, Button, Icon } from 'antd'
import { useTranslation } from 'react-i18next'
import allCountries from '../../../utils/countries.json'

export const DropdownCountry = ({ countries, selected, onCountry }) => {
  const filteredCountries = allCountries.filter(country => Object.values(countries).includes(country.code))
  const { t } = useTranslation()
  return (
    <Dropdown
      overlay={(
        <Menu>
          {filteredCountries && filteredCountries.map(country => {
            const checked = selected.find(item => item === country.code) === undefined ? false : true
            return (
              <Menu.Item value={country.code} key={country.code}>
                <Checkbox onChange={(e) => onCountry(country.code, e.target.checked)} {...{ checked }} />&nbsp;{country.name}
              </Menu.Item>
            )
          })}
        </Menu>
      )}
    >
      <Button type="link" className="ant-dropdown-link">
        <Icon type="down" />&nbsp;{t('All Countries')}
      </Button>
    </Dropdown>
  )
}
