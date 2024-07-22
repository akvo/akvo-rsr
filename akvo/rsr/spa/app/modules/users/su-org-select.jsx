import React, { useState, useReducer, useEffect } from 'react'
import { Select } from 'antd'
import api from '../../utils/api'

let intid
const { Option } = Select

const SUOrgSelect = ({ value, onChange, allOrgsOption, noOrgsOption, ...props }) => {
  const [orgs, setOrgs] = useState([])
  const [state, setState] = useReducer(
    (state_, newState) => ({ ...state_, ...newState }),
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
          .map(({ id, name }) => ({ value: id, label: name }))
        setState({
          options
        })
      }, 300)
    }
  }

  return (
    <Select
      {...{ value, onChange, allOrgsOption, noOrgsOption, ...props }}
      showSearch
      onSearch={filterOptions}
      filterOption={false}
      dropdownMatchSelectWidth={false}
      dropdownRender={(menuNode) => {
        if (state.options.length === 1 && state.options[0].value === value) return <div className="start-typing">Start typing...</div>
        return menuNode
      }}
      onBlur={handleBlur}
    >
      {allOrgsOption && state.searchStr.length === 0 && <Option value={allOrgsOption.value} key={allOrgsOption.value}>{allOrgsOption.label}</Option>}
      {noOrgsOption && state.searchStr.length === 0 && <Option value={noOrgsOption.value} key={noOrgsOption.value}>{noOrgsOption.label}</Option>}
      {state.searchStr.length === 0 && <div key="start-typing" className="start-typing">Start typing ...</div>}
      {state.options.map(option => <Option value={option.value} key={option.value}>{option.label}</Option>)}
    </Select>
  )
}

export default SUOrgSelect
