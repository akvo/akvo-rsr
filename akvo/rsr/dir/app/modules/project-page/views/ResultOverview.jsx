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
import { useSelector, useDispatch } from 'react-redux'
import { Container } from 'react-awesome-styled-grid'

import { queryResultOverview } from '../queries'
import { Section } from '../../components'
import Filter from '../../components/Filter'
import PopPeriods from '../components/PopPeriods'
import Results from './Results'
import { appendResults } from '../../../features/results/resultSlice'
import { removeSelectedPeriod, selectPeriod, submitFilter } from '../../../features/periods/periodSlice'
import { setActiveKeys } from '../../../features/collapse/collapseSlice'
import { filterAllFetched, filterResultIndicators } from '../../../utils/misc'

const { Title, Paragraph, Text } = Typography

const ResultOverview = ({
  projectId,
  project,
}) => {
  const { selected: selectedPeriods, applyFilter } = useSelector((state) => state.periods)
  const results = useSelector((state) => state.results)
  const isEmpty = (results.length === 0)

  const [loading, setLoading] = useState(isEmpty)
  const [search, setSearch] = useState(null)

  const [openModal, setOpenModal] = useState(false)
  const [openFilter, setOpenFilter] = useState(false)

  const dispatch = useDispatch()

  const { data, error } = queryResultOverview(projectId)
  const { results: dataResults, count: numberOfResults } = data || {}
  const allFetched = (numberOfResults === results.filter((r) => filterAllFetched(r)).length)
  const numberOfFilteredIndicators = results
    .filter((r) => ((applyFilter || search) && allFetched) ? filterResultIndicators(r.indicators, selectedPeriods, search).length : r)
    .flatMap((r) => r.indicators).length

  const handleOnCancelFilter = () => {
    dispatch(selectPeriod([]))
    dispatch(submitFilter(false))
    dispatch(setActiveKeys({ key: 'results', values: [] }))
    if (search) {
      setSearch(null)
    }
    setOpenFilter(false)
  }

  const handleOnApplyFilter = () => {
    dispatch(submitFilter(true))
    /**
     * Open all result panels to retrieve data then
     * filter the indicators
     */
    const values = results.map((r) => r.id)
    dispatch(setActiveKeys({
      key: 'results',
      values
    }))
    setOpenFilter(false)
  }

  useEffect(() => {
    if (numberOfResults > 0 && results.length === 0) {
      const values = dataResults.map((d) => d.id).slice(0, 1)
      dispatch(setActiveKeys({ key: 'results', values }))
      dispatch(appendResults(dataResults))
    }
    if ((loading && results.length) || (loading && numberOfResults === 0) || (error && loading)) {
      setLoading(false)
    }
    if (applyFilter && selectedPeriods.length === 0) {
      handleOnCancelFilter()
    }
  }, [
    results,
    loading,
    dataResults,
    numberOfResults,
    error,
    applyFilter,
    selectedPeriods,
  ])
  return (
    <div id="rsr-results-overview">
      <Section primary>
        <Container>
          <Title className="page-title">Results Overview</Title>
          <Paragraph className="hero">
            {`See what ${project ? project.title : 'Project'} is achieving. Participate in their efforts to openly and transparently share how they have progressed in reaching their targets.`}
          </Paragraph>
        </Container>
      </Section>
      <Section>
        <Container>
          <Filter className="mb-3">
            <Filter.Input
              loading={loading}
              visible={openFilter}
              value={search}
              placeholder="Search indicator title"
              onChange={(val) => setSearch(val)}
              onPopOver={() => setOpenFilter(!openFilter)}
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
                  {!openModal && <PopPeriods visible={openFilter} />}
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
                        onClick={handleOnApplyFilter}
                      >
                        Apply
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Filter.Input>
            {applyFilter && (
              <Filter.Info
                isFiltering={(selectedPeriods.length)}
                amount={numberOfFilteredIndicators}
                loading={loading}
                onClear={handleOnCancelFilter}
                label="Periods"
              >
                <Row gutter={[8, 8]} style={{ display: 'block' }}>
                  <Col>
                    {(selectedPeriods.length > 0) && <Text type="secondary">PERIODS</Text>}
                  </Col>
                  <Col>
                    {selectedPeriods.map((p, px) => (
                      <Filter.Tag onClose={(e) => {
                        e.preventDefault()
                        dispatch(removeSelectedPeriod(p))
                      }}
                        key={px}
                      >
                        {p}
                      </Filter.Tag>
                    ))}
                  </Col>
                </Row>
              </Filter.Info>
            )}
          </Filter>
          <Skeleton loading={loading} paragraph={{ rows: 12 }} active>
            <Results results={results} search={search} allFetched={allFetched} />
          </Skeleton>
        </Container>
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
          handleOnApplyFilter()
        }}
      >
        <PopPeriods visible={openModal} />
      </Modal>
    </div>
  )
}

export default ResultOverview
