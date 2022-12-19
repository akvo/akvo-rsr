import React from 'react'
import classNames from 'classnames'
import FinalField from '../../../utils/final-field'
import UpdatesHistory from '../../../components/UpdatesHistory'

import { measureType } from '../../../utils/constants'

const DisaggregationsInput = ({
  measure,
  period,
  mneView,
  dimensionNames = [],
  disaggregations = [],
  disableInputs = false,
}) => dimensionNames?.map((group, gx) => {
  const activeKeys = group?.dimensionValues?.map((d) => d?.value)
  return (
    <div className="dsg-group-container" key={gx}>
      <div className="h-holder">
        <h5>{group.name}</h5>
      </div>
      <div className={classNames('dsg-group', { mneView })}>
        {group.dimensionValues.map(dsg => measure === measureType.UNIT
          ? (
            <FinalField
              name={`disaggregations[${disaggregations.findIndex(it => it.typeId === dsg.id && group.id === it.groupId)}].value`}
              control="input-number"
              withLabel
              dict={{ label: dsg.value }}
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
                step={1}
                disabled={disableInputs}
              />
              <FinalField
                name={`disaggregations[${disaggregations.findIndex(it => it.typeId === dsg.id && group.id === it.groupId)}].denominator`}
                control="input-number"
                withLabel
                dict={{ label: 'Denominator' }}
                step={1}
                disabled={disableInputs}
              />
            </div>
          )
        )}
      </div>
      <UpdatesHistory {...period} activeKeys={activeKeys} mneView={mneView} />
    </div>
  )
})

export default DisaggregationsInput
