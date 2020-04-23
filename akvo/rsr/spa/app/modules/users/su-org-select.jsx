import React, { useState, useReducer, useEffect } from 'react'
import { Select } from 'antd'
import { useTranslation } from 'react-i18next'
import api from '../../utils/api'

let intid
const { Option } = Select

const SUOrgSelect = ({ value, onChange }) => {
  const [orgs, setOrgs] = useState([])
  const { t } = useTranslation()
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }), // eslint-disable-line
    { options: [], searchStr: '' }
  )
  useEffect(() => {
    api.get('/typeaheads/organisations')
      .then(({ data: { results } }) => {
        setOrgs(results)
        const options = results.filter(it => it.id === value).map(({ id, name }) => ({ value: id, label: name }))
        setState({
          options
        })
      })
  }, [])
  useEffect(() => {
    const options = orgs.filter(it => it.id === value).map(({ id, name }) => ({ value: id, label: name }))
    setState({
      options
    })
  }, [value])
  const handleBlur = () => {
    setTimeout(() => {
      if (orgs.length > 0) {
        const options = orgs.filter(it => it.value === value)
        setState({
          options,
          searchStr: ''
        })
      }
    }, 200)
  }
  useEffect(handleBlur, [value])
  const filterOptions = _value => {
    clearTimeout(intid)
    if (_value.length > 1) {
      setState({
        options: [],
        searchStr: _value
      })
      intid = setTimeout(() => {
        const options = orgs
          .filter(it => it.name.toLowerCase().indexOf(_value.toLowerCase()) !== -1 || it.longName.toLowerCase().indexOf(_value.toLowerCase()) !== -1)
          .map(({ id, name }) => ({ value: id, label: name })) // eslint-disable-line
        setState({
          options
        })
      }, 300)
    }
  }

  return (
    <Select
      {...{ value, onChange }}
      showSearch
      onSearch={filterOptions}
      notFoundContent={<div>{(state.searchStr.length === 0 ? <span>{t('Start typing...')}</span> : <span>{t('No results')}</span>)}</div>}
      filterOption={false}
      dropdownMatchSelectWidth={false}
      dropdownRender={(menuNode) => {
        if (state.options.length === 1 && state.options[0].value === value) return <div className="start-typing">Start typing...</div>
        return menuNode
      }}
      onBlur={handleBlur}
    >
      {state.options.map(option => <Option value={option.value} key={option.value}>{option.label}</Option>)}
    </Select>
  )
}

export default SUOrgSelect
