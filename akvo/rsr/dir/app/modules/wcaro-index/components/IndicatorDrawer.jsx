import React, { useEffect, useState } from 'react'
import { Drawer, Row, Col, Typography, Skeleton, Form, Icon, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { DropdownCountry } from './DropdownCountry'
import { SelectDropdown } from './SelectDropdown'
import { ListPeriods } from './ListPeriods'
import { QuantityLabel } from './QuantityLabel'
import { handleOnCountry } from '../../../utils/misc'

const { Title, Text } = Typography

const IndicatorDrawer = ({
  result,
  onClose,
  visible,
  periods,
  countries: cs,
  selectedPeriod: sp,
  selectedCountries: sc,
  setSelectedPeriod,
  setLoading
}) => {
  const { t } = useTranslation()
  const [country, setCountry] = useState(null)
  const [period, setPeriod] = useState(null)

  const handleOnClear = () => {
    if (sc.length > 1 || cs.length > 1) setCountry(null)
    setPeriod(null)
    setSelectedPeriod(null)
    setLoading(true)
  }
  useEffect(() => {
    if (sp && !period) setPeriod(sp)
    if (!sp && period) setPeriod(null)
  }, [period, sp])
  const countries = sc.length ? sc : cs
  const nCountry = country ? country.name : countries.length
  return (
    <Drawer
      width={720}
      onClose={() => {
        setCountry(null)
        onClose()
      }}
      visible={visible}
    >
      <Skeleton loading={!(result && result.progress)}>
        <QuantityLabel {...{ ...result, countries, nCountry }} />
        <Title level={4}>{result ? result.title : ''}</Title>
        <Row gutter={[8, 8]}>
          <Col lg={8} xs={10}>
            <Form>
              <Form.Item className="fw-label-filter" label={t('See values for period')}>
                <SelectDropdown
                  label={t('All Periods')}
                  style={{
                    width: '100%',
                    textAlign: 'left'
                  }}
                  {...{
                    items: periods,
                    selected: period,
                    onClick: setPeriod
                  }}
                />

              </Form.Item>
            </Form>
          </Col>
          <Col lg={8} xs={10}>
            <Form>
              <Form.Item className="fw-label-filter" label={t('Country')}>
                <DropdownCountry
                  style={{
                    width: '100%',
                    textAlign: 'left'
                  }}
                  {...{
                    countries,
                    country,
                    onCountry: (key) => {
                      const ct = handleOnCountry(key)
                      setCountry(ct)
                    }
                  }}
                />
              </Form.Item>
            </Form>
          </Col>
          <Col span={4} style={{ paddingTop: 45, paddingLeft: 5 }}>
            {(period || country) ? (
              <Button onClick={handleOnClear} type="link">
                <Icon type="close" className="wcaro-text success" />
                <Text className="wcaro-text success" strong>
                  Clear Filters
                </Text>
              </Button>
            ) : null}
          </Col>
        </Row>
        <ListPeriods {...{ ...result, country, period, sc, collapse: true }} />
      </Skeleton>
    </Drawer>
  )
}

export default IndicatorDrawer
