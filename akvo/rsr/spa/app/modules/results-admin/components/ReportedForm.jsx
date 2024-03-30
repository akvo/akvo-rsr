import React, { useState, useEffect } from 'react'
import { Field, FormSpy } from 'react-final-form'
import { Icon, Form, Divider, Upload, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import SimpleMarkdown from 'simple-markdown'
import moment from 'moment'
import {
  groupBy,
  orderBy,
} from 'lodash'

import DsgOverview from '../../results/dsg-overview'
import {
  DeclinedStatus,
  StatusUpdate,
} from '../../../components'
import api from '../../../utils/api'
import FinalField from '../../../utils/final-field'
import RTE from '../../../utils/rte'
import ScoringField from '../../../components/ScoringField'
import LineChart from '../../../components/LineChart'
import UpdatesHint from '../../../components/UpdatesHint'
import {
  getMaxDisaggregation,
  getSumValues,
  getPercentage,
  setNumberFormat,
} from '../../../utils/misc'
import { isNSOProject } from '../../../utils/feat-flags'
import { indicatorType, measureType } from '../../../utils/constants'
import DisaggregationsInput from './DisaggregationsInput'
import UpdatesHistory from '../../../components/UpdatesHistory'

const { Text } = Typography

const ReportedForm = ({
  init,
  form,
  errors,
  project,
  period,
  indicator,
  disaggregations,
  disableInputs,
  editPeriod,
  setFileSet,
  mneView,
  fileSet,
  deleteFile,
  jwtView = false,
}) => {
  const [cumulativeUpdate, setCumulativeUpdate] = useState(null)
  const { t } = useTranslation()
  useEffect(() => {
    if (!jwtView) {
      api
        .get(`/project/${project?.id}/indicator/${indicator?.id}/previous_cumulative_update?format=json`)
        .then(({ data }) => setCumulativeUpdate(data))
    }
  }, [])
  const lastUpdate = period
    ?.updates
    ?.filter(it => it.status === 'A' || it.status === 'R')
    ?.slice(0, 1)
    ?.pop()
  const updatesHintProps = {
    cumulativeUpdate,
    lastUpdate,
    indicator,
    period,
  }
  const disaggregationsProps = {
    ...indicator,
    disaggregations,
    disableInputs,
    period,
    mneView,
  }
  return (
    <div className="add-update">
      {(lastUpdate?.id && indicator?.type === indicatorType.QUANTITATIVE) && <UpdatesHint {...updatesHintProps} />}
      <StatusUpdate {...init} />
      {(init?.status === 'R') && <DeclinedStatus update={init} />}
      <Form aria-orientation="vertical">
        <div className={classNames('inputs-container', { qualitative: indicator.type === 2, 'no-prev': period?.updates?.filter(it => it.status === 'A').length === 0 })}>
          <div className={classNames('inputs', { mneView })}>
            {mneView && indicator.type === 1 && <h4>Add a value update</h4>}
            {(typeof errors === 'object' && errors?.length > 0) && <>{errors?.map((err, ex) => <Text type="danger" key={ex}>{err}</Text>)}</>}
            {((typeof errors === 'string') && errors?.match(new RegExp('multiple|updates|percentages', 'g'))?.length > 0) && (
              <Text type="danger">{t('Value already reported')}</Text>
            )}
            <DisaggregationsInput {...disaggregationsProps} />
            {indicator.type === 1 ?
              (
                <>
                  {init?.disaggregations?.length > 0 && (
                    <Field
                      name="disaggregations"
                      render={({ input }) => {
                        if (isNSOProject(project)) {
                          return null
                        }
                        const _dsgGrouped = groupBy(input?.value, 'category')
                        const _dsgValues = Object
                          .values(_dsgGrouped)
                          ?.map((values) => values?.map((v) => ({ ...v, numerator: v?.numerator || null, denominator: v?.denominator || null })))
                          ?.map((values) => ({
                            value: getSumValues(values, 'value'),
                            numerator: getSumValues(values, 'numerator'),
                            denominator: getSumValues(values, 'denominator'),
                          }))
                        const dsgGroups = Object
                          .keys(_dsgGrouped)
                          ?.reduce((obj, key, index) => ({
                            ...obj,
                            [key]: _dsgValues[index]
                          }), {})
                        const categories = Object.keys(dsgGroups)

                        if (categories.length > 0 && indicator.measure === measureType.UNIT) {
                          const value = getMaxDisaggregation(_dsgValues, 'value')
                          if (!Number.isNaN(value)) {
                            form.change('value', value)
                          }
                        }
                        if (categories.length > 0 && indicator.measure === measureType.PERCENTAGE) {
                          const numerator = getMaxDisaggregation(_dsgValues, 'numerator')
                          const denominator = getMaxDisaggregation(_dsgValues, 'denominator')
                          form.change('numerator', numerator)
                          form.change('denominator', denominator)
                        }
                        return null
                      }}
                    />
                  )}
                  {(indicator.measure === measureType.UNIT) && (
                    <>
                      <FinalField
                        withLabel
                        dict={{ label: period?.disaggregationTargets.length > 0 ? t('Total value') : t('Value') }}
                        name="value"
                        control="input-number"
                        step={1}
                        disabled={disableInputs}
                      />
                      <UpdatesHistory {...period} mneView={mneView} />
                      {(period.updates.length > 0) && (
                        <div className="updated-actual">
                          <div className="cap">{t('Updated actual value')}</div>
                          <Field
                            name="value"
                            render={({ input }) => {
                              const updatedTotal = disableInputs ? 0 : input.value
                              return (
                                <div className="value">
                                  <b>{setNumberFormat(updatedTotal)}</b>
                                  {period.targetValue > 0 && <small>{getPercentage(updatedTotal, period.targetValue)}% of target</small>}
                                </div>
                              )
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                  {(indicator.measure === measureType.PERCENTAGE) && (
                    <div className="percentage-indicator">
                      <div>
                        <FinalField
                          withLabel
                          dict={{ label: 'Numerator' }}
                          name="numerator"
                          control="input-number"
                          min={-Infinity}
                          step={1}
                          disabled={disableInputs}
                        />
                        <FinalField
                          withLabel
                          dict={{ label: 'Denominator' }}
                          name="denominator"
                          control="input-number"
                          step={1}
                          min={-Infinity}
                          disabled={disableInputs}
                        />
                      </div>
                      <div className="perc">
                        <FormSpy subscription={{ values: true }}>
                          {({ values }) => {
                            if (values.numerator !== '' && values.numerator != null && values.denominator) {
                              const value = getPercentage(values.numerator, values.denominator)
                              if (value !== values.value) {
                                form.change('value', value)
                              }
                              return `${value}%`
                            }
                            return null
                          }}
                        </FormSpy>
                      </div>
                    </div>
                  )}
                </>
              )
              : [ // qualitative indicator
                indicator.scores?.length > 0 && (
                  <Field
                    name="scoreIndices"
                    render={({ input }) => <ScoringField scores={indicator.scores} disabled={disableInputs} id={init?.id} {...input} />}
                  />
                ),
                <h5>{t('New update')}</h5>,
                <Field
                  name="narrative"
                  render={({ input }) => {
                    if (disableInputs) {
                      const parse = SimpleMarkdown.defaultBlockParse
                      const mdOutput = SimpleMarkdown.defaultReactOutput
                      return <div className="md-output">{mdOutput(parse(input.value))}</div>
                    }
                    return [
                      <RTE {...input} />
                    ]
                  }}
                />
              ]}
          </div>
          {(mneView && indicator.type === 1) && (
            disaggregations.length > 0 ?
              (
                <FormSpy subscription={{ values: true }}>
                  {({ values }) => {
                    const periodUpdates = [...period.updates, { ...values, status: 'D' }]
                    const dgs = [...periodUpdates.reduce((acc, val) => [...acc, ...val.disaggregations.map(it => ({ ...it, status: val.status }))], [])]
                    if (dgs.length) {
                      disaggregations = dgs.map((dg, dgx) => ({ ...dg, typeId: disaggregations[dgx]?.typeId }))
                    }
                    const valueUpdates = periodUpdates.map(it => ({ value: it.value, status: it.status }))
                    return (
                      <DsgOverview
                        {...{
                          disaggregations,
                          period,
                          cumulative: indicator?.isCumulative,
                          targets: period.disaggregationTargets,
                          editPeriod: (props) => { editPeriod(props, indicator) },
                          values: valueUpdates,
                        }}
                      />
                    )
                  }}
                </FormSpy>
              ) :
              <div className="timeline-outer">
                <FormSpy subscription={{ values: true }}>
                  {({ values }) => {
                    const updates = [...period.updates, { ...values, status: 'D' }].filter(it => it !== null)
                    let data = updates?.map(u => ({
                      label: u.createdAt ? moment(u.createdAt, 'YYYY-MM-DD').format('DD-MM-YYYY') : null,
                      unix: u.createdAt ? moment(u.createdAt, 'YYYY-MM-DD').unix() : null,
                      y: u.value || 0
                    }))
                    data = orderBy(data, ['unix'], ['asc']).map((u, index) => ({ ...u, x: index }))
                    return (
                      <LineChart
                        data={data}
                        width={480}
                        height={300}
                        horizontalGuides={5}
                        precision={2}
                        verticalGuides={1}
                        {...period}
                      />
                    )
                  }}
                </FormSpy>
              </div>
          )}
        </div>
        <Divider />
        <div className="notes">
          {indicator.type === 1 &&
            <FinalField
              name="text"
              control="textarea"
              withLabel
              dict={{ label: t('Value comment') }}
              disabled={disableInputs}
            />
          }
          <FinalField
            name="note"
            control="textarea"
            withLabel
            dict={{ label: t('Internal private note') }}
            disabled={disableInputs}
          />
        </div>
      </Form>
      <div className="upload">
        <Upload.Dragger
          multiple
          disabled={disableInputs}
          fileList={fileSet}
          beforeUpload={(file, files) => {
            setFileSet([...fileSet, ...files])
            return false
          }}
          onRemove={file => {
            if (file.uid) {
              deleteFile(file)
            }
            setFileSet(fileSet.filter(_file => ((_file !== file) || (_file?.uid !== file?.uid))))
          }}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="picture" theme="twoTone" />
          </p>
          <p className="ant-upload-text">{t('Drag file here')}</p>
          <p className="ant-upload-hint">{t('or click to browse from computer')}</p>
          <p><small>Max: 10MB</small></p>
        </Upload.Dragger>
      </div>
    </div>
  )
}

export default ReportedForm
