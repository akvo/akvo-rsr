import React from 'react'
import { Input, Icon, Button, Select, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'

const { Option } = Select

const FilterBar = ({ filteredResults, periodFilter, setPeriodFilter, setStatusFilter, setTreeFilter, setSelectedPeriods, setActiveResultKey, indicatorsFilter, selectedLocked, selectedUnlocked, handleUnlock, handleLock, src, handleSearchInput, periods = [], resultsType }) => {
  const { t } = useTranslation()

  const handlePeriodFilter = (value) => {
    setPeriodFilter(value)
    setStatusFilter(null)
    setTreeFilter({
      resultIds: [],
      indicatorIds: [],
      periodIds: [],
      updateIds: []
    })
    let allPeriods = []
    filteredResults.forEach(res => {
      res.indicators.filter(indicatorsFilter).forEach(ind => {
        allPeriods = [
          ...allPeriods,
          ...ind.periods.filter(it => {
            if (!value) return true
            const dates = value.split('-')
            return it.periodStart === dates[0] && it.periodEnd === dates[1]
          }).map(it => ({ id: it.id, locked: it.locked, indicatorId: ind.id, resId: res.id }))
        ]
      })
    })
    if (value) {
      setSelectedPeriods(allPeriods)
      setActiveResultKey(allPeriods.filter((it, ind) => allPeriods.findIndex(_it => _it.resId === it.resId) === ind).map(it => it.resId))
    } else {
      setSelectedPeriods([])
      setActiveResultKey([])
    }
  }
  return (
    <Row gutter={8}>
      <Col span={4} className="divider" style={{ paddingTop: '3px', paddingRight: '1em' }}>
        <div className="label">{t('Filter by indicator title')}</div>
        <Input value={src} onChange={handleSearchInput} placeholder="Search" prefix={<Icon type="search" />} allowClear />
      </Col>
      <Col span={4} style={{ paddingLeft: '1em' }}>
        <span className="label">{t('Filter period')}</span>
        <div>
          <Select dropdownMatchSelectWidth={false} placeholder="Period range" value={periodFilter} onChange={handlePeriodFilter} style={{ width: '100%' }}>
            <Option value={null}>{t('All periods')}</Option>
            {periods?.map((option, index) => <Option key={index} value={`${option.start}-${option.end}`}>{option.start} - {option.end}</Option>)}
          </Select>
        </div>
      </Col>
      {resultsType === 'results' && (
        <Col span={8} style={{ paddingTop: '1.5em' }}>
          <Button
            type="ghost"
            disabled={selectedLocked.length === 0}
            className="unlock"
            icon="unlock"
            onClick={handleUnlock}>
            {selectedLocked.length === 0 ? t('Unlock') : t('Unlock {{N}} periods', { N: selectedLocked.length })}
          </Button>
          <Button
            type="ghost"
            disabled={selectedUnlocked.length === 0}
            className="lock"
            icon="lock"
            onClick={handleLock}>
            {selectedUnlocked.length === 0 ? t('Lock') : t('Lock {{N}} periods', { N: selectedUnlocked.length })}
          </Button>
        </Col>
      )}
    </Row>
  )
}

export default FilterBar
