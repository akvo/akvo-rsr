/* global window, document */
import React, { useState, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { Button, Spin, Icon, Card, Select, DatePicker, Checkbox, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import Cookie from 'js-cookie'
import moment from 'moment'
import classNames from 'classnames'
import axios from 'axios'
import { useFetch } from '../../utils/hooks'
import api from '../../utils/api'
import SUOrgSelect from '../users/su-org-select'
import LoadingOverlay from '../../utils/loading-overlay'
import './styles.scss'
import { isRSRAdmin } from '../../utils/feat-flags'

function uid(len) {
  const buf = []
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const length = len || 16

  for (let i = 0; i < length; i += 1) {
    buf[i] = chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return buf.join('')
}

function getUrlParam(url, name) {
  const query = url.substring(url.indexOf('?') + 1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split('=')
    if (pair[0] === name) {
      return pair[1]
    }
  }
  return null
}

const Reports = ({ programId, projectId, userRdr }) => {
  const [currentOrg, setCurrentOrg] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [{ results: reports = [] }, loading] = useFetch(programId ? `/program_reports/${programId}/` : projectId ? `/project/${projectId}/reports/` : '/organisation_reports/')
  useEffect(() => {
    setCurrentOrg(userRdr?.organisations?.[0]?.id)
  }, [userRdr])
  const orgs = userRdr && userRdr.organisations ? userRdr.organisations : []
  if (!programId && !projectId) {
    const { t } = useTranslation()
    useEffect(() => { document.title = `${t('Reports')} | Akvo RSR` }, [])
  }
  const RSRAdmin = isRSRAdmin(userRdr)
  return (
    <div className={classNames('reports', { forProject: projectId != null })}>
      {!programId && !projectId && (
        <div className="header">
          {!RSRAdmin && orgs.length > 1 && (
            <Select dropdownMatchSelectWidth={false} value={currentOrg} onChange={setCurrentOrg}>
              {orgs.map(org => <Select.Option value={org.id}>{org.name}</Select.Option>)}
            </Select>
          )}
          {(RSRAdmin && currentOrg !== null) && <SUOrgSelect value={currentOrg} onChange={setCurrentOrg} />}
        </div>
      )}
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} /></div>}
      <div className="cards">
        {!loading &&
          reports
            .filter(it => it.organisations.length === 0 || projectId || programId || it.organisations.indexOf(currentOrg) !== -1)
            .sort((a, b) => { if (b.organisations.length > 0 && a.organisations.length === 0) return -1; return 0 })
            .map((report) =>
              <Report {...{ report, currentOrg, projectId, programId }} setDownloading={setDownloading} key={report.id} />
            )}
      </div>
      <LoadingOverlay loading={downloading} title="Generating report" />
    </div>
  )
}

function getPeriodDatesURL(resourceId, isProgram, countryName) {
  const countryParam = countryName ? `?country=${countryName}` : ''
  return isProgram ? `/program_reports/${resourceId}/period-dates/${countryParam}` : `/project/${resourceId}/reports/period-dates/`
}

function getCountryUrlParam(url) {
  const country = getUrlParam(url, 'country')
  return country !== '{country}' ? country : null
}

const Report = ({ report, currentOrg, projectId, programId, setDownloading }) => {
  const { t } = useTranslation()
  const hasCommentCheck = report.parameters.indexOf('comment') !== -1
  const hasDateRangePicker = report.parameters.indexOf('start_date') !== -1
  const hasPeriodDates = report.parameters.indexOf('period_start') !== -1
  const hasCountry = report.parameters.indexOf('country') !== -1
  const initialState = {}
  if (hasDateRangePicker) { initialState.start_date = ''; initialState.end_date = '' }
  if (hasPeriodDates) { initialState.period_start = ''; initialState.period_end = '' }
  if (hasCommentCheck) initialState.comment = true
  const countryName = getCountryUrlParam(report.url)
  if (countryName) initialState.country = countryName
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }), // eslint-disable-line
    initialState
  )
  const [periodDates, setPeriodDates] = useState([])
  useEffect(() => {
    async function fetchPeriodDates() {
      const periodDatesURL = getPeriodDatesURL(programId || projectId, !!programId, state.country)
      try {
        const { data } = await api.get(periodDatesURL)
        setPeriodDates(data)
      } catch {
        setPeriodDates([])
      }
    }
    if (hasPeriodDates) {
      fetchPeriodDates()
    }
  }, [state.country])
  const [countries] = programId && hasCountry ? useFetch(`/program_reports/${programId}/countries/`) : [[]]
  const buildDownloadHandler = (format, $state) => {
    let downloadUrl = report.url.replace('{format}', format).replace('{organisation}', currentOrg)
    Object.keys($state).forEach((key) => {
      if ($state[key]) {
        downloadUrl = downloadUrl.replace(`{${key}}`, key.indexOf('_date') !== -1 ? $state[key].format('YYYY-MM-DD') : $state[key])
      }
    })
    if (projectId) {
      downloadUrl = downloadUrl.replace('{project}', projectId)
    }
    if (programId) {
      downloadUrl = downloadUrl.replace('{program}', programId)
    }
    if (downloadUrl.includes('download=true')) {
      return (e) => {
        e.stopPropagation()
        const token = uid()
        let timerId = setTimeout(function tick() {
          if (Cookie.get(token)) {
            clearTimeout(timerId)
            setDownloading(false)
          } else {
            timerId = setTimeout(tick, 1000)
          }
        }, 1000)
        setDownloading(true)
        setTimeout(() => {
          window.location.assign(`${downloadUrl}&did=${token}`)
        }, 500)
      }
    }
    return (e) => {
      e.stopPropagation()
      const handler = async () => {
        try {
          const { data } = await axios.get(downloadUrl)
          Modal.success({
            content: data,
          })
        } catch {
          Modal.error({
            title: 'Failed connecting to server',
            content: 'Please try again in a few minutes...',
          })
        } finally {
          setDownloading(false)
        }
      }
      setDownloading(true)
      handler()
    }
  }
  return (
    <div className="card-container">
      <Card hoverable className="report">
        <h3>{report.title}</h3>
        <div className="description">{report.description}</div>
        <div className="options">
          {hasCommentCheck && (
            <Checkbox checked={state.comment} onChange={e => { setState({ comment: e.target.checked }) }}>{t('Include value comments')}</Checkbox>
          )}
          {hasDateRangePicker && (
            <div className="date-range">
              <DatePicker
                placeholder={t('Start date')}
                value={state.start_date}
                onChange={(e) => setState({ start_date: e })}
                disabledDate={(date) => {
                  if (!state.end_date) return false
                  return date.valueOf() > state.end_date.valueOf()
                }}
              />
              <DatePicker
                placeholder={t('End date')}
                value={state.end_date}
                onChange={(e) => setState({ end_date: e })}
                disabledDate={(date) => {
                  if (!state.start_date) return false
                  return date.valueOf() < state.start_date.valueOf()
                }}
              />
            </div>
          )}
          {programId && hasCountry && (
            <div className="country">
              <Select dropdownMatchSelectWidth={false} placeholder={t('Country')} onChange={(e) => setState({ country: e })}>
                {countries.map(({ isoCode, name }) => <Select.Option value={isoCode} key={isoCode}>{name}</Select.Option>)}
              </Select>
            </div>
          )}
          {hasPeriodDates && (
            <div className="date-range">
              <Select dropdownMatchSelectWidth={false} placeholder={t('Period start')} allowClear={true} onChange={(e) => setState({ period_start: e })}>
                {periodDates.map(({ 0: startDate }) => <Select.Option value={startDate}>{moment(startDate).format('DD MMM YYYY')}</Select.Option>)}
              </Select>
              <Select dropdownMatchSelectWidth={false} placeholder={t('Period end')} allowClear={true} onChange={(e) => setState({ period_end: e })}>
                {periodDates.map(({ 1: endDate }) => <Select.Option value={endDate}>{moment(endDate).format('DD MMM YYYY')}</Select.Option>)}
              </Select>
            </div>
          )}
          {report.formats.map((format) =>
            <Button size="large" onClick={buildDownloadHandler(format.name, state)} icon={`file-${format.name}`} key={format.name} disabled={(hasPeriodDates && !periodDates.length) || (hasCountry && !state.country)}>
              {`Download ${format.displayName}`}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(Reports)
