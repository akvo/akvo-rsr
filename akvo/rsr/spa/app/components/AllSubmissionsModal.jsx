/* global document */
import React from 'react'
import { Modal, Row, Col } from 'antd'
import moment from 'moment'
import SVGInline from 'react-svg-inline'
import { nicenum } from '../utils/misc'
import statusPending from '../images/status-pending.svg'
import statusApproved from '../images/status-approved.svg'
import statusRevision from '../images/status-revision.svg'

export const AllSubmissionsModal = ({ visible, onCancel, period }) => {
  let width = 460
  if (period.disaggregations) {
    width += period.disaggregations.length * 100
  }
  if (width > document.body.clientWidth - 100) {
    width = document.body.clientWidth - 100
  }
  return (
    <Modal {...{ visible, onCancel, width }} title="Period latest submissions" footer={null} className="all-submissions-modal">
      <div>
        {period.updates.map(update => {
          const dsgGroups = {}
          update.disaggregations.forEach(item => {
            if (!dsgGroups[item.category]) dsgGroups[item.category] = []
            dsgGroups[item.category].push(item)
            if (period.disaggregationTargets.length > 0) {
              const target = period.disaggregationTargets.find(it => it.typeId === item.typeId)
              if (target != null) dsgGroups[item.category][dsgGroups[item.category].length - 1].targetValue = target.value
            }
          })
          const dsgKeys = Object.keys(dsgGroups)
          return (
            <Row type="flex" justify="space-between" align="middle" key={update.id}>
              <Col lg={8} md={8} sm={24} xs={24}>
                <div className="svg-text">
                  <SVGInline svg={update.status === 'A' ? statusApproved : update.status === 'P' ? statusPending : statusRevision} />
                  <div className="text">
                    {update.userDetails.firstName} {update.userDetails.lastName}
                    <span className="date">{moment(update.createdAt).format('DD MMM YYYY')}</span>
                  </div>
                </div>
              </Col>
              {dsgKeys.map(dsgKey => [
                <Col lg={12} md={12} sm={24} xs={24}>
                  <div className="dsg-group">
                    <div className="h-holder">
                      <h5>{dsgKey}</h5>
                    </div>
                    <ul>
                      {dsgGroups[dsgKey].map((dsg) => [
                        <li>
                          <div className="label">{dsg.type}</div>
                          <div>
                            <b>{nicenum(dsg.value)}</b>
                            {dsg.targetValue && <b> ({Math.round(((dsg.value / dsg.targetValue) * 100 * 10) / 10)}%)</b>}
                          </div>
                        </li>
                      ])}
                    </ul>
                  </div>
                </Col>
              ])}
              <Col lg={4} md={4} sm={24} xs={24}>
                <div className="value">{nicenum(update.value)}</div>
              </Col>
            </Row>
          )
        }
        )}
      </div>
    </Modal>
  )
}
