import React, { useState, useEffect } from 'react'
import { Collapse, Button, Icon, Form, Divider, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import classNames from 'classnames'
import api from '../../../utils/api'
import DsgOverview from '../../results/dsg-overview'
import Timeline from '../../results/timeline'
import { DeclinedStatus } from '../../../components/DeclinedStatus'
import { PrevUpdate } from '../../../components/PrevUpdate'
import { StatusUpdate } from '../../../components/StatusUpdate'
import QuantitativeIndicator from './QuantitativeIndicator'
import QualitativeIndicator from './QualitativeIndicator'


const { Panel } = Collapse
const { Text } = Typography

const HeaderPanel = ({ period, isActive, isEditable, onEdit, t }) => (
  <>
    <Text strong>
      {moment(period.periodStart, 'DD/MM/YYYY').format('DD MMM YYYY')} - {moment(period.periodEnd, 'DD/MM/YYYY').format('DD MMM YYYY')}
    </Text>
    <div className="rightside">
      {isActive && (
        <>
          {isEditable ? <Button type="primary" onClick={() => onEdit(period.id)}>{t('Edit')}</Button> : null}
        </>
      )}
    </div>
  </>
)

const DisaggregationChart = ({ values, period, indicator, editPeriod }) => {
  const periodUpdates = [...period.updates, { ...values, status: 'D' }]
  const disaggregations = [...periodUpdates.reduce((acc, val) => [...acc, ...val.disaggregations.map(it => ({ ...it, status: val.status }))], [])]
  values = periodUpdates.map(it => ({ value: it.value, status: it.status }))
  return (
    <DsgOverview
      {...{
        period,
        values,
        disaggregations,
        targets: period.disaggregationTargets,
        editPeriod: (props) => {
          editPeriod(props, indicator)
        }
      }}
    />
  )
}

export const UpdateView = ({
  period,
  indicator,
  addUpdateToPeriod,
  patchUpdateInPeriod,
  editPeriod,
  isPreview,
  mneView,
  onEdit,
  ...props
}) => {
  const [fullPendingUpdate, setFullPendingUpdate] = useState(null)
  const [fullDraftUpdate, setFullDraftUpdate] = useState(null)

  const { t } = useTranslation()

  const draftUpdate = period.updates.find(it => it.status === 'D')
  const pendingUpdate = (period.updates[0]?.status === 'P' || (indicator.measure === '2' && period.updates[0]?.status !== 'R')/* trick % measure update to show as "pending update" */) ? period.updates[0] : null
  let recentUpdate = /* in the last 12 hours AND NOT returned for revision */ period.updates.filter(it => it.status !== 'R').find(it => { const minDiff = (new Date().getTime() - new Date(it.lastModifiedAt).getTime()) / 60000; return minDiff < 720 })
  // the above is used for the M&E view bc their value updates skip the "pending" status
  if (recentUpdate) recentUpdate = { ...recentUpdate, status: recentUpdate.status === 'A' ? 'A' : 'SR' }
  const submittedUpdate = pendingUpdate || recentUpdate
  const updateForRevision = period.updates.find(update => update.status === 'R')

  const disaggregations = []
  if (indicator) {
    indicator.dimensionNames && indicator.dimensionNames.forEach(group => {
      group.dimensionValues.forEach(dsg => {
        disaggregations.push({ category: group.name, type: dsg.value, typeId: dsg.id, groupId: group.id })
      })
    })
  }
  useEffect(() => {
    if (draftUpdate || updateForRevision) {
      const update = draftUpdate || updateForRevision
      setFullDraftUpdate(update)
      setFullPendingUpdate(null)
      api.get(`/indicator_period_data_framework/${update.id}/`).then(({ data }) => {
        setFullDraftUpdate(data)
      })
    }
    else if (submittedUpdate) {
      setFullPendingUpdate(submittedUpdate)
      api.get(`/indicator_period_data_framework/${submittedUpdate.id}/`).then(({ data }) => {
        setFullPendingUpdate(data)
      })
    } else {
      setFullPendingUpdate(null)
      setFullDraftUpdate(null)
    }
  }, [period.updates])

  let init = fullDraftUpdate || fullPendingUpdate || { value: '', disaggregations }
  init = init.hasOwnProperty('comments') ? { ...init, note: init?.comments[0]?.comment } : init

  const updateLabel = draftUpdate || recentUpdate || pendingUpdate
  const updateClass = updateLabel?.statusDisplay?.toLowerCase()?.replace(/\s+/g, '-')
  const disableInputs = ((submittedUpdate && !draftUpdate) || isPreview)

  const dsgGroups = {}
  init?.disaggregations?.forEach(item => {
    if (!dsgGroups[item.category]) dsgGroups[item.category] = { value: 0, numerator: 0, denominator: 0 }
    if (item.value) dsgGroups[item.category].value += item.value
    if (item.numerator) dsgGroups[item.category].numerator += item.numerator
    if (item.denominator) dsgGroups[item.category].denominator += item.denominator
  })
  const categories = Object.keys(dsgGroups)
  let amountValue = null
  if (categories.length > 0 && indicator.measure === '1') {
    amountValue = categories.reduce((acc, key) => dsgGroups[key].value > acc ? dsgGroups[key].value : acc, 0)
  }
  return (
    <Panel
      {...props}
      header={<HeaderPanel isActive={props?.isActive} isEditable={!disableInputs} {...{ t, period, onEdit }} />}
      className={updateClass}
    >
      <div className="add-update">
        <header>
          {
            indicator.type === 2
              ? <b>{t('Qualitative')}</b>
              : indicator.ascending ? <><Icon type="rise" /> <b>{t('Ascending')}</b></> : <><Icon type="fall" /> <b>{t('Descending')}</b></>
          }
        </header>
        <StatusUpdate {...updateLabel} />
        {(updateForRevision && !updateLabel) && <DeclinedStatus update={updateForRevision} />}
        <Form layout="vertical">
          <div
            className={classNames('inputs-container', {
              qualitative: indicator.type === 2,
              'no-prev': period.updates.filter(it => it.status === 'A').length === 0
            })}
          >
            <div className="inputs">
              {
                indicator.dimensionNames.map(group =>
                  <div className="dsg-group" key={group.name}>
                    <div className="h-holder">
                      <h5>{group.name}</h5>
                    </div>
                    {
                      group.dimensionValues.map(dsg => {
                        const findDsg = updateLabel?.disaggregations?.find((dg) => dg?.typeId === dsg.id)
                        return indicator.measure === '1'
                          ? (
                            <Form.Item label={dsg?.value} style={{ paddingLeft: '1em' }} key={dsg.id}>
                              <Text strong>{findDsg?.value || '-'}</Text>
                            </Form.Item>
                          )
                          : (
                            <div key={dsg.id}>
                              <div style={{ paddingLeft: '1em' }}>{dsg.value}</div>
                              <Form.Item label="Enumerator">
                                <Text strong>{findDsg?.numerator || '-'}</Text>
                              </Form.Item>
                              <Form.Item label="Denominator">
                                <Text strong>{findDsg?.denominator || '-'}</Text>
                              </Form.Item>
                            </div>
                          )
                      })
                    }
                  </div>
                )
              }
              {indicator.type === 1 && (
                <QuantitativeIndicator
                  {...{
                    amountValue,
                    indicator,
                    period,
                    numerator: init?.numerator,
                    denominator: init?.denominator
                  }}
                />
              )}
              {indicator.type === 2 && (
                <QualitativeIndicator
                  {...{
                    scores: indicator?.scores,
                    narrative: init?.narrative
                  }}
                />
              )}
            </div>

            {!mneView && !(indicator.measure === '2' && period?.updates?.length > 0) &&
              <PrevUpdate update={period.updates.filter(it => it.status === 'A' || it.status === 'R')[0]} {...{ period, indicator }} />
            }
            {(mneView && indicator.type === 1) && (
              <>
                {
                  disaggregations.length
                    ? <DisaggregationChart {...{ period, indicator, editPeriod, values: init }} />
                    : (
                      <div className="timeline-outer">
                        <Timeline
                          {...{
                            period,
                            indicator,
                            editPeriod,
                            updates: [
                              ...period.updates,
                              !submittedUpdate ? { ...init, status: 'D' } : null
                            ].filter(it => (it))
                          }}
                        />
                      </div>
                    )
                }
              </>
            )}

          </div>
        </Form>
        <Divider />
        <div className="notes">
          <Form layout="vertical">
            {indicator.type === 1 &&
              <Form.Item label={t('Value comment')}>
                <Text>{init?.text || '-'}</Text>
              </Form.Item>
            }
            <Form.Item label={t('Internal private note')}>
              <Text>{init?.note || '-'}</Text>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Panel>
  )
}
