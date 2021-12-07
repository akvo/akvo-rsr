import React from 'react'
import { Field, FormSpy } from 'react-final-form'
import { Icon, Form, Divider, Upload } from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import SimpleMarkdown from 'simple-markdown'
import DsgOverview from '../../results/dsg-overview'
import Timeline from '../../results/timeline'
import { DeclinedStatus } from '../../../components/DeclinedStatus'
import { PrevUpdate } from '../../../components/PrevUpdate'
import { StatusUpdate } from '../../../components/StatusUpdate'
import FinalField from '../../../utils/final-field'
import { nicenum } from '../../../utils/misc'
import RTE from '../../../utils/rte'
import ScoringField from '../../../components/ScoringField'

const ReportedForm = ({
  init,
  form,
  period,
  indicator,
  updateLabel,
  disaggregations,
  submittedUpdate,
  updateForRevision,
  currentActualValue,
  disableInputs,
  editPeriod,
  setFileSet,
  mneView,
  fileSet,
  deleteFile,
  defaultFileList
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
      <Form aria-orientation="vertical">
        <div className={classNames('inputs-container', { qualitative: indicator.type === 2, 'no-prev': period?.updates?.filter(it => it.status === 'A').length === 0 })}>
          <div className="inputs">
            {mneView && indicator.type === 1 && <h4>Add a value update</h4>}
            {indicator.dimensionNames.map(group =>
              <div className="dsg-group" key={group.name}>
                <div className="h-holder">
                  <h5>{group.name}</h5>
                </div>
                {group.dimensionValues.map(dsg => {
                  return indicator.measure === '1' ? (
                    <FinalField
                      name={`disaggregations[${disaggregations.findIndex(it => it.typeId === dsg.id && group.id === it.groupId)}].value`}
                      control="input-number"
                      withLabel
                      dict={{ label: dsg.value }}
                      min={-Infinity}
                      step={1}
                      disabled={disableInputs}
                    />
                  ) : (
                    <div>
                      <div style={{ paddingLeft: '1em' }}>{dsg.value}</div>
                      <FinalField
                        name={`disaggregations[${disaggregations.findIndex(it => it.typeId === dsg.id && group.id === it.groupId)}].numerator`}
                        control="input-number"
                        withLabel
                        dict={{ label: 'Enumerator' }}
                        min={-Infinity}
                        step={1}
                        disabled={disableInputs}
                      />
                      <FinalField
                        name={`disaggregations[${disaggregations.findIndex(it => it.typeId === dsg.id && group.id === it.groupId)}].denominator`}
                        control="input-number"
                        withLabel
                        dict={{ label: 'Denominator' }}
                        min={-Infinity}
                        step={1}
                        disabled={disableInputs}
                      />
                    </div>
                  )
                }
                )}
              </div>
            )}
            {indicator.type === 1 ? [
              <Field
                name="disaggregations"
                render={({ input }) => {
                  const dsgGroups = {}
                  if (input?.value?.length) {
                    input.value.forEach(item => {
                      if (!dsgGroups[item.category]) dsgGroups[item.category] = { value: 0, numerator: 0, denominator: 0 }
                      if (item.value) dsgGroups[item.category].value += item.value
                      if (item.numerator) dsgGroups[item.category].numerator += item.numerator
                      if (item.denominator) dsgGroups[item.category].denominator += item.denominator
                    })
                  }
                  const categories = Object.keys(dsgGroups)
                  if (categories.length > 0 && indicator.measure === '1') {
                    const value = categories.reduce((acc, key) => dsgGroups[key].value > acc ? dsgGroups[key].value : acc, 0)
                    if (value > 0) form.change('value', value)
                  }
                  if (categories.length > 0 && indicator.measure === '2') {
                    const [numerator, denominator] = categories.reduce(([numerator, denominator], key) => [
                      dsgGroups[key].numerator > numerator ? dsgGroups[key].numerator : numerator,
                      dsgGroups[key].denominator > denominator ? dsgGroups[key].denominator : denominator
                    ], [0, 0])
                    if (numerator > 0) form.change('numerator', numerator)
                    if (denominator > 0) form.change('denominator', denominator)
                  }
                  return null
                }}
              />,
              indicator.measure === '1' ?
                <FinalField
                  withLabel
                  dict={{ label: period?.disaggregationTargets.length > 0 ? t('Total value') : t('Value') }}
                  name="value"
                  control="input-number"
                  min={-Infinity}
                  step={1}
                  disabled={disableInputs}
                /> :
                <FinalField
                  withLabel
                  dict={{ label: 'Numerator' }}
                  name="numerator"
                  control="input-number"
                  min={-Infinity}
                  step={1}
                  disabled={disableInputs}
                />,
              (indicator.measure === '1' && period.updates.length > 0) && [
                <div className="updated-actual">
                  <div className="cap">{t('Updated actual value')}</div>
                  <Field
                    name="value"
                    render={({ input }) => {
                      const updatedTotal = currentActualValue + (disableInputs ? 0 : (input.value > 0 ? input.value : 0))
                      return (
                        <div className="value">
                          <b>{nicenum(updatedTotal)}</b>
                          {period.targetValue > 0 && <small>{(Math.round((updatedTotal / period.targetValue) * 100 * 10) / 10)}% of target</small>}
                        </div>
                      )
                    }}
                  />
                </div>
              ],
              indicator.measure === '2' && [
                <FinalField
                  withLabel
                  dict={{ label: 'Denominator' }}
                  name="denominator"
                  control="input-number"
                  step={1}
                  min={-Infinity}
                  disabled={disableInputs}
                />,
                <div className="perc">
                  <FormSpy subscription={{ values: true }}>
                    {({ values }) => {
                      if (values.numerator !== '' && values.numerator != null && values.denominator !== '' && values.denominator != null) {
                        const value = Math.round((values.numerator / values.denominator) * 100 * 10) / 10
                        if (value !== values.value) {
                          form.change('value', value)
                        }
                        return `${value}%`
                      }
                      return null
                    }}
                  </FormSpy>
                </div>
              ]
            ] : [ // qualitative indicator
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
                    const mdOutput = SimpleMarkdown.defaultOutput
                    return <div className="md-output">{mdOutput(parse(input.value))}</div>
                  }
                  return [
                    <RTE {...input} />
                  ]
                }}
              />
            ]}
          </div>
          {!mneView && !(indicator.measure === '2' && period.updates.length > 0) &&
            <PrevUpdate update={period.updates.filter(it => it.status === 'A' || it.status === 'R')[0]} {...{ period, indicator }} />
          }
          {(mneView && indicator.type === 1) && (
            disaggregations.length > 0 ?
              (
                <FormSpy subscription={{ values: true }}>
                  {({ values }) => {
                    const periodUpdates = [...period.updates, { ...values, status: 'D' }]
                    const disaggregations = [...periodUpdates.reduce((acc, val) => [...acc, ...val.disaggregations.map(it => ({ ...it, status: val.status }))], [])]
                    const valueUpdates = periodUpdates.map(it => ({ value: it.value, status: it.status }))
                    return <DsgOverview {...{ disaggregations, targets: period.disaggregationTargets, period, editPeriod: (props) => { editPeriod(props, indicator) }, values: valueUpdates }} />
                  }}
                </FormSpy>
              ) :
              <div className="timeline-outer">
                <FormSpy subscription={{ values: true }}>
                  {({ values }) => {
                    return <Timeline {...{ updates: [...period.updates, submittedUpdate == null ? { ...values, status: 'D' } : null].filter(it => it !== null), indicator, period, editPeriod }} />
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
            setFileSet(fileSet.filter(_file => _file !== file))
          }}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="picture" theme="twoTone" />
          </p>
          <p className="ant-upload-text">{t('Drag file here')}</p>
          <p className="ant-upload-hint">{t('or click to browse from computer')}</p>
          <p><small>Max: 10MB</small></p>
        </Upload.Dragger>
        <Upload fileList={defaultFileList} onRemove={deleteFile} />
      </div>
    </div>
  )
}

export default ReportedForm
