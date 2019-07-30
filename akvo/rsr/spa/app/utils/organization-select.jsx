import React, { useReducer } from 'react'
import { Field } from 'react-final-form'
import { Select, Form, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import FinalField from './final-field'
import InputLabel from './input-label'

const { Option } = Select
const { Item } = Form

let intid

const OrganizationSelect = ({ name, fieldName = 'organisation', orgs, loading, disabled, dict }) => {
  const { t } = useTranslation()
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }), // eslint-disable-line
    { options: [], loading: false, searchStr: '' }
  )
  const filterOptions = value => {
    clearTimeout(intid)
    if (value.length > 1) {
      setState({
        options: [],
        loading: true,
        searchStr: value
      })
      intid = setTimeout(() => {
        const options = orgs
          .filter(it => it.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 || it.longName.toLowerCase().indexOf(value.toLowerCase()) !== -1)
          .map(({ id, name }) => ({ value: id, label: name })) // eslint-disable-line
        setState({
          options,
          loading: false
        })
      }, 300)
    }
  }
  return (
    <Field
      name={`${name}.organisationName`}
      render={(nameProps) => (
        <FinalField
          name={`${name}.${fieldName}`}
          render={({input, validateStatus, meta}) => {
            const $options =
              orgs && orgs.length > 0
                ? ((!meta.active && state.searchStr.length === 0 && input.value !== '') ? [{ value: input.value, label: orgs.find(it => it.id === input.value).name }] : state.options)
                : [{ value: input.value, label: nameProps.input.value }]
            return (
              <Item validateStatus={validateStatus} label={<InputLabel tooltip={dict.tooltip}>{dict.label}</InputLabel>}>
              <Select
                {...input}
                onChange={(val) => { setState({ searchStr: '', options: [] }); input.onChange(val); input.onBlur() }}
                disabled={disabled}
                showSearch
                loading={loading}
                onSearch={filterOptions}
                notFoundContent={state.loading ? <Spin size="small" /> : (state.searchStr.length === 0 ? <span>{t('Start typing...')}</span> : <span>{t('No results')}</span>)}
                filterOption={false}
              >
                {$options.map(option => <Option value={option.value} key={option.value}>{option.label}</Option>)}
              </Select>
              </Item>
            )
          }}
        />
      )}
    />
  )
}

export default OrganizationSelect
