import React from 'react'
import { connect } from 'react-redux'
import { isEqual, get, trim } from 'lodash'
import { Field } from 'react-final-form'
import { Form, Input } from 'antd'
import FinalField from '../../../../utils/final-field'

class DimensionTargets extends React.Component {
  shouldComponentUpdate(prevProps) {
    const { resultIndex, indicatorIndex } = this.props
    const path = `results[${resultIndex}].indicators[${indicatorIndex}].dimensionNames`
    return !isEqual(get(prevProps, path), get(this.props, path)) || prevProps.periodId !== this.props.periodId
  }
  render() {
    const { resultIndex, indicatorIndex, indicatorId, periodIndex, periodId, fieldName, atIndicator, targetsAt } = this.props
    const path = `results[${resultIndex}].indicators[${indicatorIndex}]`
    const indicator = get(this.props, path)
    if (!indicator) {
      return null
    }
    const { dimensionNames } = indicator
    let container
    if (atIndicator) {
      container = indicator
    } else {
      container = indicator.periods[periodIndex]
    }
    if (container === undefined) {
      container = { indicator: indicatorId }
    }
    if (!container.disaggregationTargets) container.disaggregationTargets = []
    if (!dimensionNames || dimensionNames.length === 0) return null
    let newIndex = container.disaggregationTargets.length - 1
    return (
      <div className="disaggregation-targets">
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} style={{ marginBottom: 15 }}>
          {dimensionNames.map(dimension => (
            <div className="disaggregation-target">
              <div className="ant-col ant-form-item-label target-name">Target value: <b>{dimension.name}</b></div>
              {dimension.values.map((value, key) => {
                let targetIndex = container.disaggregationTargets.findIndex(it => it.dimensionValue === value.id)
                if (targetIndex === -1 && (periodId || atIndicator)) {
                  newIndex += 1
                  targetIndex = newIndex
                }
                return (
                  <div key={key} style={{ paddingTop: 15 }}>
                    <Field
                      name={`${fieldName}.disaggregationTargets[${targetIndex}].dimensionValue`}
                      render={({ input }) => <input type="hidden" {...input} />}
                      defaultValue={value?.id}
                    />
                    <FinalField
                      disabled={(!periodId && !atIndicator)}
                      name={`${fieldName}.disaggregationTargets[${targetIndex}].value`}
                      render={({ input, ...props }) => {
                        const error = props?.section5?.errors?.find((err) => err.path === input?.name)
                        const fprops = (
                          error?.message?.length &&
                          trim(input?.value)?.length &&
                          parseInt(input?.value, 10) !== 0 &&
                          (targetsAt === 'period' || input?.value?.match(/[a-z]/i))
                        )
                          ? { validateStatus: 'error', help: error?.message }
                          : {}
                        return (
                          <Form.Item
                            label={value.value}
                            {...fprops}
                            style={{ marginBottom: 0 }}
                          >
                            <Input {...input} />
                          </Form.Item>
                        )
                      }}
                      withLabel
                      label={<span />}
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </Form>
      </div>
    )
  }
}

export default connect(({ editorRdr: { section5: { fields: { results } } } }) => ({ results }))(DimensionTargets)
