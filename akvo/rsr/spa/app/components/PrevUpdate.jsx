/* eslint-disable react/no-danger */
import React, { useState } from 'react'
import { Button } from 'antd'
import ShowMoreText from 'react-show-more-text'
import moment from 'moment'
import SVGInline from 'react-svg-inline'
import { useTranslation } from 'react-i18next'
import { nicenum } from '../utils/misc'
import statusPending from '../images/status-pending.svg'
import statusApproved from '../images/status-approved.svg'
import { AllSubmissionsModal } from './AllSubmissionsModal'

export const PrevUpdate = ({ update, period, indicator }) => {
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)

  const { t } = useTranslation()
  if (!update) return null
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
    <div className="prev-value-holder">
      <div className="prev-value">
        <h5>{t('previous value update')}</h5>
        {update.status === 'A' && <div className="status approved"><SVGInline svg={statusApproved} /> Approved</div>}
        {update.status === 'R' && <div className="status returned">Returned for revision</div>}
        {update.status === 'P' && <div className="status pending"><SVGInline svg={statusPending} /> Pending</div>}
        <div className="date">{moment(update.createdAt).format('DD MMM YYYY')}</div>
        <div className="author">{update.userDetails.firstName} {update.userDetails.lastName}</div>
        {indicator.type === 2 ? [
          <div className="narrative">
            <ShowMoreText lines={7}>
              <p dangerouslySetInnerHTML={{ __html: update.narrative.replace(/\n/g, '<br />') }} />
            </ShowMoreText>
          </div>
        ] : [
          <div>
            {indicator.measure === '1' &&
              <div>
                <div className="value">
                  {nicenum(update.value)}
                </div>
                {(period.targetValue && dsgKeys.length === 0) ? [
                  <div className="target-cap">{(Math.round(((period.updates.reduce((acc, val) => acc + val.value, 0)) / period.targetValue) * 100 * 10) / 10)}% of target reached</div>
                ] : null}
                {dsgKeys.map(dsgKey => [
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
                ])}
              </div>
            }
            {indicator.measure === '2' &&
              [
                <div className="value-holder">
                  <div>
                    <div className="value">
                      {(Math.round((update.numerator / update.denominator) * 100 * 10) / 10)}%
                    </div>
                    <div className="target-cap">{(Math.round((update.value / period.targetValue) * 100 * 10) / 10)}% of target</div>
                  </div>
                  <div className="breakdown">
                    <div className="cap">{t('Numerator')}</div>
                    <b>{update.numerator}</b>
                    <div className="cap num">{t('Denominator')}</div>
                    <b>{update.denominator}</b>
                  </div>
                </div>,
              ]
            }
          </div>
        ]}
      </div>
      {period.updates.length > 1 &&
        <div className="all-submissions-btn-container">
          <Button type="link" onClick={() => setShowSubmissionsModal(true)}>{t('See all submissions')}</Button>
        </div>
      }
      <AllSubmissionsModal period={period} visible={showSubmissionsModal} onCancel={() => setShowSubmissionsModal(false)} />
    </div>
  )
}
