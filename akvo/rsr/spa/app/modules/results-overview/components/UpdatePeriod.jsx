/* eslint-disable no-shadow */
import React, { useState, useRef } from 'react'
import moment from 'moment'
import { Collapse, Row, Col, Divider } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import SimpleMarkdown from 'simple-markdown'
import Timeline from '../../results/timeline'
import Update from '../../results/update'
import DsgOverview from '../../results/dsg-overview'
import { StatusPeriod } from '../../../components/StatusPeriod'

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
  const mdParse = SimpleMarkdown.defaultBlockParse
  const mdOutput = SimpleMarkdown.defaultOutput
  return (
    <>
      {indicator?.description?.length > 0 && (
        <Row>
          <Col style={{ paddingLeft: 10, paddingRight: 10 }}>
            <details open>
              <summary>{t('Description')}</summary>
              <p>{mdOutput(mdParse(indicator?.description))}</p>
            </details>
            {updates.length > 0 && <Divider />}
          </Col>
        </Row>
      )}
      <div style={{ display: 'flex' }}>
        {targetsAt === 'period' && indicator.type === 1 &&
          <div className="graph">
            <div className="sticky">
              {disaggregations.length > 0 && <DsgOverview {...{ disaggregations, targets: period.disaggregationTargets, period, editPeriod, values: updates.map(it => ({ value: it.value, status: it.status })), updatesListRef, setHover }} />}
              {disaggregations.length === 0 && <Timeline {...{ updates, indicator, period, pinned, updatesListRef, setHover, editPeriod, targetsAt }} />}
            </div>
          </div>
        }
        <div className={classNames('updates', { qualitative: indicator.type === 2 })} ref={(ref) => { updatesListRef.current = ref }}>
          <Collapse accordion activeKey={pinned} onChange={(key) => { setPinned(key) }} className="updates-list">
            {updates.map((update, index) =>
              <Panel
                key={index}
                className={classNames({
                  'new-update': update.isNew,
                  'pending-update': update.status === 'P',
                  'draft-update': update?.id && update.status === 'D'
                })}
                header={
                  <Aux>
                    <div className="label">{moment(update.lastModifiedAt).format('DD MMM YYYY')}</div>
                    {update.statusDisplay && (
                      <div className="label">
                        {update.status === 'D' && <span>( {update.statusDisplay} )&nbsp;</span>}
                        {update.userDetails && `${update.userDetails.firstName} ${update.userDetails.lastName}`}
                      </div>
                    )}
                    <div className="value-container">
                      {indicator.type === 1 &&
                        <div className={classNames('value', { hovered: hover === updates.length - 1 - index || Number(pinned) === index })}>
                          {String(update.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          {indicator.measure === '2' && <small>%</small>}
                        </div>
                      }
                    </div>
                    <StatusPeriod {...{ update, pinned, index, t }} />
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
