import React, { useState } from 'react'
import { Modal, Button, Input, Popconfirm } from 'antd'
import { Form as FinalForm, Field } from 'react-final-form'
import { useTranslation } from 'react-i18next'
import api from '../../../../utils/api'


const PeriodLabelsModal = ({ visible, setVisible, projectId, setPeriodLabels, periodLabels }) => {
  const { t } = useTranslation()
  let rowFormRef
  let addFormRef
  const [state, setState] = useState({})
  const handleEditRow = (value) => () => setState({ editingRow: value })
  const handleRowSubmit = (value) => {
    setState({ editingName: false })
    api.patch(`/indicator_period_label/${value.id}/`, value)
      .then(({data}) => {
        const index = periodLabels.findIndex(it => it.id === data.id)
        setPeriodLabels([...periodLabels.slice(0, index), data, ...periodLabels.slice(index + 1)])
      })
  }
  const handleDeleteLabel = () => {
    const id = state.editingRow
    api.delete(`/indicator_period_label/${id}`)
      .then(() => {
        setState({ deleting: false })
        const index = periodLabels.findIndex(it => it.id === id)
        setPeriodLabels([...periodLabels.slice(0, index), ...periodLabels.slice(index + 1)])
      })
      .catch(err => {
        setState({ deleting: false })
        console.log(err) // eslint-disable-line no-console
      })
    setState({ deleting: true, editingRow: false })
  }
  const handleDoneWithRow = () => rowFormRef.form.submit()
  const handleAddSubmit = (value) => {
    if(value.label){
      api.post('/indicator_period_label/', {...value, project: projectId})
        .then(({data}) => setPeriodLabels(periodLabels.concat(data)))
    }
    setState({ addingRow: false })
  }
  return (
    <Modal visible={visible} onCancel={() => setVisible(false)} footer={null}>
      <p>{t('Period Labels')}</p>
      <div>
      <ul className="editing">
        {periodLabels?.map(value => {
          if (value.id !== state.editingRow) return <li>{value.label} <Button icon="edit" size="small" type="link" onClick={handleEditRow(value.id)} /></li>
            return (
              <li>
                <FinalForm
                  ref={(ref) => { rowFormRef = ref }}
                  onSubmit={handleRowSubmit}
                  initialValues={value}
                  render={() => (
                    <div className="input-row">
                      <Field name="label" render={({ input }) => <Input size="small" {...input} />} />
                        <Button icon="check" size="small" type="link" onClick={handleDoneWithRow} />
                        <div className="btns">
                          <Popconfirm
                            title={t('Are you sure to delete this label?')}
                            onConfirm={handleDeleteLabel}
                            okText="Yes"
                            okType="danger"
                            cancelText="No"
                          >
                            <Button icon="delete" type="danger" disabled={state.deleting} />
                          </Popconfirm>
                        </div>
                    </div>
                  )}
                />
              </li>)
        })}
    {!state.addingRow &&
     <li className="add">
     <Button size="small" type="link" icon="plus" className="add-label" onClick={() => setState({ addingRow: true })}>
     {t('Add label')}
     </Button>
     </li>
    }
    {state.addingRow && (
      <li>
        <FinalForm
          ref={(ref) => { addFormRef = ref }}
          onSubmit={handleAddSubmit}
          render={() => (
            <div className="input-row">
              <Field name="label" render={({ input }) => <Input size="small" {...input} />} />
                <Button icon="check" size="small" type="link" onClick={() => addFormRef.form.submit()} />
            </div>
          )}
        />
      </li>
    )}
      </ul>
      </div>
    </Modal>
  )
}

export default PeriodLabelsModal
