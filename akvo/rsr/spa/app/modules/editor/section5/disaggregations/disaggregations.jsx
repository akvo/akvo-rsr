import React, {useState, useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { get, isEqual } from 'lodash'
import { useTranslation } from 'react-i18next'

import InputLabel from '../../../../utils/input-label'
import actionTypes from '../../action-types'
import TaxonomyModal from './taxonomy-modal'
import api from '../../../../utils/api'


const mapDispatchToProps = (dispatch) => {
  return {
    // ...bindActionCreators({ addSetItem, removeSetItem }), // es7 spread syntax
    dispatch
  }
}

const Disaggregations = ({ fieldName, formPush, addSetItem, removeSetItem, projectId, dispatch, fields, indicatorId }) => { // eslint-disable-line
  const { t } = useTranslation()
  const [dimensionData, setDimensionData] = useState([])
  async function fetchDimensions() {
    const response = await api.get(`/dimension_name/?project__in=${projectId}`)
    setDimensionData(response.data)
  }
  useEffect(() => {
    fetchDimensions()
  }, [])
  const [modalVisible, setModalVisible] = useState()
  const addedDimensions = get(fields, `${fieldName}.dimensionNames`)
  const patchIndicator = (dimensionNames) => {
    api.patch(`/indicator/${indicatorId}/`, { dimensionNames })
      .then(() => dispatch({ type: actionTypes.BACKEND_SYNC }))
      .catch(error => dispatch({ type: actionTypes.BACKEND_ERROR, error, response: error.response.data }))
  }
  const addItem = (dimension) => {
    setModalVisible(false)
    dispatch({ type: actionTypes.ADD_SET_ITEM, sectionIndex: 5, setName: `${fieldName}.dimensionNames`, item: dimension })
    patchIndicator([...addedDimensions.map(it => it.id), dimension.id])
    fetchDimensions()
  }
  const removeItem = (itemIndex) => {
    dispatch({ type: actionTypes.REMOVE_SET_ITEM, sectionIndex: 5, setName: `${fieldName}.dimensionNames`, itemIndex })
    patchIndicator(addedDimensions.map(it => it.id).filter(id => id !== addedDimensions[itemIndex].id))
  }
  const unaddedDimensions = dimensionData.results &&
    dimensionData.results.filter(dimension => addedDimensions.findIndex(it => it.id === dimension.id) === -1)
  return (
    <div>
      <div className="ant-col ant-form-item-label">
        <InputLabel optional tooltip={t('The term "disaggregation" is equivalent to the IATI term "dimension". For those reporting to IATI via RSR, disaggregations and their associated data are mapped accordingly as dimensions in your IATI export.')}>
          {t('Disaggregations')}
        </InputLabel>
      </div>
      {addedDimensions && addedDimensions.map((dimension, index) => (
        <div className="dimension-box">
          <div>
            <h5>{dimension.name}</h5>
            <ul>
              {dimension.values.map(value => <li>{value.value}</li>)}
            </ul>
          </div>
          <Button icon="minus" type="danger" onClick={() => removeItem(index)}>{t('Remove')}</Button>
        </div>
      ))}
      <Button icon="plus" block type="dashed" disabled={!indicatorId} onClick={() => setModalVisible(true)}>{t('Add disaggregation')}</Button>
      <TaxonomyModal
        visible={modalVisible}
        handleCancel={() => setModalVisible(false)}
        handleAdd={(dimension, isNew) => addItem(dimension)}
        dimensions={unaddedDimensions}
        fetchDimensions={fetchDimensions}
      />
    </div>
  )
}

export default connect(({ editorRdr: { projectId, section5: { fields } } }) => ({ projectId, fields }), mapDispatchToProps)(React.memo(
  Disaggregations, (prevProps, nextProps) => {
    return isEqual(get(prevProps.fields, `${prevProps.fieldName}.dimensionNames`), get(nextProps.fields, `${nextProps.fieldName}.dimensionNames`))
            && prevProps.indicatorId === nextProps.indicatorId
  })
)
