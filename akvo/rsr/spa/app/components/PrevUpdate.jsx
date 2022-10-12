/* eslint-disable react/no-danger */
import React from 'react'
import ShowMoreText from 'react-show-more-text'
import moment from 'moment'
import SVGInline from 'react-svg-inline'
import { useTranslation } from 'react-i18next'
import { groupBy } from 'lodash'
import { camelReplace, nicenum } from '../utils/misc'
import statusPending from '../images/status-pending.svg'
import statusApproved from '../images/status-approved.svg'
import { measureType } from '../utils/constants'

export const PrevUpdate = ({
  period,
  indicator,
  disaggregations,
  numerator,
  denominator,
  narrative,
  createdAt,
  userDetails,
  value,
  status,
  title = 'previous value update',
}) => {
  const { t } = useTranslation()
  const dsgGroups = Array.isArray(disaggregations) ? groupBy(disaggregations, 'category') : disaggregations
  const dsgKeys = Object.keys(dsgGroups)
  return (
    <div className="prev-value-holder">
      <div className="prev-value">
        <h5>{t(title)}</h5>
        {status === 'A' && <div className="status approved"><SVGInline svg={statusApproved} /> Approved</div>}
        {status === 'R' && <div className="status returned">Returned for revision</div>}
        {status === 'P' && <div className="status pending"><SVGInline svg={statusPending} /> Pending</div>}
        {createdAt && <div className="date">{moment(createdAt).format('DD MMM YYYY')}</div>}
        {userDetails && <div className="author">{userDetails.firstName} {userDetails.lastName}</div>}
        {(indicator.type === 2 && narrative) &&
          (
            <div className="narrative">
              <ShowMoreText lines={7}>
                <div dangerouslySetInnerHTML={{ __html: narrative.replace(/\n/g, '<br />') }} />
              </ShowMoreText>
            </div>
          )
        }
        <div>
          {indicator.measure === measureType.UNIT &&
            <div>
              <div className="value">
                {nicenum(value)}
              </div>
              {
                (period.targetValue > 0 && dsgKeys.length === 0) && (
                  <div className="target-cap">
                    {(Math.round(((period.updates.reduce((acc, val) => acc + val.value, 0)) / period.targetValue) * 100 * 10) / 10)}% of target reached
                  </div>
                )
              }
              {dsgKeys.map(dsgKey => {
                const items = Array.isArray(dsgGroups[dsgKey])
                  ? dsgGroups[dsgKey]
                  : Object.values(dsgGroups)
                    ?.flatMap((v) => Object.values(v)
                      ?.map((val, vx) => ({
                        ...val,
                        type: camelReplace(Object.keys(v)[vx] || '', ' ')
                      })))
                return (
                  <div className="dsg-group">
                    <div className="h-holder">
                      <h5>{dsgKey}</h5>
                    </div>
                    <ul>
                      {items?.map((item, ix) => [
                        <li key={ix}>
                          <div className="label">{item.type}</div>
                          <div>
                            <b>{nicenum(item.value)}</b>
                            {item.targetValue && <b> ({Math.round(((item.value / item.targetValue) * 100 * 10) / 10)}%)</b>}
                          </div>
                        </li>
                      ])}
                    </ul>
                  </div>
                )
              })}
            </div>
          }
          {indicator.measure === measureType.PERCENTAGE && (
            <div className="value-holder">
              <div>
                <div className="value">
                  {(Math.round((numerator / denominator) * 100 * 10) / 10)}%
                </div>
                <div className="target-cap">
                  {(Math.round((value / period.targetValue) * 100 * 10) / 10)}% of target
                </div>
              </div>
              <div className="breakdown">
                <div className="cap">{t('Numerator')}</div>
                <b>{numerator}</b>
                <div className="cap num">{t('Denominator')}</div>
                <b>{denominator}</b>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
