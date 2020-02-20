import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { useTranslation } from 'react-i18next'

import FinalField from '../../../utils/final-field'
import InputLabel from '../../../utils/input-label'
import AutoSave from '../../../utils/auto-save'
import RTE from '../../../utils/rte'
import tempAvailableKeywords from './temp-keywords.json'

import './styles.scss'

const { Item } = Form

const CommentsKeywords = ({ fields }) => {
  const { t } = useTranslation()
  return (
    <div className="comments-n-keywords view">
      <Form layout="vertical">
        <FinalForm
          onSubmit={() => { }}
          initialValues={fields}
          mutators={{ ...arrayMutators }}
          subscription={{}}
          render={() => (
            <div>
              <AutoSave sectionIndex={10} />
              <Item label={<InputLabel optional tooltip={t('The project comments are only for internal use and will not be displayed anywhere on the project page.')}>{t('Comments')}</InputLabel>}>
                <FinalField
                  name="notes"
                  render={({ input }) => <RTE {...input} />}
                />
              </Item>
              <Item label={<InputLabel optional tooltip={t('Select keywords in case you are using an Akvo Page. Keywords linked to a project will determine if a project appears on the Akvo Page or not.')}>{t('Keywords')}</InputLabel>}>
                <FinalField
                  name="keywords"
                  control="select"
                  mode="multiple"
                  optionFilterProp="children"
                  options={tempAvailableKeywords.map(({ id, label }) => ({ value: id, label }))}
                  placeholder={t('Please select...')}
                />
              </Item>
            </div>
          )}
        />
      </Form>
    </div>
  )
}

export default connect(
  ({ editorRdr: { section10: {fields}} }) => ({ fields }),
)(React.memo(CommentsKeywords, () => true))
