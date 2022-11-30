import React from 'react'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import { connect } from 'react-redux'
import {
  Typography,
  Divider,
  Row,
  Col,
  Collapse,
} from 'antd'
import { useTranslation } from 'react-i18next'

import './UpdatesHint.scss'

import ExpandIcon from './ExpandIcon'
import { getPercentage, setNumberFormat } from '../utils/misc'
import { measureType } from '../utils/constants'


const { Text } = Typography
const { Panel } = Collapse

const UserUpdates = ({
  period,
  indicator,
  disaggregations,
  numerator,
  denominator,
  value,
  createdAt,
  userDetails,
}) => {
  const { t } = useTranslation()
  const dsgGroups = Array.isArray(disaggregations) ? groupBy(disaggregations, 'category') : disaggregations
  const dsgKeys = Object.keys(dsgGroups)
  const totalValue = period.updates.reduce((acc, val) => acc + val.value, 0)
  const targetReached = getPercentage(totalValue, period.targetValue)
  return (
    <Row type="flex" justify="space-between" align="bottom">
      <Col lg={12} md={12} sm={24} xs={24}>
        {userDetails && <Text strong>{userDetails.firstName} {userDetails.lastName}</Text>}
        {createdAt && (
          <>
            <br />
            <Text type="secondary" className="date">
              {moment(createdAt).format('DD MMM YYYY')}
            </Text>
          </>
        )}
      </Col>
      <Col lg={12} md={12} sm={24} xs={24} className="text-right">
        {indicator.measure === measureType.PERCENTAGE && (
          <div className="value-holder">
            <div>
              <div className="value">
                {getPercentage(numerator, denominator)}%
              </div>
              <div className="target-cap">
                {getPercentage(value, period.targetValue)}% of target
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
        {indicator.measure === measureType.UNIT &&
          <div>
            <Text className="update-value">
              {setNumberFormat(value)}
            </Text>
            {
              (period.targetValue > 0 && dsgKeys.length === 0) && (
                <div className="target-cap">
                  {targetReached}% of target reached
                </div>
              )
            }
          </div>
        }
      </Col>
    </Row>
  )
}

const HintTitle = ({ title, value }) => (
  <div className="header-container">
    <Text className="title">
      {title}
    </Text>
    <span className="title-value">
      ({setNumberFormat(value)})
    </span>
  </div>
)

const UpdatesHeader = ({
  cumulativeUpdate,
  lastUpdate
}) => {
  return (
    <Row>
      {
        cumulativeUpdate?.value
          ? (
            <>
              <Col lg={11}>
                <HintTitle title="All previous update" value={lastUpdate.value} />
              </Col>
              <Col lg={1}>
                <Divider type="vertical" />
              </Col>
              <Col lg={12}>
                <HintTitle title="My previous update" value={cumulativeUpdate.value} />
              </Col>
            </>
          )
          : (
            <Col>
              <HintTitle title="All previous update" value={lastUpdate.value} />
            </Col>
          )
      }
    </Row>
  )
}

const UpdatesHint = ({
  cumulativeUpdate,
  lastUpdate,
  indicator,
  period,
  userRdr
}) => {
  cumulativeUpdate = {
    ...cumulativeUpdate,
    createdAt: lastUpdate?.createdAt,
    userDetails: userRdr,
    indicator,
    period,
  }
  lastUpdate = {
    ...lastUpdate,
    indicator,
    period,
  }
  return (
    <div id="rsr-updates-hint">
      <Collapse
        bordered={false}
        expandIconPosition="right"
        expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} open="shrink" close="arrows-alt" />}
      >
        <Panel
          key="updates-hint"
          header={<UpdatesHeader {...{ cumulativeUpdate, lastUpdate }} />}
        >
          <Row>
            {
              cumulativeUpdate?.value
                ? (
                  <>
                    <Col lg={11}>
                      <UserUpdates {...lastUpdate} />
                    </Col>
                    <Col lg={11} offset={1}>
                      <UserUpdates {...cumulativeUpdate} />
                    </Col>
                  </>
                )
                : (
                  <Col>
                    <UserUpdates {...lastUpdate} />
                  </Col>
                )
            }
          </Row>
        </Panel>
      </Collapse>
    </div>
  )
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(UpdatesHint)
