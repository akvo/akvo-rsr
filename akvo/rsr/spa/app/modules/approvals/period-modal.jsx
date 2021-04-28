import React, { useState, useEffect } from 'react'
import { Button, Icon, Modal, Select } from 'antd'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import COUNTRIES from '../../utils/countries.json'
import Search from '../../utils/search'


const countryDict = {}
COUNTRIES.forEach((it) => {
  countryDict[it.code] = it.name
})

const PeriodModal = ({ visible, onCancel, period, updatePeriods }) => {
  const { t } = useTranslation()
  const [src, setSrc] = useState('')
  const [countryFilter, setCountryFilter] = useState(null)
  const [countryOpts, setCountryOpts] = useState([])
  useEffect(() => {
    if (period) {
      setTimeout(() => {
        const opts = Object.keys(period.projects).reduce((acc, projectId) => [...acc, ...period.projects[projectId].countries], [])
        setCountryOpts(opts.filter((it, index) => opts.indexOf(it) === index))
      }, 500)
    }
    else {
      setTimeout(() => {
        setSrc('')
      }, 500)
    }
  }, [period])
  const projectFilter = projectId => {
    let ret = true
    if (src !== '') ret = period?.projects[projectId].title.toLowerCase().indexOf(src.toLowerCase()) !== -1
    if (ret && countryFilter != null) ret = period.projects[projectId].countries.indexOf(countryFilter) !== -1
    return ret
  }
  return (
    <Modal {...{ visible, onCancel }} width={720} className="period-lock-modal" footer={null}>
      <header>
        <h4>{t('period locking')}</h4>
        {period && <h3>{moment(period.dates[0], 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.dates[1], 'DD/MM/YYYY').format('DD MMM YYYY')}</h3>}
        <div className="btns">
          <Button className="lock" onClick={() => updatePeriods(true, period.projectsUnlocked.reduce((acc, val) => [...acc, ...Object.keys(val.periods).map(it => ({ ...val.periods[it], projectId: val.id }))], []), period.dates.join('-'))} disabled={period?.projectsUnlocked.length === 0}><Icon type="lock" /> {t('Lock for all')}</Button>
          <Button className="unlock" onClick={() => updatePeriods(false, period.projectsLocked.reduce((acc, val) => [...acc, ...Object.keys(val.periods).map(it => ({ ...val.periods[it], projectId: val.id }))], []), period.dates.join('-'))} disabled={period?.projectsLocked.length === 0}><Icon type="unlock" /> {t('Unlock for all')}</Button>
        </div>
      </header>
      <div className="meta row">
        <h4>{t('projects')}</h4>
        <div className="filters">
          <Search placeholder={t('Find a project...')} onChange={setSrc} onClear={() => setSrc('')} />
          <Select value={countryFilter} onChange={setCountryFilter} showSearch allowClear optionFilterProp="children" placeholder={t('Filter by country')}>
            {countryOpts.map(code => <Select.Option key={code} value={code}>{countryDict[code.toUpperCase()]}</Select.Option>)}
          </Select>
        </div>
      </div>
      <ul>
        {period && Object.keys(period.projects).filter(projectFilter).map(projectId => {
          const periodIds = period.projects[projectId].periods
          const periods = Object.keys(periodIds).map(id => ({ ...period.projects[projectId].periods[id], projectId }))
          const unlocked = periods.filter(it => it.locked).length === 0
          return (
            <li>
              <h5>{period.projects[projectId].title}</h5>
              <div className="right">
                {!unlocked ? [<div className="status locked"><Icon type="lock" /> Locked</div>, <Button size="small" onClick={() => updatePeriods(false, periods, period.dates.join('-'), projectId)}>{t('Unlock')}</Button>] :
                  [<div className="status unlocked"><Icon type="unlock" /> Unlocked</div>, <Button size="small" onClick={() => updatePeriods(true, periods, period.dates.join('-'), projectId)}>{t('Lock')}</Button>]}
              </div>
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}

export default PeriodModal
