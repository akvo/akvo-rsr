import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Collapse,
  Typography,
  Badge,
  Icon,
  Row,
  Col,
  Button
} from 'antd'
import { Redirect } from 'react-router-dom'
import sum from 'lodash/sum'

import StickyClass from './sticky-class'
import Result from './result'
import countriesDict from '../../utils/countries-dict'
import Filter from '../../components/Filter'
import Highlighted from '../../components/Highlighted'
import ExpandIcon from './ExpandIcon'
import { filterByContries, filterByKeywords, filterByPeriods, filterByProjects } from './filters'

const { Panel } = Collapse
const { Text, Title } = Typography

const PanelHeader = ({ count, text }) => (
  <div className="header-panel-filter">
    <div>
      <Text strong>{text}</Text>
    </div>
    <div>
      <Badge count={count} className="badge-filter" />
    </div>
  </div>
)

const ProgramView = ({
  contributors,
  partners,
  periods,
  preload,
  params,
  loading,
  results,
  targetsAt,
  countryOpts,
  setResults
}) => {
  const { t } = useTranslation()
  const [popToggle, setPopToggle] = useState(false)
  const [activeFilter, setActiveFilter] = useState([])
  const [activeResult, setActiveResult] = useState([])
  const [search, setSearch] = useState(null)
  const [filtering, setFiltering] = useState({
    countries: {
      items: [],
      apply: false
    },
    contributors: {
      items: [],
      apply: false
    },
    periods: {
      items: [],
      apply: false
    },
    partners: {
      items: [],
      apply: false
    }
  })

  const handleOnCancel = (key) => {
    setActiveFilter(activeFilter.filter((af) => af !== key))
  }
  const handleOnApply = (fieldName, key) => {
    setFiltering({
      ...filtering,
      [fieldName]: {
        ...filtering[fieldName],
        apply: true
      }
    })
    handleOnCancel(key)
    setPopToggle(false)
    setActiveResult(results.map((r) => r.id))
  }
  const handleOnSetItems = (fieldName, items = []) => {
    const fields = { partners, contributors, countries: countriesDict }
    const data = items.map((it, ix) => {
      const find = fieldName === 'periods' ? null : Object.values(fields[fieldName]).find((d) => d.id === it)
      return find || {
        id: fieldName === 'periods' ? ix + 1 : it,
        value: fieldName === 'periods'
          ? it
          : fields[fieldName] ? fields[fieldName][it] || it : it
      }
    })
    setFiltering({
      ...filtering,
      [fieldName]: {
        ...filtering[fieldName],
        key: fieldName,
        items: data
      }
    })
  }
  const handleOnClear = () => {
    if (search) {
      setSearch(null)
    }
    setFiltering({
      countries: {
        items: [],
        apply: false
      },
      contributors: {
        items: [],
        apply: false
      },
      periods: {
        items: [],
        apply: false
      },
      partners: {
        items: [],
        apply: false
      }
    })
    setActiveResult([])
  }
  const handleOnCloseTag = (fieldName, id) => {
    setFiltering({
      ...filtering,
      [fieldName]: {
        ...filtering[fieldName],
        items: filtering[fieldName]?.items?.filter((d) => d.id !== id)
      }
    })
  }
  const handleByKeywords = (result) => {
    if (result.indicatorTitles.length && search) {
      const titleIndicators = result.indicatorTitles.filter((i) => filterByKeywords(i, search))
      return (titleIndicators.length || (filterByKeywords(result?.title, search)))
    }
    return result
  }
  const countries = countryOpts?.map((c) => ({ id: c, value: countriesDict[c] }))
  const totalItems = sum(Object.values(filtering).map((v) => v.items.length))
  const totalFilter = Object.values(filtering).filter(({ apply }) => (apply)).length

  useEffect(() => {
    if (!totalItems && totalFilter) {
      handleOnClear()
    }
  }, [totalFilter, totalItems])

  let totalMatches = 0
  if (search) {
    totalMatches = results.filter((r) => filterByKeywords(r.title, search)).length
    totalMatches += preload
      ? results.flatMap((r) => r.indicatorTitles).filter((d) => filterByKeywords(d, search)).length
      : results.flatMap((r) => r?.indicators)?.filter((i) => filterByKeywords(i.title, search)).length
  }
  if (
    (filtering.periods.apply && filtering.periods.items.length) ||
    (filtering.countries.apply && filtering.countries.items.length) ||
    (filtering.contributors.apply && filtering.contributors.items.length)
  ) {
    totalMatches += results
      ?.flatMap((r) => r?.indicators)
      ?.filter((i) => search ? filterByKeywords(i.title, search) : i)
      ?.filter((i) => {
        if (i?.periods?.length) {
          return i
            .periods
            .filter((p) => {
              if (p?.contributors) {
                return p
                  .contributors
                  .filter((cb) => filterByProjects(cb, filtering))
                  .filter((cb) => filterByContries(cb, filtering))
                  .length
              }
              return filterByPeriods(p, filtering)
            })
            .length
        }
        return i
      })
      ?.length
  }
  if (!loading && results.length > 0) {
    return (
      <>
        <Filter>
          <Filter.Input
            value={search}
            placeholder="Search title"
            visible={popToggle}
            loading={loading}
            count={totalItems}
            onChange={setSearch}
            onPopOver={() => setPopToggle(!popToggle)}
          >
            <Row gutter={[8, 8]} style={{ width: 400 }}>
              <Col lg={16}>
                <Text strong>Applied Filter Results</Text>
              </Col>
              <Col lg={8} className="total-filter">
                <Title level={4}>{totalItems}</Title>
                <Button type="link" onClick={handleOnClear}><Icon type="close-circle" /></Button>
              </Col>
              <Col span={24} className="collapse-filter">
                <Collapse activeKey={activeFilter} onChange={setActiveFilter} bordered={false} expandIconPosition="right">
                  <Panel header={<PanelHeader count={filtering.countries.items.length} text="Location" />} key="1">
                    <Filter.Items
                      data={countries}
                      picked={filtering.countries.items}
                      title="Select project Location(s)"
                      onCancel={() => handleOnCancel('1')}
                      onApply={() => handleOnApply('countries', '1')}
                      onSetItems={(items) => handleOnSetItems('countries', items)}
                    />
                  </Panel>
                  <Panel header={<PanelHeader count={filtering.periods.items.length} text="Reporting Period" />} key="2">
                    <Filter.Dropdown
                      data={periods}
                      picked={filtering.periods.items}
                      title="Select project period(s)"
                      onCancel={() => handleOnCancel('2')}
                      onApply={() => handleOnApply('periods', '2')}
                      onSetItems={(items) => handleOnSetItems('periods', items)}
                    />
                  </Panel>
                  <Panel header={<PanelHeader count={filtering.contributors.items.length} text="Contribution Projects" />} key="3">
                    <Filter.Items
                      data={contributors}
                      picked={filtering.contributors.items}
                      title="Select project contributor(s)"
                      onCancel={() => handleOnCancel('3')}
                      onApply={() => handleOnApply('contributors', '3')}
                      onSetItems={(items) => handleOnSetItems('contributors', items)}
                    />
                  </Panel>
                </Collapse>
              </Col>
            </Row>
          </Filter.Input>
          {(search || totalFilter > 0) && (
            <div className="filter-selected-bar flex-between">
              <div className="filter-selected-bar">
                <div className="bar-column">
                  <div className="info">
                    {
                      (preload && !search)
                        ? <Text strong>Calculating...</Text>
                        : (
                          <>
                            <h2>{totalMatches?.toString()?.padStart(2, '0')}</h2>
                            <Text strong>Matches</Text>
                          </>
                        )
                    }
                  </div>
                </div>
                {Object.values(filtering)
                  .filter(({ apply, items }) => (apply && items.length))
                  .map(({ items, key }) => (
                    <div className="bar-column">
                      <Row>
                        <Col className="title">
                          <strong>{key?.toUpperCase()}</strong>
                        </Col>
                        <Col>
                          {items?.map(it => (
                            <Filter.Tag
                              className={`color-${key}`}
                              key={it.id}
                              onClose={() => {
                                handleOnCloseTag(key, it.id)
                              }}
                            >
                              {it?.value}
                            </Filter.Tag>
                          ))}
                        </Col>
                      </Row>
                    </div>
                  ))}
              </div>
              <div className="bar-column">
                <Button type="link" icon="close-circle" onClick={handleOnClear}>Clear all</Button>
              </div>
            </div>
          )}
        </Filter>
        <Collapse activeKey={activeResult} onChange={setActiveResult} bordered={false} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
          {results.filter(handleByKeywords).map(result => {
            const count = search
              ? result.indicatorTitles.filter((i) => filterByKeywords(i, search)).length
              : result.indicatorCount
            return (
              <Panel
                key={result.id}
                header={(
                  <StickyClass offset={20}>
                    <h1><Highlighted text={result.title} highlight={search} /></h1>
                    <div><i>{result.type}</i><span>{t('nindicators', { count })}</span></div>
                  </StickyClass>
                )}
              >
                <Result programId={params.projectId} {...{ ...result, results, setResults, targetsAt, preload, search, filtering, totalFilter }} />
              </Panel>
            )
          })}
        </Collapse>
      </>
    )
  }
  if (!loading) return <Redirect to={`/programs/${params.projectId}/editor`} />
  return null
}

export default ProgramView
