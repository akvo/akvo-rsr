/* global window */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox, Collapse, Dropdown, Icon, Input, Menu, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/core'
import { useSpring, animated } from 'react-spring'
import moment from 'moment'
import * as clipboard from 'clipboard-polyfill'
import * as actions from '../editor/actions'
import api from '../../utils/api'
import LoadingOverlay from '../../utils/loading-overlay'
import { resultTypes } from '../../utils/constants'
import './styles.scss'
import AssignmentView from './assignment-view'

const Enumerators = ({ match: { params: { id } }, rf, setRF, setProjectTitle }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [src, setSrc] = useState('')
  const [selectedIndicators, setSelectedIndicators] = useState([])
  const [indicatorMap, setIndicatorMap] = useState(null)
  const [enumerators, setEnumerators] = useState([])
  const [allChecked, setAllChecked] = useState(false)
  const [allUnassignedChecked, setAllUnassignedChecked] = useState(false)
  const generateIndicatorMap = (data) => {
    const ret = {}
    data.results.forEach(result => {
      result.indicators.forEach(indicator => {
        ret[indicator.id] = indicator
      })
    })
    setIndicatorMap(ret)
  }
  useEffect(() => {
    if (!rf) {
      api.get(`/project/${id}/results_framework/`)
        .then(({ data }) => {
          data.results.forEach(result => {
            result.indicators.forEach(indicator => {
              indicator.periods.forEach(period => { period.result = result.id })
            })
          })
          setRF(data)
          setLoading(false)
          setProjectTitle(data.title)
          generateIndicatorMap(data)
        })
    } else {
      setLoading(false)
      setProjectTitle(rf.title)
      generateIndicatorMap(rf)
    }
    api.get(`/project/${id}/enumerators/`)
      .then(({ data }) => {
        setEnumerators(data)
      })
  }, [])
  const resultsFilter = it => {
    const srcFilter = it.indicators.filter(ind => src.length === 0 || ind.title.toLowerCase().indexOf(src.toLowerCase()) !== -1).length > 0
    return srcFilter
  }
  const indicatorsFilter = it => {
    const srcFilter = src.length === 0 || it.title.toLowerCase().indexOf(src.toLowerCase()) !== -1
    return srcFilter
  }
  const handleSelectIndicator = (indicatorId) => ({ target: { checked } }) => {
    if (checked) {
      setSelectedIndicators([...selectedIndicators, indicatorId])
    } else {
      setSelectedIndicators(selectedIndicators.filter(it => it !== indicatorId))
    }
  }
  const isIndicatorUnassignedFilter = (indicator) => {
    let unassigned = true
    enumerators.forEach(it => { if (it.indicators.indexOf(indicator.id) !== -1) unassigned = false })
    return unassigned
  }
  const allUnassignedIndicators = rf?.results.reduce((acc, val) => ([...acc, ...val.indicators.filter(isIndicatorUnassignedFilter).map(it => it.id)]), [])
  const toggleAllChecked = () => {
    if (!allChecked) {
      setAllChecked(true)
      setSelectedIndicators(rf.results.reduce((acc, val) => ([...acc, ...val.indicators.map(it => it.id)]), []))
    } else {
      setAllChecked(false)
      setSelectedIndicators([])
    }
  }
  const toggleAllUnassignedChecked = () => {
    if (!allUnassignedChecked) {
      setAllUnassignedChecked(true)
      setSelectedIndicators(allUnassignedIndicators)
    } else {
      setAllUnassignedChecked(false)
      setSelectedIndicators([])
    }
  }
  const toggleOverallChecked = () => {
    if (!allChecked && !allUnassignedChecked) {
      toggleAllChecked()
    }
    if (allChecked) {
      toggleAllChecked()
    }
    if (allUnassignedChecked) {
      toggleAllUnassignedChecked()
    }
  }
  const handleSelectMenu = ({ key }) => {
    if (key === 'all') {
      toggleAllChecked()
    } else {
      toggleAllUnassignedChecked()
    }
  }
  const handleSearchInput = (ev) => {
    setSrc(ev.target.value)
  }
  const SelectMenu = (
    <Menu onClick={handleSelectMenu} className="select-menu">
      <Menu.Item key="all">
        <Checkbox checked={allChecked} /> All indicators ({rf?.results.reduce((acc, val) => ([...acc, ...val.indicators]), [])?.length})
      </Menu.Item>
      <Menu.Item key="unassigned">
        <Checkbox checked={allUnassignedChecked} /> All unassigned indicators ({allUnassignedIndicators?.length})
      </Menu.Item>
    </Menu>
  )
  return (
    <div className="enumerators-tab">
      <LoadingOverlay loading={loading} />
      {!loading && [
        <div className="top-toolbar">
          <Dropdown overlay={SelectMenu} trigger={['click']}>
            <div className="checkbox-dropdown">
              <Checkbox checked={allChecked || allUnassignedChecked} onChange={toggleOverallChecked} onClick={(e) => e.stopPropagation()} />
              <Icon type="caret-down" />
            </div>
          </Dropdown>
          <div className="src">
            <Input placeholder={t('Find an indicator...')} prefix={<Icon type="search" />} onChange={handleSearchInput} value={src} allowClear />
          </div>
        </div>,
        <div css={css`
          display: flex;
          border-top: 1px solid #ccc;
        `}
        >
          <div css={css`flex: 1`} className="results-list">
            {rf?.results?.filter(resultsFilter)?.map(result => [
              <div className="result-header">
                <div className="text">
                  <span>{result.title}</span>
                  <div>
                    <small>{t(resultTypes.find(it => it.value === result.type)?.label)}</small>
                    <i>{t('{{count}} indicators', { count: result.indicators.length })}</i>
                  </div>
                </div>
              </div>,
              result.indicators.filter(indicatorsFilter).map(indicator => {
                const assignees = enumerators.filter(enumerator => enumerator.indicators.indexOf(indicator.id) !== -1)
                const unlockedPeriods = indicator.periods.filter(it => it.locked === false)
                return [
                  <div className="indicator-li">
                    <Checkbox checked={selectedIndicators.indexOf(indicator.id) !== -1} onChange={handleSelectIndicator(indicator.id)} />
                    <div>
                      <h5>{indicator.title}</h5>
                      <div>
                        <span>{assignees.length === 1 ? t('Enumerator') : t('Enumerators')}:</span> {assignees.length === 0 ? <b>-</b> : assignees.reduce((acc, val) => [...acc, <b>{val.name}</b>, <i>, </i>], []).slice(0, -1)}
                        {unlockedPeriods.length === 0 && <b className="no-unlocked">No unlocked periods</b>}
                      </div>
                    </div>
                  </div>
                ]
              })
            ])}
          </div>
          <div className="sidebar">
            <div className="hider">
              <Slider page={selectedIndicators.length === 0 ? 0 : 1}>
                <EnumeratorList {...{ selectedIndicators, indicatorMap, enumerators, id, setEnumerators }} />
                <AssignmentView {...{ selectedIndicators, setSelectedIndicators, id, enumerators, setEnumerators }} />
              </Slider>
            </div>
          </div>
        </div>
      ]}
    </div>
  )
}

