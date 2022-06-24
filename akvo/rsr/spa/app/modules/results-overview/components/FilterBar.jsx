import React from 'react'
import { Input, Icon, Button, Select, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'

const { Option } = Select

export const FilterBar = ({
  period,
  periods,
  selectedPeriods,
  handleOnSearch,
  handleSwitchLock,
  handleOnSelectPeriod,
  disabled = false
}) => {
  const { t } = useTranslation()
  const selectedLocked = handleSwitchLock ? selectedPeriods?.filter(it => it.locked) : []
  const selectedUnlocked = handleSwitchLock ? selectedPeriods?.filter(it => !it.locked) : []
  return (
    <Row gutter={[16, 8]} className="filter-bar">
      <Col lg={4} md={6} sm={12} xs={24} className="divider">
        <div className="label">{t('Filter by indicator title')}</div>
        <Input placeholder="Search" prefix={<Icon type="search" />} allowClear onChange={(e) => handleOnSearch(e.target.value)} disabled={disabled} />
      </Col>
      <Col lg={5} md={8} sm={12} xs={24} className="filter-period">
        <div className="label">{t('Select period')}</div>
        <Select
          value={period || ''}
          dropdownMatchSelectWidth={false}
          placeholder="Period range"
          style={{ width: '100%' }}
          onChange={value => handleOnSelectPeriod(value)}
          disabled={disabled}
        >
          <Option value="">{t('All periods')}</Option>
          {periods && periods.map(p => <Option key={p}>{p}</Option>)}
        </Select>
      </Col>
      <Col lg={7} md={10} sm={24} xs={24} style={{ paddingTop: '1.5em' }}>
        {handleSwitchLock && (
          <>
            <Button
              type="ghost"
              className="unlock"
              icon="unlock"
              onClick={() => handleSwitchLock('unlock')}
              disabled={selectedLocked.length === 0}
            >
              {selectedLocked.length === 0 ? t('Unlock') : t('Unlock {{N}} periods', { N: selectedLocked.length })}
            </Button>
            <Button
              type="ghost"
              className="lock"
              icon="lock"
              onClick={() => handleSwitchLock('lock')}
              disabled={selectedUnlocked.length === 0}
            >
              {selectedUnlocked.length === 0 ? t('Lock') : t('Lock {{N}} periods', { N: selectedUnlocked.length })}
            </Button>
          </>
        )}
      </Col>
    </Row>
  )
}
