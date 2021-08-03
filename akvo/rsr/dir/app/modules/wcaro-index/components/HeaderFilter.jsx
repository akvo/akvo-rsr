import React from 'react'
import { Row, Col, Menu, Dropdown, Button, Icon, Checkbox, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import Search from '../../index/search'
import allCountries from '../../../utils/countries.json'

export const HeaderFilter = ({
  countries,
  periods,
  items,
  selectedCountries,
  selectedPeriod,
  onSearch,
  onCountry,
  onPeriod
}) => {
  const { t } = useTranslation()
  const filterCountries = allCountries.filter(country => Object.values(countries).includes(country.code))
  const countryTags = selectedCountries.length > 0
    ? allCountries.filter(country => selectedCountries.includes(country.code))
    : []
  return (
    <Row>
      <Col span={6}>
        <Search
          loading={false}
          onClear={() => onSearch('')}
          onChange={value => onSearch(value)}
          {...{ items }}
        />
      </Col>
      <Col lg={18} sm={12}>
        <Dropdown
          overlay={(
            <Menu>
              {filterCountries && filterCountries.map(country => {
                const checked = selectedCountries.find(item => item === country.code) === undefined ? false : true
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
        <Dropdown
          overlay={(
            <Menu onClick={({ key }) => onPeriod(key)}>
              <Menu.Item key={t('All Periods')}>{t('All Periods')}</Menu.Item>
              {periods && periods.map(period => <Menu.Item key={period}>{period}</Menu.Item>)}
            </Menu>
          )}
        >
          <Button type="link" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <Icon type="down" />&nbsp;{selectedPeriod || t('All Periods')}
          </Button>
        </Dropdown>
        {countryTags && countryTags.map(country => <Tag key={country.code} closable onClose={() => onCountry(country.code, false)}>{country.name}</Tag>)}
      </Col>
    </Row>
  )
}
