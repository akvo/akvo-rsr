import React, { useReducer } from 'react'
import { Button, Input, Popconfirm } from 'antd'
import { Form as FinalForm, Field } from 'react-final-form'
import { useTranslation } from 'react-i18next'

import api from '../../../../utils/api'

const DimensionBox = ({ dimension, handleAdd, fetchDimensions}) => {
  const { t } = useTranslation()
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }), // eslint-disable-line
    {editing: false, addingRow: false, editingName: false, editingRow: null, deleting: false}
  )
  let nameFormRef
  let rowFormRef
  let addFormRef
  const handleNameSubmit = (values) => {
    setState({ editingName: false })
    api.patch(`/dimension_name/${dimension.id}/`, values)
      .then(fetchDimensions)
    // editDimension(values)
  }
  const handleRowSubmit = (values) => {
    if(values.value){
      api.patch(`/dimension_value/${state.editingRow.id}/`, values)
        .then(fetchDimensions)
    } else {
      api.delete(`/dimension_value/${state.editingRow.id}`)
        .then(fetchDimensions)
    }
    setState({ editingRow: false })
  }
  const handleAddSubmit = (values) => {
    if(values.value){
    api.post('/dimension_value/', {
      ...values,
      name: dimension.id
    }).then(fetchDimensions)
    }
    setState({ addingRow: false })
  }
  const handleDeleteDimension = () => {
    setState({ deleting: true, editing: false })
    api.delete(`/dimension_name/${dimension.id}/`)
      .then(() => {
        setState({ deleting: false })
        fetchDimensions()
      })
      .catch(err => {
        setState({ deleting: false })
        console.log(err)
      })
  }
  return (
    <div className="dimension-box">
      <div>
        {!state.editingName && <h5>{dimension.name} {state.editing && <Button icon="edit" size="small" type="link" onClick={() => setState({ editingName: true })} />}</h5>}
        {state.editingName && (
          <div>
            <FinalForm
              ref={(ref) => { nameFormRef = ref }}
              onSubmit={handleNameSubmit}
              initialValues={{ name: dimension.name }}
              render={() => (
                <div style={{ display: 'flex'}}>
                <Field name="name" render={({ input }) => <Input size="small" {...input} />} />
                <Button icon="check" size="small" type="link" onClick={() => nameFormRef.form.submit()} />
                </div>
              )}
            />
          </div>
        )}
        <ul>
          {dimension.values.map(value => {
            if (value !== state.editingRow) return <li>{value.value} {state.editing && <Button icon="edit" size="small" type="link" onClick={() => setState({ editingRow: value })} />}</li>
            return (
            <li>
              <FinalForm
                ref={(ref) => { rowFormRef = ref }}
                onSubmit={handleRowSubmit}
                initialValues={{ value: value.value }}
                render={() => (
                  <div style={{ display: 'flex' }}>
                    <Field name="value" render={({ input }) => <Input size="small" {...input} />} />
                    <Button icon="check" size="small" type="link" onClick={() => rowFormRef.form.submit()} />
                  </div>
                )}
              />
            </li>)
          })}
          {(state.editing && !state.addingRow) && <li><Button size="small" type="link" icon="plus" className="add-label" onClick={() => setState({ addingRow: true })}>{t('Add label')}</Button></li>}
          {state.addingRow && (
            <li>
              <FinalForm
                ref={(ref) => { addFormRef = ref }}
                onSubmit={handleAddSubmit}
                render={() => (
                  <div style={{ display: 'flex' }}>
                    <Field name="value" render={({ input }) => <Input size="small" {...input} />} />
                    <Button icon="check" size="small" type="link" onClick={() => addFormRef.form.submit()} />
                  </div>
                )}
              />
            </li>
          )}
        </ul>
      </div>
      {!state.editing &&
      <div className="btns">
        <Button onClick={() => setState({ editing: true })} type="link">{t('Edit')}</Button>
        <Button type="primary" onClick={() => handleAdd(dimension, false)}>{t('Add')}</Button>
      </div>
      }
      {state.editing &&
      <div className="btns">
        <Popconfirm
          title={t('Are you sure to delete this?')}
          onConfirm={handleDeleteDimension}
          okText="Yes"
          okType="danger"
          cancelText="No"
        >
        <Button icon="delete" type="danger" disabled={state.deleting} />
        </Popconfirm>
        <Button icon="check" onClick={() => setState({ editing: false })}>{t('Done')}</Button>
      </div>
      }
    </div>
  )
}

export default DimensionBox
