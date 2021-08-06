import React from 'react'
import { Drawer, Row, Col, Divider } from 'antd'
import { useTranslation } from 'react-i18next'
import { DropdownCountry } from './DropdownCountry'
import { SelectDropdown } from './SelectDropdown'
import { ListPeriods } from './ListPeriods'

export const IndicatorDrawer = ({
  result,
  onClose,
  visible,
  countries,
  periods,
  selectedCountries,
  selectedPeriod,
  onPeriod,
  onCountry
}) => {
  const { t } = useTranslation()
  return (
    <Drawer
      title={result ? result.title : ''}
      width={720}
      onClose={onClose}
      visible={visible}
    >
      <Row>
        <Col span={16}>
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
        </Col>
      </Row>
      <Divider />
      {result && <ListPeriods {...{ result }} />}
    </Drawer>
  )
}
