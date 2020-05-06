import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Input, Icon, Spin, Collapse, Button, Form, InputNumber } from 'antd'
import { Route, Link } from 'react-router-dom'
import moment from 'moment'
import SVGInline from 'react-svg-inline'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { resultTypes, indicatorTypes } from '../../utils/constants'
import './styles.scss'
import ProjectInitHandler from '../editor/project-init-handler'
import api from '../../utils/api'
import approvedSvg from '../../images/status-approved.svg'
import Timeline from './timeline'
import Update from './update'
import DsgOverview from './dsg-overview'

const { Panel } = Collapse
const { Item } = Form
const Aux = node => node.children

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

const Results = ({ results = [], isFetched, userRdr, match: {params: {id}}}) => {
  const { t } = useTranslation()
  const [src, setSrc] = useState('')
  const filteredResults = results.filter(it => {
    return it.indicators.filter(ind => src.length === 0 || ind.title.toLowerCase().indexOf(src.toLowerCase()) !== -1).length > 0
  })
  return (
    <div className="results-view">
      <div className="sidebar">
        <header>
          <Input value={src} onChange={(ev) => setSrc(ev.target.value)} placeholder="Find an indicator..." prefix={<Icon type="search" />} allowClear />
        </header>
        {/* TODO: make this fetch only section5, then fetch the rest upon tab switch */}
        <ProjectInitHandler id={id} match={{ params: { id, section: 'section1' }}} />
        <ul>
          {!isFetched && <Spin indicator={<Icon type="loading" style={{ fontSize: 20 }} spin />} />}
          {filteredResults.map((result, index) => (
            <Route
              path={`/projects/${id}/results/${result.id}/indicators/:indicatorId`}
              exact
              children={({ match }) =>
              <li className={match && 'active'}>
                <h5><b>{index + 1}.</b> {result.title}</h5>
                <div className="label">{resultTypes.find(it => it.value === result.type).label}</div>
                <div className="count-label">{result.indicators.length + 1} indicators</div>
                {result.indicators.length > 0 && (
                  <ul>
                    {result.indicators.filter(ind => src.length === 0 || ind.title.toLowerCase().indexOf(src.toLowerCase()) !== -1)
                    .map((indicator, iindex) => {
                      const findex = src === '' ? -1 : indicator.title.toLowerCase().indexOf(src.toLowerCase())
                      return (
                        <Route
                          path={`/projects/${id}/results/${result.id}/indicators/${indicator.id}`}
                          exact
                          children={({ match: _match }) =>
                          <li className={_match && 'active'}>
                            <Link to={`/projects/${id}/results/${result.id}/indicators/${indicator.id}`}>
                            <div>
                              <h5>Indicator <b>{iindex + 1}</b>: {findex === -1 ? indicator.title : [indicator.title.substr(0, findex), <b>{indicator.title.substr(findex, src.length)}</b>, indicator.title.substr(findex + src.length)]}</h5>
                              <div className="label">{indicatorTypes.find(it => it.value === indicator.type).label}</div>
                              <div className="count-label">{t('nperiods', { count: indicator.periods.length })}</div>
                            </div>
                            <Icon type="right" />
                            </Link>
                          </li>
                          }
                        />
                      )
                    })}
                  </ul>
                )}
              </li>
              }
            />
          ))}
        </ul>
      </div>
      <div className="main-content">
        {/* <Collapse accordion bordered={false} className="results-list" expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
          {results.map(result => (
            <Panel header={result.title}>
              <Collapse destroyInactivePanel bordered={false}>
              {result.indicators.map(indicator => (
                <Panel header={indicator.title}>
                  <Indicator userRdr={userRdr} projectId={id} match={{ params: {id: indicator.id }}} />
                </Panel>
              ))}
              </Collapse>
            </Panel>
          ))}
        </Collapse> */}
      <Route path="/projects/:projectId/results/:resId/indicators/:id" exact render={(props) => <Indicator {...{...props, projectId: id, userRdr}} />} />
      </div>
    </div>
  )
}

const Indicator = ({ projectId, match: {params: {id}}, userRdr }) => {
  const [periods, setPeriods] = useState(null)
  const [loading, setLoading] = useState(true)
  const [baseline, setBaseline] = useState({})
  useEffect(() => {
    if(id){
      api.get(`/project/${projectId}/indicator/${id}/`)
      .then(({data}) => {
        setPeriods(data.periods)
        setBaseline({ year: data.baselineYear, value: data.baselineValue })
        setLoading(false)
      })
    }
  }, [id])
  return (
    <Aux>
      {loading && <Spin indicator={<Icon type="loading" style={{ fontSize: 25 }} spin />} />}
      <Collapse accordion className="periods" bordered={false}>
        {periods && periods.map((period, index) => <Period {...{period, index, baseline, userRdr}} />
        )}
      </Collapse>
    </Aux>
  )
}

