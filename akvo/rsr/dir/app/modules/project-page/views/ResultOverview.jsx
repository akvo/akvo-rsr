import React, { useState, useEffect } from 'react'
import {
  Button,
  Divider,
  Typography,
  Skeleton,
  Modal,
  Row,
  Col
} from 'antd'

import uniq from 'lodash/uniq'
import moment from 'moment'

import {
  queryIndicators,
  queryResultOverview,
  queryIndicatorPeriod,
  queryIndicatorPeriodData
} from '../queries'
import Section from '../../components/Section'
import Filter from '../../components/Filter'
import PopPeriods from '../components/PopPeriods'
import Results from './Results'

const { Title, Paragraph, Text } = Typography

const ResultOverview = ({
  projectId,
  project,
  items,
  setItems
}) => {
  const isEmpty = (!items)
  const [loading, setLoading] = useState(isEmpty)
  const [preload, setPreload] = useState({
    indicators: isEmpty,
    periods: isEmpty,
    updates: isEmpty
  })
  const [search, setSearch] = useState(null)
  const [indicators, setIndicators] = useState([])
  const [periods, setPeriods] = useState([])
  const [updates, setUpdates] = useState([])
  const [optionPeriods, setOptionPeriods] = useState([])
  const [period, setPeriod] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [filter, setFilter] = useState({
    visible: false,
    apply: false
  })

  const { data: dataIndicators, size: sizeIds, setSize: setSizeIds } = queryIndicators(projectId)
  const { data: dataPeriods, size: sizePds, setSize: setSizePds } = queryIndicatorPeriod(projectId)
  const { data: dataPeriodUpdates, size: sizePu, setSize: setSizePu } = queryIndicatorPeriodData(projectId)

  const { data: dataResults } = queryResultOverview(projectId)
  const { results } = dataResults || {}

  const handleOnPeriod = (value) => {
    if (value) {
      const [periodStart, periodEnd] = value.split(/\s+-+\s/g)
      setPeriod({
        periodStart: moment(periodStart.trim(), 'DD MMM YYYY').format('YYYY-MM-DD'),
        periodEnd: moment(periodEnd.trim(), 'DD MMM YYYY').format('YYYY-MM-DD')
      })
    } else {
      setPeriod(null)
    }
  }

  const handleOnIndicatorSearch = (indicator) => {
    if (search) {
      return indicator.title.toLowerCase().includes(search.toLowerCase())
    }
    return indicator
  }

  const handleOnCancelFilter = () => {
    setPeriod(null)
    setFilter({ apply: false, visible: false })
  }

  useEffect(() => {
    if (dataIndicators && preload.indicators) {
      const lastIndicator = dataIndicators.slice(-1)[0]
      const { next } = lastIndicator || {}
      setSizeIds(sizeIds + 1)
      if (!next) {
        setIndicators(dataIndicators.flatMap((di) => di.results))
        setPreload({
          ...preload,
          indicators: false
        })
      }
    }
    if (dataPeriods && preload.periods) {
      const lastPeriod = dataPeriods.slice(-1)[0]
      const { next } = lastPeriod || {}
      setSizePds(sizePds + 1)
      if (!next) {
        const opds = dataPeriods.flatMap((dp) => dp.results)
        const op = opds.map((o) => {
          const periodStart = moment(o.periodStart, 'YYYY-MM-DD').format('DD MMM YYYY')
          const periodEnd = moment(o.periodEnd, 'YYYY-MM-DD').format('DD MMM YYYY')
          return `${periodStart} - ${periodEnd}`
        })
        setOptionPeriods(uniq(op))
        setPeriods(opds)
        setPreload({
          ...preload,
          periods: false
        })
      }
    }
    if (dataPeriodUpdates && preload.updates) {
      const lastUpdate = dataPeriodUpdates.slice(-1)[0]
      const { next } = lastUpdate || {}
      setSizePu(sizePu + 1)
      if (!next) {
        setUpdates(dataPeriodUpdates.flatMap((du) => du.results))
        setPreload({
          ...preload,
          updates: false
        })
      }
    }
    if (loading && (!preload.indicators && !preload.periods && !preload.updates)) {
      const rs = results.map((r) => ({
        ...r,
        indicators: indicators.filter((i) => i.result === r.id).map((i) => ({
          ...i,
          periods: periods.filter((p) => p.indicator === i.id).map((p) => ({
            ...p,
            updates: updates.filter((u) => u.period === p.id)
          }))
        }))
      }))
      setItems(rs)
      setLoading(false)
    }
  }, [loading, preload, dataPeriods, dataIndicators, dataPeriodUpdates])

  const fullItems = loading
    ? null
    : items.map((i) => ({
      ...i,
      indicators: i.indicators
        .map((indicator) => ({
          ...indicator,
          periods: indicator.periods.filter((p) => {
            if (period && filter.apply) {
              return (
                p.periodStart === period.periodStart &&
                p.periodEnd === period.periodEnd
              )
            }
            return p
          })
        }))
        .filter((indicator) => (indicator.periods.length))
    }))
  const amountPeriods = fullItems
    ? fullItems
      .flatMap((i) => i.indicators)
      .filter(handleOnIndicatorSearch)
      .flatMap((i) => i.periods).length
    : 0
  return (
    <>
      <Section>
        <Title className="text-dark bold">Results Overview</Title>
        <Paragraph className="hero">
          {`See what ${project ? project.title : 'Project'} is achieving. Participate in their efforts to openly and transparently share how they have progressed in reaching their targets.`}
        </Paragraph>
      </Section>
      <Section>
        <Filter className="mb-3">
          <Filter.Input
            loading={loading}
            visible={filter.visible}
            placeholder="Search indicator title"
            onChange={(val) => setSearch(val)}
            onPopOver={() => setFilter({ ...filter, visible: !filter.visible })}
            onOpenModal={() => setOpenModal(true)}
          >
            <Row gutter={[8, 8]}>
              <Col>
                <Text strong>Applied Filter Results</Text>
              </Col>
              <Col>
                <Divider />
              </Col>
              <Col>
                <PopPeriods periods={optionPeriods} onChange={handleOnPeriod} />
              </Col>
              <Col className="text-right">
                <Row type="flex" justify="end">
                  <Col span={4}>
                    <Button size="small" type="link" onClick={handleOnCancelFilter}>
                      Cancel
                    </Button>
                  </Col>
                  <Col span={4}>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => setFilter({ apply: true, visible: false })}
                    >
                      Apply
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Filter.Input>
          <Filter.Info
            isFiltering={(period)}
            amount={amountPeriods}
            loading={loading}
            onClear={() => setPeriod(null)}
            label="Periods"
          >
            <Row gutter={[8, 8]}>
              <Col>
                {period && <Text type="secondary">PERIODS</Text>}
              </Col>
              {period && (
                <Col>
                  <Filter.Tag
                    onClose={(e) => {
                      e.preventDefault()
                      setPeriod(null)
                    }}
                  >
                    {period.periodStart} - {period.periodEnd}
                  </Filter.Tag>
                </Col>
              )}
            </Row>
          </Filter.Info>
        </Filter>
        <Skeleton loading={!(results)} paragraph={{ rows: 12 }} active>
          {results && <Results onSearch={handleOnIndicatorSearch} {...{ results, search, setItems }} items={fullItems} />}
        </Skeleton>
      </Section>
      <Modal
        title="Applied Filter Results"
        visible={openModal}
        onCancel={() => {
          setOpenModal(false)
          handleOnCancelFilter()
        }}
        onOk={() => {
          setOpenModal(false)
          setFilter({ apply: true, visible: false })
        }}
      >
        <PopPeriods periods={optionPeriods} onChange={handleOnPeriod} />
      </Modal>
    </>
  )
}

export default ResultOverview
