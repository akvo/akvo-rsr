/* eslint no-loop-func: "error" */
/* eslint-env es6 */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Form, Col, Row } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { useTranslation } from 'react-i18next'

import { Aux, shouldUpdateSectionRoot } from '../../../utils/misc'
import InputLabel from '../../../utils/input-label'
import { getValidationSets, doesFieldExist } from '../../../utils/validation-utils'
import BudgetItems from './budget-items/budget-items'
import CountryBudgetItems from './country-budget-items/country-budget-items'
import Transactions from './transactions/transactions'
import PlannedDisbursements from './planned-disbursements/disbursements'
import FinalField from '../../../utils/final-field'
import AutoSave from '../../../utils/auto-save'
import SectionContext from '../section-context'
import validationDefs from './validations'
import './styles.scss'
import { useFetch } from '../../../utils/hooks';
import actionTypes from '../action-types'
import api from '../../../utils/api'

const { Item } = Form

const Finance = ({ validations, fields, currency, dispatch, pagination, projectId }) => {
  const [{ results: orgs }, loadingOrgs] = useFetch('/typeaheads/organisations')
  const [transactions, setTransactions] = useState(null)
  const [paginates, setPaginates] = useState([])
  const [search, setSearch] = useState(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  const updateTransactions = (data) => {
    dispatch({
      type: actionTypes.SAVE_FIELDS,
      noSync: true,
      sectionIndex: 6,
      fields: {
        ...fields,
        transactions: data
      }
    })
  }
  const handleOnSearch = (e) => {
    setLoading(true)
    setSearch(e.target.value)
  }
  const handleOnPage = (page) => updateTransactions(paginates[page - 1])
  const handleOnFiltering = (search, items) => {
    const results = [
      ...items.filter((it) => {
        return ((search && (
            it?.value?.toString()?.includes(search)
            || it?.description?.toLowerCase()?.includes(search?.toLowerCase())
            || it?.transactionTypeLabel?.toLowerCase()?.includes(search?.toLowerCase())
          )) || !search)
      })
    ]
    const pages = []
    const total = parseInt((results.length / 30), 10) + 1
    for (let p = 0; p < total; p += 1) {
      const offset = p * 30
      pages.push(results.slice(offset).slice(0, 30))
    }
    dispatch({
      type: actionTypes.UPDATE_PAGINATION,
      noSync: true,
      sectionIndex: 6,
      pagination: {
        total: results.length
      }
    })
    setPaginates(pages)
    updateTransactions(pages[0])
  }

  useEffect(() => {
    if (!transactions && fields?.transactions && loading) {
      let tl = fields?.transactions
      const pages = [tl]
      const promises = []
      const total = parseInt((pagination?.total || 1 / 30), 10) + 1
      if (total > 1) {
        for (let p = 2; p <= total; p += 1) {
          promises
            .push(api.get(`transaction/?page=${p}&project=${projectId}`)
            // eslint-disable-next-line no-loop-func
            .then(({ data: { results: rs } }) => {
              tl = [...tl, ...rs]
              pages.push(rs)
              return rs
            }))
        }
        Promise
        .all(promises)
        .then(() => {
          setLoading(false)
          setTransactions(tl)
          setPaginates(pages)
        })
      } else {
        setLoading(false)
        setTransactions(tl)
        setPaginates(pages)
      }
    }
  }, [transactions, fields, loading])

  useEffect(() => {
    if (loading && transactions) {
      setLoading(false)
      handleOnFiltering(search, transactions)
    }
  }, [loading, search, transactions])
  return (
    <div className="finance view">
      <SectionContext.Provider value="section6">
      <FinalForm
        onSubmit={() => {}}
        initialValues={fields}
        subscription={{}}
        mutators={{ ...arrayMutators }}
        render={({
          form: {
            mutators: { push }
          }
        }) => (
        <Form layout="vertical">
          <Item label={<InputLabel optional tooltip={t('Add a donation url for this project. If no URL is added, it is not possible to donate to this project through RSR.')}>{t('Donate URL')}</InputLabel>}>
          <FinalField
            name="donateUrl"
            placeholder="http://..."
            control="input"
          />
          </Item>
          {fieldExists('capitalSpendPercentage') && (
            <Row>
              <Col span={12}>
              <Item label={<InputLabel optional tooltip={t('The percentage of the total commitment allocated to or planned for capital expenditure. Content must be a positive decimal number between 0 and 100, with no percentage sign. Use a period to denote decimals.')}>{t('Capital spend percentage')}</InputLabel>}>
              <FinalField
                name="capitalSpendPercentage"
                suffix={<span>%</span>}
                className="capital-percentage"
                control="input"
              />
              </Item>
              </Col>
            </Row>
          )}
          <BudgetItems formPush={push} validations={validations} />
          {fieldExists('countryBudgetItems') && (
            <Aux>
              <h3>{t('Country budget items')}</h3>
              <Item label={<InputLabel optional tooltip={t('Enter an IATI code for the common functional classification or country system (this allows for common codes, country-specific codes, or any other classification agreed between countries and donors) see: <a href="http://iatistandard.org/201/codelists/BudgetIdentifierVocabulary/" target="_blank">http://iatistandard.org/201/codelists/BudgetIdentifierVocabulary/</a>.')}>{t('Vocabulary')}</InputLabel>}>
              <FinalField
                name="countryBudgetVocabulary"
                control="select"
                options={[
                  { value: '1', label: 'IATI'},
                  { value: '2', label: t('Country Chart of Accounts')},
                  { value: '3', label: t('Other Country System')},
                  { value: '4', label: t('Reporting Organisation')},
                  { value: '5', label: t('Other')}
                ]}
                withEmptyOption
              />
              </Item>
              <CountryBudgetItems formPush={push} />
            </Aux>
          )}
          {fieldExists('transactions') && (
            <Transactions
              {...{
                search,
                loading,
                setLoading,
                validations,
                loadingOrgs,
                currency,
                formPush: push,
                orgs,
                onPage: handleOnPage,
                onSearch: handleOnSearch
              }}
            />
          )}
          {fieldExists('plannedDisbursements') && (
            <Aux>
              <h3>{t('Planned disbursements')}</h3>
                  <PlannedDisbursements formPush={push} validations={validations} orgs={orgs} loadingOrgs={loadingOrgs} currency={currency} />
            </Aux>
          )}
          <AutoSave sectionIndex={6} />
        </Form>
        )
        }
      />
      </SectionContext.Provider>
    </div>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

export default connect(
  ({ editorRdr: {
    section1: {
      fields: { currency }
    },
    section6: { fields, pagination },
    validations,
    projectId,
    saving
  }}) => ({ fields, validations, currency, pagination, projectId, saving }),
  mapDispatchToProps
)(React.memo(Finance, shouldUpdateSectionRoot))
