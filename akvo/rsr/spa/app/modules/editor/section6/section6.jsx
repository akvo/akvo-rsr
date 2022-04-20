/* eslint no-loop-func: "error" */
/* eslint-env es6 */
/* global window, document */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Form, Col, Row, Skeleton } from 'antd'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { useTranslation } from 'react-i18next'
import isEmpty from 'lodash/isEmpty'
import invert from 'lodash/invert'
import chunk from 'lodash/chunk'
import moment from 'moment'

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
import { endpoints } from '../endpoints'

const { Item } = Form

const Finance = ({ validations, fields, currency, dispatch, pagination, projectId }) => {
  const [{ results: orgs }, loadingOrgs] = useFetch('/typeaheads/organisations')
  const [transactions, setTransactions] = useState([])
  const [budgetItems, setBudgetItems] = useState([])
  const [search, setSearch] = useState({
    budgetItems: null,
    transactions: null
  })
  const [preload, setPreload] = useState(true)
  const [activePanel, setActivePanel] = useState({
    transaction: { page: 1, index: '0' },
    budget: { page: 1, index: '0' }
  })
  const [sectionName, sectionID] = window?.location?.hash?.slice(2)?.split('/')

  const { t } = useTranslation()
  const validationSets = getValidationSets(validations, validationDefs)
  const fieldExists = doesFieldExist(validationSets)
  const data = { transactions, budgetItems }
  const sectionKey = {
    transaction: 'transactions',
    budget: 'budgetItems'
  }
  const amountKey = {
    transactions: 'value',
    budgetItems: 'amount'
  }
  const mixedCurrencies = data?.budgetItems?.reduce((acc, budgetItem) => {
    if (acc.indexOf(budgetItem.currency) === -1) {
      return [...acc, budgetItem.currency]
    }
    return acc
  }, [])
  const totalBudgetReducer = (acc, budgetItem) => {
    if (Number(budgetItem.amount) > 0) {
      return acc + Number(budgetItem.amount)
    }
    return acc
  }
  const budgetDiffItems = (values) => {
    const added = data?.budgetItems?.filter(({ id: idData }) => !values?.some(({ id: idField }) => idData === idField))
    const removed = values?.budgetItems?.filter(({ id: idField }) => !data?.some(({ id: idData }) => idData === idField))
    return [added, removed]
  }
  const totalDiffBudget = (values, curr) => {
    const [added, removed] = budgetDiffItems(values)
    return [...values, ...added]
      ?.filter(({ id: idData }) => !removed?.some(({ id: idRemoved }) => idData === idRemoved))
      ?.filter(it => it.currency === curr)
      ?.reduce(totalBudgetReducer, 0)
  }
  const totalBudget = (values) => {
    const [added, removed] = budgetDiffItems(values)
    return [...values, ...added]
      ?.filter(({ id: idData }) => !removed?.some(({ id: idRemoved }) => idData === idRemoved))
      ?.reduce(totalBudgetReducer, 0)
  }
  const updateTransactions = (items, setName) => {
    dispatch({
      type: actionTypes.SAVE_FIELDS,
      noSync: true,
      sectionIndex: 6,
      fields: {
        ...fields,
        [setName]: items
      }
    })
  }
  const handleOnDataFetching = (name, total, callback) => {
    const length = Math.ceil(total / 30)
    const promises = []
    Array
      .from({ length })
      .forEach((_, px) => {
        promises.push(api.get(`${endpoints.section6[name]}?page=${px + 1}&project=${projectId}&format=json`))
      })
    Promise
      .all(promises)
      .then((res) => {
        const results = res?.flatMap((r) => r.data)?.flatMap((r) => r?.results)
        callback(results)
      })
  }
  const handleOnPage = (page, setName) => {
    const invertKey = invert(sectionKey)
    const sName = invertKey[setName]
    const updatePanel = {
      ...activePanel,
      [sName]: {
        ...activePanel[sName],
        page
      }
    }
    setActivePanel(updatePanel)
    api
      .get(`${endpoints.section6[setName]}?page=${page}&project=${projectId}&format=json`)
      .then((res) => {
        const { results } = res.data
        updateTransactions(results, setName)
      })
  }
  const handleOnActivePanel = () => {
    const setName = sectionKey[sectionName] || 'transactions'
    const items = chunk(data[setName], 30)
    const ftx = items
      ?.map((_, tx) => {
        const ix = items[tx]?.findIndex((ts) => ts.id === parseInt(sectionID, 10))
        return {
          page: tx + 1,
          index: `${ix}`
        }
      })
      ?.filter((tx) => (tx.index >= 0))
    updateTransactions(items[ftx[0]?.page - 1], setName)
    dispatch({
      type: actionTypes.VALIDATION_SYNC,
      sectionIndex: 6
    })
    setActivePanel({
      ...activePanel,
      [sectionName]: ftx[0]
    })
    if ((ftx[0].index > 5) || sectionName === 'transaction') {
      document
        .querySelector(`#${setName}-${ftx[0].index}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }
  const handleOnSearch = (keyword, setName) => {
    const dataFiltering = data[setName]?.filter((d) => {
      const fieldKey = amountKey[setName]
      return (`${d[fieldKey]}`.includes(keyword))
    })
    updateTransactions(dataFiltering, setName)
    setSearch({
      ...search,
      [setName]: keyword
    })
  }

  useEffect(() => {
    handleOnDataFetching('transactions', pagination?.transactions, setTransactions)
    handleOnDataFetching('budgetItems', pagination?.budgetItems, setBudgetItems)
  }, [])

  useEffect(() => {
    if (
      preload &&
      (
        data.transactions.length === pagination.transactions &&
        data.budgetItems.length === pagination.budgetItems
      )
    ) {
      setPreload(false)
      if (!isEmpty(sectionName) && !isEmpty(sectionID)) {
        handleOnActivePanel()
      }
    }
  }, [preload, data, fields, pagination, activePanel, sectionName, sectionID])

  return (
    <div className="finance view">
      <SectionContext.Provider value="section6">
        <FinalForm
          onSubmit={() => { }}
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
              <Skeleton loading={(preload && !isEmpty(sectionID) && !isEmpty(sectionName))} active>
                <BudgetItems
                  formPush={push}
                  validations={validations}
                  total={pagination?.budgetItems}
                  currentPage={activePanel?.budget?.page}
                  activeKey={activePanel?.budget?.index}
                  budgetItems={data?.budgetItems}
                  onPage={handleOnPage}
                  onSearch={handleOnSearch}
                  {...{
                    mixedCurrencies,
                    totalDiffBudget,
                    totalBudget
                  }}
                />
              </Skeleton>
              {fieldExists('countryBudgetItems') && (
                <Aux>
                  <h3>{t('Country budget items')}</h3>
                  <Item label={<InputLabel optional tooltip={t('Enter an IATI code for the common functional classification or country system (this allows for common codes, country-specific codes, or any other classification agreed between countries and donors) see: <a href="http://iatistandard.org/201/codelists/BudgetIdentifierVocabulary/" target="_blank">http://iatistandard.org/201/codelists/BudgetIdentifierVocabulary/</a>.')}>{t('Vocabulary')}</InputLabel>}>
                    <FinalField
                      name="countryBudgetVocabulary"
                      control="select"
                      options={[
                        { value: '1', label: 'IATI' },
                        { value: '2', label: t('Country Chart of Accounts') },
                        { value: '3', label: t('Other Country System') },
                        { value: '4', label: t('Reporting Organisation') },
                        { value: '5', label: t('Other') }
                      ]}
                      withEmptyOption
                    />
                  </Item>
                  <CountryBudgetItems formPush={push} />
                </Aux>
              )}
              {fieldExists('transactions') && (
                <Skeleton loading={(preload && !isEmpty(sectionID) && !isEmpty(sectionName))} active>
                  <Transactions
                    total={pagination?.transactions}
                    currentPage={activePanel.transaction.page}
                    activeKey={activePanel.transaction.index}
                    {...{
                      validations,
                      loadingOrgs,
                      currency,
                      orgs,
                      formPush: push,
                      onSearch: handleOnSearch,
                      onPage: (page) => handleOnPage(page, 'transactions')
                    }}
                  />
                </Skeleton>
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
  } }) => ({ fields, validations, currency, pagination, projectId, saving }),
  mapDispatchToProps
)(React.memo(Finance, shouldUpdateSectionRoot))
