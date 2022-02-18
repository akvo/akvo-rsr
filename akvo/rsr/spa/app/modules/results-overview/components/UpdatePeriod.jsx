import React, { useState } from 'react'
import { Typography, Button } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import { useTranslation } from 'react-i18next'

import UpdateItems from './UpdateItems'
import ReportedForm from '../../results-admin/components/ReportedForm'

const { Text } = Typography

export const UpdatePeriod = ({
  role,
  period,
  indicator,
  updates,
  baseline,
  targetsAt,
  editPeriod
}) => {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(null)
  const [fileSet, setFileSet] = useState([])
  const [errors, setErrors] = useState([])

  const disaggregations = [...updates.reduce((acc, val) => [...acc, ...val.disaggregations.map(it => ({ ...it, status: val.status }))], [])]

  const deletePendingUpdate = (item) => {
    console.log('i', item)
  }
  const handleSubmit = (values) => {
    console.log('v', values)
  }
  const deleteFile = (item) => {
    console.log('i', item)
  }
  return editing
    ? (
      <div>
        <FinalForm
          onSubmit={handleSubmit}
          subscription={{ values: true }}
          initialValues={editing}
          render={({ form }) => {
            return (
              <ReportedForm
                {...{
                  form,
                  errors,
                  mneView: true,
                  editPeriod,
                  setFileSet,
                  disableInputs: false,
                  disaggregations,
                  fileSet,
                  period,
                  indicator,
                  init: editing,
                  deleteFile
                }}
              />
            )
          }}
        />
        <div style={{ padding: 15 }}>
          <Button onClick={() => deletePendingUpdate(editing)}>
            <Text type="danger" strong>{t('Delete')}</Text>
          </Button>
        </div>
      </div>
    )
    : (
      <UpdateItems
        {...{
          role,
          period,
          indicator,
          updates,
          baseline,
          targetsAt,
          editPeriod,
          disaggregations,
          setEditing
        }}
      />
    )
}
