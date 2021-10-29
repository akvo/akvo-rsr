import React from 'react'
import { Row, Col, Input, Icon, Button, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { DropdownCountry } from './DropdownCountry'
import { SelectDropdown } from './SelectDropdown'
import { handleOnCountry } from '../../../utils/misc'

const { Text } = Typography

export const HeaderFilter = ({
  error,
  search,
  countries,
  periods,
  selectedCountries,
  selectedPeriod,
  onReset,
  onPeriod,
  onSearch,
  onCountry
}) => {
  const { t } = useTranslation()
  const countryTags = selectedCountries.length ? selectedCountries.map((sc) => handleOnCountry(sc)) : []
  const isDisabled = error ? true : false
  return (
    <Row gutter={[8, 8]} style={{ borderTop: '1px solid #eee' }}>
      <Col lg={7} xs={12}>
        <Input
          placeholder="Search title indicators"
          prefix={<Icon type="search" />}
          onChange={(e) => onSearch(e.target.value)}
          value={search}
          disabled={isDisabled}
          allowClear
        />
      </Col>
      <Col lg={4} xs={6}>
        {countries
          ? (
            <DropdownCountry
              disabled={isDisabled}
              style={{
                width: '100%',
                textAlign: 'left'
              }}
              {...{
                countries,
                onCountry,
                selected: selectedCountries
              }}
            />
          ) : <Button block>Loading...</Button>}
      </Col>
      <Col lg={4} xs={6}>
        <SelectDropdown
          disabled={isDisabled}
          label={t('All Periods')}
          style={{
            width: '100%',
            textAlign: 'left'
          }}
          {...{
            error,
            items: periods,
            selected: selectedPeriod,
            onClick: onPeriod
          }}
        />
      </Col>
      <Col lg={7} xs={20}>
        {countryTags && countryTags.map(c => (
          <Tag
            closable
            key={c.code}
            onClose={() => {
              onCountry(c.code, false)
              if (countryTags.length === 1) onReset()
            }}
          >
            {c.name}
          </Tag>
        ))}
        {(!countryTags.length && (selectedCountries.length || selectedPeriod))
          ? (
            <Button type="link" onClick={onReset}>
              <Icon type="close" className="wcaro-text success" />
              <Text className="wcaro-text success" strong>
                Clear Filters
              </Text>
            </Button>
          )
          : null
        }
      </Col>
      <Col lg={2} xs={4}>
        {(countryTags.length && (selectedCountries.length || selectedPeriod))
          ? (
            <Button type="link" onClick={onReset}>
              <Icon type="close" className="wcaro-text success" />
              <Text className="wcaro-text success" strong>
                Clear Filters
              </Text>
            </Button>
          ) : null
        }
      </Col>
    </Row>
  )
}
