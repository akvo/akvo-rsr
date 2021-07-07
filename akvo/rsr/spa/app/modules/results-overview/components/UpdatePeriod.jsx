/* eslint-disable no-shadow */
import React, { useState, useRef } from 'react'
import moment from 'moment'
import { Collapse } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import Timeline from '../../results/timeline'
import Update from '../../results/update'
import DsgOverview from '../../results/dsg-overview'

const { Panel } = Collapse
const Aux = node => node.children

export const UpdatePeriod = ({
  period,
  indicator,
  updates,
  baseline,
  targetsAt,
  editPeriod
}) => {
  const [hover, setHover] = useState(null)
  const [pinned, setPinned] = useState('0')
  const { t } = useTranslation()
  const updatesListRef = useRef()
  const disaggregations = [...updates.reduce((acc, val) => [...acc, ...val.disaggregations.map(it => ({ ...it, status: val.status }))], [])]
  return (
    <>
      <div style={{ display: 'flex' }}>
        {targetsAt === 'period' && indicator.type === 1 &&
          <div className="graph">
            <div className="sticky">
              {disaggregations.length > 0 && <DsgOverview {...{ disaggregations, targets: period.disaggregationTargets, period, editPeriod, values: updates.map(it => ({ value: it.value, status: it.status })), updatesListRef, setHover }} />}
              {disaggregations.length === 0 && <Timeline {...{ updates, indicator, period, pinned, updatesListRef, setHover, editPeriod, targetsAt }} />}
              {baseline.value &&
                <div className="baseline-values">
                  <div className="baseline-value value">
                    <div className="label">{t('baseline value')}</div>
                    <div className="value">{baseline.value}{indicator.measure === '2' && <small>%</small>}</div>
                  </div>
                  <div className="baseline-value year">
                    <div className="label">{t('baseline year')}</div>
                    <div className="value">{baseline.year}</div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
        <div className={classNames('updates', { qualitative: indicator.type === 2 })} ref={(ref) => { updatesListRef.current = ref }}>
          <Collapse accordion activeKey={pinned} onChange={(key) => { setPinned(key) }} className="updates-list">
            {updates.map((update, index) =>
              <Panel
                key={index}
                className={classNames({ 'new-update': update.isNew, 'pending-update': update.status === 'P' })}
                header={
                  <Aux>
                    <div className="value-container">
                      {indicator.type === 1 &&
                        <div className={classNames('value', { hovered: hover === updates.length - 1 - index || Number(pinned) === index })}>{String(update.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{indicator.measure === '2' && <small>%</small>}</div>}
                    </div>
                    <div className="label">{moment(update.createdAt).format('DD MMM YYYY')}</div>
                    <div className="label">{update.userDetails && `${update.userDetails.firstName} ${update.userDetails.lastName}`}</div>
                  </Aux>
                }
              >
                <Update {...{ update, period, indicator }} />
              </Panel>
            )}
          </Collapse>
        </div>
      </div>
    </>
  )
}
