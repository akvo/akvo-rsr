import React from 'react'
import { Button, Col, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import classNames from 'classnames'
import SVGInline from 'react-svg-inline'

import { StatusPeriod } from '../../../components/StatusPeriod'
import editButton from '../../../images/edit-button.svg'
import { setNumberFormat } from '../../../utils/misc'

const UpdateHeader = ({
  isPeriod,
  update,
  indicator,
  pinned,
  index,
  hover,
  role,
  updateLength,
  handleOnEdit
}) => {
  const { t } = useTranslation()
  const createdAt = isPeriod ? 4 : 2
  const value = isPeriod ? 8 : 10
  const status = isPeriod ? 6 : 3
  const xlColumns = {
    createdAt,
    author: 4,
    value,
    status,
    action: 2
  }
  return (
    <Row type="flex" justify="space-between" align="middle" className="w-full">
      <Col xs={12} md={4} lg={4} xl={xlColumns.createdAt}>
        <div className="label">
          <p>
            <small>created at</small><br />
            <strong>{moment(update.createdAt).format('DD MMM YYYY')}</strong>
          </p>
        </div>
      </Col>
      <Col xs={12} md={4} lg={5} xl={xlColumns.author}>
        <div className="label author">
          {update.userDetails && `${update.userDetails.firstName} ${update.userDetails.lastName}`}
        </div>
      </Col>
      {indicator.type === 1 &&
        (
          <Col xs={12} md={6} lg={7} xl={xlColumns.value}>
            <div className="value-container">
              <div className={classNames('value', { hovered: hover === updateLength - 1 - index || Number(pinned) === index })}>
                {setNumberFormat(update.value)}
                {indicator.measure === '2' && <small>%</small>}
              </div>
            </div>
          </Col>
        )
      }
      <Col xs={12} md={5} lg={5} xl={xlColumns.status}>
        <StatusPeriod {...{ update, pinned, index, t }} />
      </Col>
      {['m&e', 'admin'].includes(role) && (
        <Col xs={24} md={2} lg={2} xl={xlColumns.action} className="text-right">
          <Button type="link" onClick={() => handleOnEdit(update)}>
            <SVGInline svg={editButton} className="edit-button" />
          </Button>
        </Col>
      )}
    </Row>
  )
}

export default UpdateHeader
