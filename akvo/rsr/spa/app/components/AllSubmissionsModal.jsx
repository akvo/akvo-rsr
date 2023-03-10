import React from 'react'
import { Modal, Row, Col, Tag, Badge } from 'antd'
import moment from 'moment'
import SVGInline from 'react-svg-inline'
import { groupBy, isEmpty } from 'lodash'
import classNames from 'classnames'
import { nicenum } from '../utils/misc'
import statusPending from '../images/status-pending.svg'
import statusApproved from '../images/status-approved.svg'
import statusRevision from '../images/status-revision.svg'

const StatusIcon = ({ status }) => {
  if (status === 'A') {
    return <SVGInline svg={statusApproved} />
  }
  if (['D', 'P'].includes(status)) {
    return <SVGInline svg={statusPending} />
  }
  if (status === 'R') {
    return <SVGInline svg={statusRevision} />
  }
  return null
}

export const AllSubmissionsModal = ({
  visible,
  onCancel,
  updates,
  width = 520,
  activeKeys = [],
  dsgOnly = false,
}) => {
  const _updates = updates?.filter((u) => (
    (dsgOnly && u?.disaggregations?.length) ||
    (!dsgOnly)
  ))
  return (
    <Modal {...{ visible, onCancel, width }} title="Period latest submissions" footer={null} className="all-submissions-modal">
      <div>
        {_updates?.map(update => {
          const _disaggregations = update?.disaggregations?.filter((dg) => activeKeys?.includes(dg?.type))
          const dsgGroups = groupBy(_disaggregations, 'category')
          const userName = (
            isEmpty(update?.userDetails?.firstName) &&
            isEmpty(update?.userDetails?.lastName)
          )
            ? update?.userDetails?.email
            : `${update.userDetails.firstName} ${update.userDetails.lastName}`
          return (
            <Row type="flex" justify="space-between" align="middle" key={update.id}>
              <Col xs={24}>
                <div className="svg-text">
                  <StatusIcon status={update?.status} />
                  <div className="text">
                    {userName}
                    <span className="date">{moment(update.createdAt).format('DD MMM YYYY')}</span>
                  </div>
                </div>
              </Col>
              <Col xs={24} className="dsg-tags">
                {
                  Object.keys(dsgGroups).map((dsgKey, dx) => (
                    <div key={dx}>
                      <h6>{dsgKey}</h6>
                      {dsgGroups[dsgKey]?.map((dsg, ix) => (
                        <Tag key={ix}>
                          <div>
                            {dsg?.type}
                          </div>
                          <div>
                            <Badge count={dsg?.value} className={classNames('badge', { [update?.status]: true })} showZero />
                          </div>
                        </Tag>
                      ))}
                    </div>
                  ))
                }
              </Col>
              <Col xs={24}>
                <h6>Value</h6>
                <div className={classNames('value', { [update?.status]: true })}>{nicenum(update.value)}</div>
              </Col>
            </Row>
          )
        }
        )}
      </div>
    </Modal>
  )
}
