import React, { useState, useRef } from 'react'
import moment from 'moment'
import { Button, Collapse } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import SVGInline from 'react-svg-inline'

import Timeline from '../../results/timeline'
import Update from '../../results/update'
import DsgOverview from '../../results/dsg-overview'
import { StatusPeriod } from '../../../components/StatusPeriod'
import editButton from '../../../images/edit-button.svg'

const { Panel } = Collapse
const Aux = node => node.children

const UpdateItems = ({
  role,
  period,
  indicator,
  updates,
  targetsAt,
  editPeriod,
  disaggregations,
  setEditing
}) => {
  const { t } = useTranslation()
  const [hover, setHover] = useState(null)
  const [pinned, setPinned] = useState('0')
  const [fullUpdate, setFullUpdate] = useState(null)

  const updatesListRef = useRef()
  return (
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
                  <div className="label">
                    {update.userDetails && `${update.userDetails.firstName} ${update.userDetails.lastName}`}
                  </div>
                  <div className="value-container">
                    {indicator.type === 1 &&
                      <div className={classNames('value', { hovered: hover === updates.length - 1 - index || Number(pinned) === index })}>
                        {String(update.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        {indicator.measure === '2' && <small>%</small>}
                      </div>
                    }
                  </div>
                  <StatusPeriod {...{ update, pinned, index, t }} />
                  {['m&e', 'admin'].includes(role) && (
                    <Button
                      type="link"
                      onClick={() => {
                        setEditing({
                          ...update,
                          ...fullUpdate,
                          note: update?.comments[0]?.comment || ''
                        })
                      }}
                    >
                      <SVGInline svg={editButton} className="edit-button" />
                    </Button>
                  )}
                </Aux>
              }
            >
              <Update
                {...{
                  update,
                  period,
                  indicator,
                  setFullUpdate
                }}
              />
            </Panel>
          )}
        </Collapse>
      </div>
    </div>
  )
}

export default UpdateItems
