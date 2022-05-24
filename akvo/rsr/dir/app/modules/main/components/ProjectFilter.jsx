import React, { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Button,
  Divider,
  Typography,
  Modal
} from 'antd'
import PopDirectory from './PopDirectory'
import Filter from '../../components/Filter'

const { Text } = Typography

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
  const [openModal, setOpenModal] = useState(false)

  const colSpan = (search.sector.length && search.organisation.length) ? 12 : 24
  const handleOnClose = (modelName, item) => onApply({ [modelName]: search[modelName].filter((it) => it !== item) })
  const handleOnSubmit = (e) => {
    e.preventDefault()
    onApply()
  }
  const handleOnCancelModal = () => {
    setOpenModal(false)
    setFilter({ apply: false, visible: false })
  }
  const handleOnOkModal = () => {
    setOpenModal(false)
    onApply()
  }
  useEffect(() => {
    if (filter.apply && (!(search.sector.length)) && !(search.organisation.length) && !search.query) {
      setSearch({ ...search, results: null })
      setFilter({ visible: false, apply: false })
      onClear()
    }
  }, [filter, search])
  return (
    <Row>
      <Col lg={{ span: 22, offset: 1 }}>
        <Filter>
          <form action="#" onSubmit={handleOnSubmit}>
            <Filter.Input
              visible={filter.visible}
              onChange={onSearch}
              placeholder="Find a project"
              loading={loading}
              value={search.query}
              onPopOver={() => setFilter({ apply: false, visible: !filter.visible })}
              onOpenModal={() => setOpenModal(true)}
            >
              <Row>
                <Col>
                  <Text strong>Applied Filter Results</Text>
                </Col>
                <Col>
                  <Divider />
                </Col>
                <Col>
                  <PopDirectory
                    {...{
                      organisations,
                      sectors,
                      loading,
                      search,
                      setSearch
                    }}
                  />
                </Col>
                <Col style={{ paddingTop: 16 }}>
                  <Row type="flex" justify="end">
                    <Col span={6}>
                      <Button
                        type="link"
                        onClick={() => {
                          setSearch({
                            sector: [],
                            organisation: []
                          })
                          setFilter({ apply: false, visible: false })
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                    <Col span={4}>
                      <Button
                        type="primary"
                        onClick={onApply}
                      >
                        Apply
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
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
                          const findSector = sectors.find((s) => s.id === sc.key)
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
                                {findOrg.name || og}
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
        <Modal
          title="Applied Filter Results"
          visible={openModal}
          onOk={handleOnOkModal}
          onCancel={handleOnCancelModal}
        >
          <PopDirectory
            {...{
              organisations,
              sectors,
              loading,
              search,
              setSearch
            }}
          />
        </Modal>
      </Col>
    </Row>
  )
}

export default ProjectFilter
