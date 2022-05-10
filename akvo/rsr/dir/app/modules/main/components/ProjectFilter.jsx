import React, { useEffect } from 'react'
import { Row, Col, Typography } from 'antd'
import PopDirectory from './PopDirectory'
import Filter from '../../components/Filter'

const { Title, Text } = Typography

const ProjectFilter = ({
  search,
  filter,
  organisations,
  sectors,
  loading,
  setSearch,
  setFilter,
  amount,
  onClear,
  onSearch,
  onApply
}) => {
  const colSpan = (search.sector.length && search.organisation.length) ? 12 : 24
  const handleOnClose = (modelName, item) => {
    setSearch({
      ...search,
      [modelName]: search[modelName].filter((it) => it !== item)
    })
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    onApply()
  }

  useEffect(() => {
    if (filter.apply && (!(search.sector.length)) && !(search.organisation.length) && !search.query) {
      setFilter({ visible: false, apply: false })
    }
  }, [filter, search])
  return (
    <Row>
      <Col className="text-center mb-3">
        <Title>Active Projects</Title>
      </Col>
      <Col>
        <Filter>
          <form action="#" onSubmit={handleOnSubmit}>
            <Filter.Input
              visible={filter.visible}
              onChange={onSearch}
              onPopOver={() => setFilter({ apply: false, visible: !filter.visible })}
              placeholder="Find a project"
              loading={loading}
              value={search.query}
            >
              <PopDirectory
                onCancel={() => setFilter({ apply: false, visible: false })}
                onApply={onApply}
                {...{
                  organisations,
                  sectors,
                  loading,
                  search,
                  setSearch
                }}
              />
            </Filter.Input>
          </form>
          {(filter.apply && (search.sector || search.organisation)) && (
            <Filter.Info
              amount={amount}
              loading={loading}
              onClear={onClear}
              label="Projects"
              isFiltering
            >
              <Row>
                {(filter.apply && search.sector && search.sector.length > 0) && (
                  <Col lg={colSpan} md={24}>
                    <Row gutter={[8, 8]}>
                      <Col span={24}>
                        <Text type="secondary">SECTOR</Text>
                      </Col>
                      <Col span={24}>
                        {search.sector.map((sc, sx) => {
                          const findSector = sectors.find((s) => s.id === sc)
                          return findSector
                            ? (
                              <Filter.Tag key={sx} onClose={() => handleOnClose('sector', sc)}>
                                {findSector.name || sc}
                              </Filter.Tag>
                            )
                            : null
                        })}
                      </Col>
                    </Row>
                  </Col>
                )}
                {(filter.apply && search.organisation && search.organisation.length > 0) && (
                  <Col lg={colSpan} md={24}>
                    <Row gutter={[8, 8]}>
                      <Col span={24}>
                        <Text type="secondary">ORGANISATION</Text>
                      </Col>
                      <Col span={24}>
                        {search.organisation.map((og, ox) => {
                          const findOrg = organisations.find((o) => o.id === og.key)
                          return findOrg
                            ? (
                              <Filter.Tag key={ox} onClose={() => handleOnClose('organisation', og)}>
                                {findOrg.longName || og}
                              </Filter.Tag>
                            )
                            : null
                        })}
                      </Col>
                    </Row>
                  </Col>
                )}
              </Row>
            </Filter.Info>
          )}
        </Filter>
      </Col>
    </Row>
  )
}

export default ProjectFilter
