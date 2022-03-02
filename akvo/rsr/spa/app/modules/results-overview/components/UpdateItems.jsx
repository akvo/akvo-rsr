import React, { useState, useRef } from 'react'
import moment from 'moment'
import { Button, Card, Collapse, Row, Col } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import SVGInline from 'react-svg-inline'

import Timeline from '../../results/timeline'
import Update from '../../results/update'
import DsgOverview from '../../results/dsg-overview'
import { StatusPeriod } from '../../../components/StatusPeriod'
import editButton from '../../../images/edit-button.svg'
import ProgressBar from '../../../components/ProgressBar'
import LineChart from '../../../components/LineChart'

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
  const [fullUpdates, setFullUpdates] = useState(updates)

  const handleOnEdit = (update) => {
    const fullUpdate = fullUpdates?.find((u) => u?.id === update.id)
    let dsgItems = []
    if (indicator?.dimensionNames?.length) {
      dsgItems = indicator
        ?.dimensionNames
        ?.map(dn => {
          return dn?.dimensionValues?.map(dv => {
            const findValue = fullUpdate?.disaggregations?.find((du) => (du?.categoryId === dn.id && du?.typeId === dv.id))
            return ({
              ...findValue,
              category: dn.name,
              dimensionName: dn.id,
              dimension_value: dv.id,
              id: findValue?.id || `new-${dv.id}`,
              update: fullUpdate?.id || `new-${dn.id}`,
              value: (findValue?.value === undefined || findValue?.value === null) ? null : findValue?.value
            })
          })
        })
        ?.flatMap((dn) => dn)
    }
    setEditing({
      ...update,
      ...fullUpdate,
      note: update?.comments[0]?.comment || '',
      disaggregations: dsgItems
    })
  }

  const updatesListRef = useRef()
  return (
    <Row type="flex" align="top">
      <Col lg={8} xs={24}>
        {targetsAt === 'period' && indicator.type === 1 &&
          (
            <Card bordered={false} className="periodCard">
              <Card.Grid hoverable={false} style={{ width: '100%' }}>
                <ProgressBar period={period} values={period.updates} />
              </Card.Grid>
              <Card.Grid hoverable={false} style={{ width: '100%' }}>
                <LineChart />
              </Card.Grid>
            </Card>
          )
        }
      </Col>
      <Col lg={16} xs={24}>
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
                        onClick={() => handleOnEdit(update)}
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
                    fullUpdates,
                    setFullUpdates
                  }}
                />
              </Panel>
            )}
          </Collapse>
        </div>
      </Col>
    </Row>
  )
}

export default UpdateItems
