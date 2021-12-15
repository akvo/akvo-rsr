import React from 'react'
import { Icon, Form, Divider, Typography, List, Avatar } from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import DsgOverview from '../../results/dsg-overview'
import Timeline from '../../results/timeline'
import { DeclinedStatus } from '../../../components/DeclinedStatus'
import { PrevUpdate } from '../../../components/PrevUpdate'
import { StatusUpdate } from '../../../components/StatusUpdate'
import QuantitativeIndicator from './QuantitativeIndicator'
import QualitativeIndicator from './QualitativeIndicator'

const { Text } = Typography

const DisaggregationChart = ({ values, period, indicator, editPeriod }) => {
  const periodUpdates = [...period.updates, { ...values, status: 'D' }]
  const disaggregations = [...periodUpdates.reduce((acc, val) => [...acc, ...val.disaggregations.map(it => ({ ...it, status: val.status }))], [])]
  values = periodUpdates.map(it => ({ value: it.value, status: it.status }))
  return (
    <DsgOverview
      {...{
        period,
        values,
        disaggregations,
        targets: period.disaggregationTargets,
        editPeriod: (props) => {
          editPeriod(props, indicator)
        }
      }}
    />
  )
}

const ReportedView = ({
  init,
  period,
  indicator,
  updateLabel,
  disaggregations,
  submittedUpdate,
  updateForRevision,
  amountValue,
  editPeriod,
  mneView
}) => {
  const { t } = useTranslation()
  return (
    <div className="add-update">
      <header>
        {
          indicator.type === 2
            ? <b>{t('Qualitative')}</b>
            : indicator.ascending ? <><Icon type="rise" /> <b>{t('Ascending')}</b></> : <><Icon type="fall" /> <b>{t('Descending')}</b></>
        }
      </header>
      <StatusUpdate {...updateLabel} />
      {(updateForRevision && !updateLabel) && <DeclinedStatus update={updateForRevision} />}
      <Form layout="vertical">
        <div
          className={classNames('inputs-container', {
            qualitative: indicator.type === 2,
            'no-prev': period.updates.filter(it => it.status === 'A').length === 0
          })}
        >
          <div className="inputs">
            {
              indicator.dimensionNames.map(group =>
                <div className="dsg-group" key={group.name}>
                  <div className="h-holder">
                    <h5>{group.name}</h5>
                  </div>
                  {
                    group.dimensionValues.map(dsg => {
                      const findDsg = init?.disaggregations?.find((dg) => dg?.typeId === dsg.id)
                      return indicator.measure === '1'
                        ? (
                          <Form.Item label={dsg?.value} style={{ paddingLeft: '1em' }} key={dsg.id}>
                            <Text strong>{findDsg?.value || '-'}</Text>
                          </Form.Item>
                        )
                        : (
                          <div key={dsg.id}>
                            <div style={{ paddingLeft: '1em' }}>{dsg.value}</div>
                            <Form.Item label="Enumerator">
                              <Text strong>{findDsg?.numerator || '-'}</Text>
                            </Form.Item>
                            <Form.Item label="Denominator">
                              <Text strong>{findDsg?.denominator || '-'}</Text>
                            </Form.Item>
                          </div>
                        )
                    })
                  }
                </div>
              )
            }
            {indicator.type === 1 && (
              <QuantitativeIndicator
                {...{
                  amountValue,
                  indicator,
                  period,
                  numerator: init?.numerator,
                  denominator: init?.denominator
                }}
              />
            )}
            {indicator.type === 2 && (
              <QualitativeIndicator
                {...{
                  scores: indicator?.scores,
                  narrative: init?.narrative,
                  scoreIndices: init?.scoreIndices
                }}
              />
            )}
          </div>

          {!mneView && !(indicator.measure === '2' && period?.updates?.length > 0) &&
            <PrevUpdate update={period.updates.filter(it => it.status === 'A' || it.status === 'R')[0]} {...{ period, indicator }} />
          }
          {(mneView && indicator.type === 1) && (
            <>
              {
                disaggregations.length
                  ? <DisaggregationChart {...{ period, indicator, editPeriod, values: init }} />
                  : (
                    <div className="timeline-outer">
                      <Timeline
                        {...{
                          period,
                          indicator,
                          editPeriod,
                          updates: [
                            ...period.updates,
                            !submittedUpdate ? { ...init, status: 'D' } : null
                          ].filter(it => (it))
                        }}
                      />
                    </div>
                  )
              }
            </>
          )}
        </div>
      </Form>
      <Divider />
      <div className="notes">
        <Form layout="vertical">
          {indicator.type === 1 &&
            <Form.Item label={t('Value comment')}>
              <Text>{init?.text || '-'}</Text>
            </Form.Item>
          }
          <Form.Item label={t('Internal private note')}>
            <Text>{init?.note || '-'}</Text>
          </Form.Item>
        </Form>
      </div>
      {(init?.fileSet?.length > 0) && (
        <List
          bordered
          size="small"
          style={{ width: '100%' }}
          dataSource={init?.fileSet}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar type="paper-clip" />}
                title={item?.file.split('/')?.filter((val, index, arr) => index === arr.length - 1)[0]}
              />
              <a href={item?.file} target="_blank" rel="noopener noreferrer">
                <Icon type="eye" />
              </a>
            </List.Item>
          )}
        />
      )}
    </div>
  )
}

export default ReportedView
