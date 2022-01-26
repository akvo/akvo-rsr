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
  handleOnSelectPeriod
}) => {
  const { t } = useTranslation()
  const selectedLocked = handleSwitchLock ? selectedPeriods?.filter(it => it.locked) : []
  const selectedUnlocked = handleSwitchLock ? selectedPeriods?.filter(it => !it.locked) : []
  return (
    <Row gutter={8}>
      <Col span={4} className="divider" style={{ paddingTop: '3px', paddingRight: '1em' }}>
        <div className="label">{t('Filter by indicator title')}</div>
        <Input placeholder="Search" prefix={<Icon type="search" />} allowClear onChange={(e) => handleOnSearch(e.target.value)} />
      </Col>
      <Col span={5} style={{ paddingLeft: '1em' }}>
        <span className="label">{t('Select period')}</span>
        <div>
          <Select
            value={period || ''}
            dropdownMatchSelectWidth={false}
            placeholder="Period range"
            style={{ width: '100%' }}
            onChange={value => handleOnSelectPeriod(value)}
          >
            <Option value="">{t('All periods')}</Option>
            {periods && periods.map(p => <Option key={p}>{p}</Option>)}
          </Select>
        </div>
      </Col>
      <Col span={7} style={{ paddingTop: '1.5em' }}>
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
