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

import { queryResultOverview } from '../queries'
import Section from '../../components/Section'
import Filter from '../../components/Filter'
import PopPeriods from '../components/PopPeriods'
import Results from './Results'
import { appendResults } from '../../../features/results/resultSlice'
import { removeSelectedPeriod, selectPeriod } from '../../../features/periods/periodSlice'

const { Title, Paragraph, Text } = Typography

const ResultOverview = ({
  projectId,
  project,
}) => {
  const { options: optionPeriods, selected: selectedPeriods } = useSelector((state) => state.periods)
  const results = useSelector((state) => state.results)
  const isEmpty = (results.length === 0)

  const [loading, setLoading] = useState(isEmpty)
  const [search, setSearch] = useState(null)

  const [openModal, setOpenModal] = useState(false)
  const [filter, setFilter] = useState({ visible: false, apply: false })

  const dispatch = useDispatch()

  const { data } = queryResultOverview(projectId)
  const { results: dataResults } = data || {}

  const handleOnIndicatorSearch = (indicator) => {
    if (search) {
      return indicator.title.toLowerCase().includes(search.toLowerCase())
    }
    return indicator
  }

  const handleOnCancelFilter = () => {
    dispatch(selectPeriod([]))
    setFilter({ apply: false, visible: false })
  }

  useEffect(() => {
    if (dataResults && results.length === 0) {
      dispatch(appendResults(dataResults))
    }
    if (loading && results.length) {
      setLoading(false)
    }
  }, [results, loading, dataResults])
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
            onPopOver={() => {
              setFilter({ ...filter, visible: !filter.visible })
              if (!filter.visible === false) {
                handleOnCancelFilter()
              }
            }}
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
                <PopPeriods />
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
          {filter.apply && (
            <Filter.Info
              isFiltering={(selectedPeriods.length)}
              amount={optionPeriods.length}
              loading={loading}
              onClear={handleOnCancelFilter}
              label="Periods"
            >
              <Row gutter={[8, 8]}>
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
          <Results onSearch={handleOnIndicatorSearch} results={results} search={search} />
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
        <PopPeriods />
      </Modal>
    </>
  )
}

export default ResultOverview
