import React from 'react'
import { Row, Col, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import Search from '../../index/search'
import allCountries from '../../../utils/countries.json'
import { DropdownCountry } from './DropdownCountry'
import { SelectDropdown } from './SelectDropdown'

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
        <DropdownCountry
          {...{
            countries,
            selected: selectedCountries,
            onCountry
          }}
        />
        <SelectDropdown
          label={t('All Periods')}
          {...{
            items: periods,
            selected: selectedPeriod,
            onClick: onPeriod
          }}
        />
        {countryTags && countryTags.map(country => <Tag key={country.code} closable onClose={() => onCountry(country.code, false)}>{country.name}</Tag>)}
      </Col>
    </Row>
  )
}