const Period = ({ period, baseline, userRdr, ...props }) => {
  const [hover, setHover] = useState(null)
  const [pinned, setPinned] = useState(-1)
  const [editing, setEditing] = useState(-1)
  const [updates, setUpdates] = useState([])
  const [sending, setSending] = useState(false)
  const updatesListRef = useRef()
  useEffect(() => {
    setUpdates(period.updates)
  }, [period])
  const handleAccordionChange = (key) => {
    setPinned(key)
  }
  const addUpdate = () => {
    setUpdates([...updates, {
      isNew: true,
      status: {code: 'D'},
      createdAt: new Date().toISOString(),
      value: 0,
      user: {
        name: `${userRdr.firstName} ${userRdr.lastName}`
      },
      comments: [],
      disaggregations: []
    }])
    setPinned(String(updates.length))
    setEditing(updates.length)
  }
  const cancelNewUpdate = () => {
    setUpdates(updates.slice(0, updates.length - 1))
    setPinned(-1)
  }
  const handleValueChange = (value) => {
    setUpdates([...updates.slice(0, editing), {...updates[editing], value}, ...updates.slice(editing + 1)])
  }
  const handleTextChange = ({target: {value: text}}) => {
    setUpdates([...updates.slice(0, editing), { ...updates[editing], text }, ...updates.slice(editing + 1)])
  }
  const handleValueSubmit = () => {
    setSending(true)
    const { text, value } = updates[editing]
    api.post('/indicator_period_data_framework/', {
      period: period.periodId,
      user: userRdr.id,
      value,
      text,
      status: 'A'
    })
    .then(() => {
      setUpdates([...updates.slice(0, editing), { ...updates[editing], isNew: false, status: {code: 'A'} }, ...updates.slice(editing + 1)])
      setEditing(-1)
      setSending(false)
    })
  }
  const disaggregations = [...period.disaggregationContributions, ...period.updates.reduce((acc, val) => [...acc, ...val.disaggregations], [])]
  return (
    <Panel {...props} header={<div>{moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}</div>}>
      <div className="graph">
        <div className="sticky">
          {disaggregations.length > 0 && <DsgOverview {...{values: disaggregations, targets: period.disaggregationTargets}} />}
          {disaggregations.length === 0 && <Timeline {...{ updates, period, pinned, updatesListRef, setHover }} />}
          {baseline.value &&
          <div className="baseline-values">
            <div className="baseline-value value">
              <div className="label">baseline value</div>
              <div className="value">{baseline.value}</div>
            </div>
            <div className="baseline-value year">
              <div className="label">baseline year</div>
              <div className="value">{baseline.year}</div>
            </div>
          </div>
          }
        </div>
      </div>
      <div className="updates" ref={(ref) => { updatesListRef.current = ref }}>
        <Collapse accordion activeKey={pinned} onChange={handleAccordionChange} className="updates-list">
          {updates.map((update, index) =>
            <Panel
              key={index}
              className={update.isNew && 'new-update'}
              header={
                <Aux>
                  {editing !== index && <div className={classNames('value', { hovered: hover === index || Number(pinned) === index })}>{String(update.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>}
                  <div className="label">{moment(update.createdAt).format('DD MMM YYYY')}</div>
                  <div className="label">{update.user.name}</div>
                  {update.status.code === 'A' && (
                    <div className="status approved">
                      <SVGInline svg={approvedSvg} />
                      <div className="text">
                        Approved<br />
                        {update.approvedBy && update.approvedBy.name && `by ${update.approvedBy.name}`}
                      </div>
                    </div>
                  )}
                  {(update.isNew && editing === index) && (
                    <div className="btns">
                      <Button type="primary" size="small" loading={sending} onClick={handleValueSubmit}>Submit</Button>
                      <Button type="link" size="small" onClick={cancelNewUpdate}>Cancel</Button>
                    </div>
                  )}
                </Aux>
              }
            >
              {editing !== index && ((update.comments && update.comments.length > 0) || (update.disaggregations && update.disaggregations.length > 0)) &&
                <Update {...{update, period}} />
              }
              {editing === index && (
                <Form layout="vertical">
                  <Item label="Value to add">
                    <InputNumber
                      size="large"
                      formatter={val => String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={val => val.replace(/(,*)/g, '')}
                      onChange={handleValueChange}
                      value={updates[editing].value}
                    />
                  </Item>
                  <Item label={[<span>Value comment</span>, <small>Optional</small>]}>
                    <Input.TextArea value={updates[editing].text} onChange={handleTextChange} />
                  </Item>
                </Form>
              )}
            </Panel>
          )}
        </Collapse>
        {!(updates.length > 0 && updates[updates.length - 1].isNew) && <Button type="dashed" icon="plus" block size="large" onClick={addUpdate}>Add an update</Button>}
      </div>
    </Panel>
  )
}


export default connect(
  ({ editorRdr: { section5: { isFetched, fields: {results}} }, userRdr }) => ({ results, isFetched, userRdr })
)(Results)
