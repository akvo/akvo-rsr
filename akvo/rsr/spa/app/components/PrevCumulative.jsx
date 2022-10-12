import React from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

const PrevCumulative = ({
  value,
  numerator,
  denominator,
  disaggregations,
  measure,
  targetValue,
  updates,
  userRdr,
}) => {
  const { t } = useTranslation()
  const lastUpdate = updates?.filter((u) => u?.userDetails?.id === userRdr?.id)?.shift()
  return (
    <div className="prev-value-holder">
      <div className="prev-value">
        <h5>{t('previous cumulative update value')}</h5>
        <div className="date">{moment(lastUpdate?.createdAt).format('DD MMM YYYY')}</div>
        <div>
          <div className="value">
            {value}
          </div>
        </div>
        {measure === '2' && (
          <div className="value-holder">
            <div>
              <div className="value">
                {(Math.round((numerator / denominator) * 100 * 10) / 10)}%
              </div>
              <div className="target-cap">{(Math.round((value / targetValue) * 100 * 10) / 10)}% of target</div>
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
  )
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(PrevCumulative)
