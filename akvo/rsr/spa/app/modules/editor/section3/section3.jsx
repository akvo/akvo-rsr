import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Form } from 'antd'
import { Form as FinalForm, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import './styles.scss'
import { removeSetItem } from '../actions'
import SectionContext from '../section-context'
import { useFetch } from '../../../utils/hooks'
import { shouldUpdateSectionRoot } from '../../../utils/misc'
import Partners from './partners/partners'
import Access from './access/access'
import api from '../../../utils/api'

const Section3 = ({ fields, errors, projectId, canEditAccess: admin, canEditEnumeratorAccess: mne }) => { // eslint-disable-line
  const [{ results }, loading] = useFetch('/typeaheads/organisations')
  const [roleData, setRoleData] = useState(null)
  useEffect(() => {
    api.get(`project/${projectId}/project-roles/`)
      .then(({ data }) => {
        setRoleData(data)
      })
  }, [])
  return (
    <div className="partners view">
      <SectionContext.Provider value="section3">
        <Form layout="vertical">
          <FinalForm
            onSubmit={() => { }}
            initialValues={fields}
            subscription={{}}
            mutators={{ ...arrayMutators }}
            render={(renderProps) => {
              const {
                form: {
                  mutators: { push }
                }
              } = renderProps
              return (
                <div>
                  <Partners {... { renderProps, push, results, loading, errors }} />
                  {roleData &&
                    <Field name="partners" subscription={{ value: true }}>
                      {({ input }) => <Access {...{ roleData, projectId, partners: input.value, admin, mne }} />}
                    </Field>
                  }
                </div>
              )
            }}
          />
        </Form>
      </SectionContext.Provider>
    </div>
  )
}

export default connect(
  ({ editorRdr: { projectId, section3: { fields, errors }, section1: { fields: { canEditAccess, canEditEnumeratorAccess } } } }) => ({ fields, errors, projectId, canEditAccess, canEditEnumeratorAccess }),
  { removeSetItem }
)(React.memo(Section3, shouldUpdateSectionRoot))
