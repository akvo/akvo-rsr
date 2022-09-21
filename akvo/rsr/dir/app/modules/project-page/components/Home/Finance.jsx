import React from 'react'
import { Divider, Skeleton } from 'antd'
import { Row, Col } from 'react-awesome-styled-grid'
import { tint } from 'tint-shade-color'
import { useSelector } from 'react-redux'

import orderBy from 'lodash/orderBy'
import chunk from 'lodash/chunk'
import styled from 'styled-components'

import { queryBudget, queryPartnershipFunds } from '../../queries'
import { Button, Flex, Label, Line, Square, Text, Title, Vstack } from '../../../components'
import { dateText, setNumberFormat } from '../../../../utils/misc'
import SemiDoughnut from '../SemiDoughnut'

const Legend = styled(Flex)`
  margin: 8px 0;
  align-items: center;
  b {
    font-size: ${props => props.theme.font.size.sm};
    line-height: 18px;
  }
`

const ChartWrapper = styled(Flex)`
  width: 100%;
  justify-content: center;
  svg {
    max-width: 500px;
    width: 100%;
    .semi-doughnut-text {
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s;
    }
    &:hover {
      .semi-doughnut-text {
        opacity: 1;
      }
    }
  }
  @media (max-width: 576px) {
    margin-top: 64px;
  }
`

const Finance = ({
  dateStartPlanned,
  dateStartActual,
  projectId,
  budget: projectBudget,
  funds: totalFunded,
  iatiProfileUrl,
  dateEndActual,
  dateEndPlanned,
}) => {
  const { data: dataFunds, error: errFunds } = queryPartnershipFunds(projectId)
  const { results: funds } = dataFunds || {}
  const { data: dataBudget, error: errBudget } = queryBudget(projectId)
  const { results: budgets } = dataBudget || {}
  const { data: updates } = useSelector((state) => state.projectUpdates)
  const currency = budgets ? budgets.slice(0, 1).map((b) => b.currencyLabel.split(/\s+/)[0]).shift() : ''
  let funders = []
  if (funds) {
    funders = funds
      .filter((fd) => fd.partnerType === 'funding')
      .map((fd, fx) => {
        const percent = totalFunded ? fd.fundingAmount / totalFunded * 100 : 0
        let degree = fx === 0 ? 180 : parseInt(180 * percent / 100, 10).toFixed(0)
        degree = degree === '0' ? 1 : degree
        return {
          ...fd,
          degree,
          label: fd.organisationName,
          value: percent
        }
      })
    funders = orderBy(funders, ['value'], ['desc']).map((fd, fx) => ({
      ...fd,
      color: tint('#FCAB26', fx / 10)
    }))
  }
  const fundPartners = chunk(funders || [], 4)
  const loading = ((!dataFunds && !errFunds) && (!dataBudget && !errBudget))
  const colSize = updates.length ? 10 : 12
  return (
    <Skeleton paragraph={{ rows: 5 }} loading={loading} active>
      <Row justify="center">
        <Col lg={colSize} md={colSize} sm={8} xs={4}>
          <Flex direction="column" gap="24px">
            <Title as="h2" type="bold" size="sm">
              FINANCES
              <Line />
            </Title>
            <Row justify="space-between">
              <Col lg={7} md={6} sm={8} xs={4} justify="start">
                <Vstack space="4px">
                  <Row>
                    <Col lg={6} md={12} sm={8} xs={4}>
                      <Label>
                        <Text as="strong" type="bold">PROJECT BUDGET :</Text>
                        <Text as="b">{currency ? `${setNumberFormat(projectBudget)} ${currency}` : ': -'}</Text>
                      </Label>
                    </Col>
                    <Col lg={6} md={12} sm={8} xs={4}>
                      <Label>
                        <Text as="strong" type="bold">PERIOD : </Text>
                        {(
                          (dateStartPlanned || dateStartActual) &&
                          (dateEndActual || dateEndPlanned)
                        ) && (
                            <Text as="b">
                              {`${dateText(dateStartPlanned || dateStartActual)} - ${dateText(dateEndActual || dateEndPlanned)}`}
                            </Text>
                          )}
                      </Label>
                    </Col>
                  </Row>
                  <Label>
                    <Text as="strong" type="bold">TOTAL FUNDED : </Text>
                    <Text as="b" className="primary">
                      {currency ? `${setNumberFormat(totalFunded)} ${currency}` : ': -'}
                    </Text>
                  </Label>
                  <Label>
                    <Text as="strong" type="bold">FUNDERS : </Text>
                  </Label>
                  <Row>
                    {Object.keys(fundPartners).map(value => (
                      <Col lg={6} md={12} sm={8} xs={4} key={value}>
                        {fundPartners[value].map((el) => (
                          <Legend key={el.id} gap="18px">
                            <Square color={el.color} />
                            <Text as="b">{el.organisationName}</Text>
                          </Legend>
                        ))}
                      </Col>
                    ))}
                  </Row>
                </Vstack>
              </Col>
              <Col lg={5} md={6} sm={8} xs={4} justify="center" align="center">
                <Skeleton paragraph={{ rows: 5 }} loading={loading} active>
                  <ChartWrapper>
                    {funders.length > 0 && (
                      <SemiDoughnut
                        data={funders}
                        innerRadius={70}
                        outerRadius={175}
                        currency={currency}
                      />
                    )}
                  </ChartWrapper>
                </Skeleton>
              </Col>
            </Row>
            {iatiProfileUrl && <Divider />}
            {iatiProfileUrl && (
              <Button href={iatiProfileUrl} blank>
                View IATI Profile
              </Button>
            )}
          </Flex>
        </Col>
      </Row>
    </Skeleton>
  )
}

export default Finance