const EnumeratorList = ({ selectedIndicators, indicatorMap, enumerators, id, setEnumerators }) => {
  const [sending, setSending] = useState('')
  const { t } = useTranslation()
  const handleSendEmail = (enumerator) => (e) => {
    e.stopPropagation()
    setSending(enumerator.email)
    api.post(`/project/${id}/enumerator-assignment-send/`, { emails: [enumerator.email] })
      .then(({ data }) => {
        const _enumerators = enumerators.map(it => ({ ...it }))
        const _it = _enumerators.find(it => it.email === enumerator.email)
        if (_it != null) {
          _it.dateSent = new Date().toISOString()
          _it.token = data.data[0].token
          setEnumerators(_enumerators)
        }
        setSending(false)
      })
      .catch(() => {
        setSending(false)
      })
  }
  const handleUnassign = (enumerator, indicatorId) => () => {
    const _enumerators = enumerators.map(it => ({ ...it }))
    const _enumerator = _enumerators.find(it => it.email === enumerator.email)
    if (_enumerator) {
      _enumerator.indicators = _enumerator.indicators.filter(id => id !== indicatorId)
      api.patch(`/project/${id}/enumerators/`, [_enumerator])
      setEnumerators(_enumerators)
    }
  }
  const handleMoreItemClick = (enumerator) => ({ key }) => {
    if (key === 'unassign-all') {
      api.patch(`/project/${id}/enumerators/`, [{ email: enumerator.email, indicators: [] }])
      const _enumerators = enumerators.map(it => ({ ...it }))
      const _it = _enumerators.find(it => it.email === enumerator.email)
      if (_it) _it.indicators = []
      setEnumerators(_enumerators)
    } else if (key === 'copy-link') {
      clipboard.writeText(`${window.location.host}/my-rsr/projects/${id}/results/?rt=${enumerator.token}`)
      notification.open({
        message: t('Link copied!'),
        icon: <Icon type="link" style={{ color: '#108ee9' }} />,
      })
    }
  }
  const MoreMenu = (enumerator) => (
    <Menu onClick={handleMoreItemClick(enumerator)}>
      <Menu.Item key="unassign-all">
        Unassign all
      </Menu.Item>
      {enumerator.token &&
        <Menu.Item key="copy-link">
          Copy form access link
        </Menu.Item>
      }
    </Menu>
  )

  const handleViewPreview = (enumerator) => (e) => {
    e.stopPropagation()
    window.open(`/my-rsr/projects/${id}/results/?rt=preview&indicators=${enumerator.indicators.join(',')}`)
  }
  return [
    <div className="enum-list view">
      <header>
        Enumerators List
      </header>
      <ul>
        {enumerators.sort((a, b) => b.indicators.length - a.indicators.length).map(enumerator => {
          const indicatorsWithUnlockedPeriods = enumerator.indicators.filter(indicatorId => indicatorMap?.[indicatorId]?.periods?.filter(it => it.locked === false)?.length > 0)
          return [
            <li>
              <div css={css`width: 100%`}>
                <div css={css`display: flex; .ant-btn{ margin-left: auto; font-size: 30px; margin-top: 4px; transform: rotate(90deg) }`}>
                  <h5>{enumerator.name}</h5>
                  {enumerator.indicators.length > 0 &&
                    <Dropdown overlay={MoreMenu(enumerator)} trigger={['click']}>
                      <Button icon="more" type="link" />
                    </Dropdown>
                  }
                </div>
                {enumerator.indicators.length === 0 ? [
                  <div css={css`margin: 10px 14px 14px; color: #aaa;`}>No assignments</div>
                ] : [
                  <Collapse bordered={false} className="assignment-collapse">
                    <Collapse.Panel header={[
                      <span>{enumerator.indicators.length} indicators</span>,
                      enumerator.dateSent != null ?
                        [<div className="sent-on">Assignment sent {moment(enumerator.dateSent).fromNow()}</div>, <Button size="small" onClick={handleSendEmail(enumerator)}>Resend</Button>, <Button icon="eye" className="preview-btn" size="small" onClick={handleViewPreview(enumerator)} />]
                        :
                        indicatorsWithUnlockedPeriods.length > 0 ?
                          [
                            <Button loading={sending === enumerator.email} type="primary" size="small" onClick={handleSendEmail(enumerator)}>Send Assignment</Button>,
                            <Button icon="eye" className="preview-btn" size="small" onClick={handleViewPreview(enumerator)} />
                          ]
                          :
                          <Button disabled size="small">No unlocked periods</Button>
                    ]}
                    >
                      <ul>
                        {enumerator.indicators.map(indicatorId =>
                          <li>
                            <div>
                              <h5>{indicatorMap?.[indicatorId]?.title}</h5>
                              <Button size="small" onClick={handleUnassign(enumerator, indicatorId)}>Unassign</Button>
                            </div>
                            {indicatorMap?.[indicatorId]?.periods?.filter(it => it.locked === false)?.length === 0 && <b className="no-unlocked">No unlocked periods</b>}
                          </li>
                        )}
                      </ul>
                    </Collapse.Panel>
                  </Collapse>
                ]}
              </div>
            </li>
          ]
        }
        )}
      </ul>
    </div>
  ]
}

const Slider = ({ children, page }) => {
  const [xprops, xset] = useSpring(() => ({ transform: 'translateX(0px)' }))
  useEffect(() => {
    xset({ transform: `translateX(${page * -470}px)`, config: { tension: 240, friction: 29 } })
  }, [page])
  return [
    <animated.div style={xprops} className="slider-container">
      {children}
    </animated.div>
  ]
}

export default connect(
  null, actions
)(Enumerators)
