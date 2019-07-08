import React, {useState} from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { get, isEqual } from 'lodash'

import InputLabel from '../../../../utils/input-label'
import { useFetch } from '../../../../utils/hooks'
import actionTypes from '../../action-types'
import TaxonomyModal from './taxonomy-modal'


const mapDispatchToProps = (dispatch) => {
  return {
    // ...bindActionCreators({ addSetItem, removeSetItem }), // es7 spread syntax
    dispatch
  }
}

const Disaggregations = ({ fieldName, formPush, addSetItem, removeSetItem, projectId, dispatch, fields }) => { // eslint-disable-line
  const [dimensionData] = useFetch(`/dimension_name/?project=${projectId}`)
  const [modalVisible, setModalVisible] = useState()
  const addedDimensions = get(fields, `${fieldName}.dimensionNames`)
  return (
    <div>
      <div className="ant-col ant-form-item-label">
        <InputLabel optional tooltip="asd">Disaggregations</InputLabel>
      </div>
      {addedDimensions && addedDimensions.map(dimension => (
        <div className="dimension-box">
          <div>
            <h5>{dimension.name}</h5>
            <ul>
              {dimension.values.map(value => <li>{value.value}</li>)}
            </ul>
          </div>
          <Button icon="minus" type="danger">Remove</Button>
        </div>
      ))}
      <Button icon="plus" block type="dashed" onClick={() => setModalVisible(true)}>Add disaggregation</Button>
      <TaxonomyModal
        visible={modalVisible}
        handleCancel={() => setModalVisible(false)}
        handleAdd={(dimension, isNew) => {
          setModalVisible(false)
          dispatch({ type: actionTypes.ADD_SET_ITEM, sectionIndex: 5, setName: `${fieldName}.dimensionNames`, item: dimension })
        }}
        dimensions={dimensionData.results && dimensionData.results.filter(dimension => addedDimensions.findIndex(it => it.id !== dimension.id) === -1)}
      />
    </div>
  )
}

export default connect(({ editorRdr: { projectId, section5: { fields } } }) => ({ projectId, fields }), mapDispatchToProps)(React.memo(
  Disaggregations, (prevProps, nextProps) => isEqual(get(prevProps.fields, `${prevProps.fieldName}.dimensionNames`), get(nextProps.fields, `${nextProps.fieldName}.dimensionNames`)))
)
