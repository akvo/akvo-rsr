import React, { useEffect, useState } from 'react'
import { Skeleton } from 'antd'
import groupBy from 'lodash/groupBy'
import styled from 'styled-components'
import classNames from 'classnames'

import { queryPartnershipLinks } from '../../queries'
import { getLogo } from '../../../../utils/misc'
import { Button, Flex, Line, Space, Title } from '../../../components'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 768px;
  margin: 0 auto;
  .partner img {
    width: 125px;
    height: 85px;
    object-fit: contain;
  }
  .partner {
    float: left;
    margin: 16px;
  }
  button {
    color: ${props => props.theme.color.gray['900']};
    border-bottom: 3px solid transparent;
    &.active, &:hover  {
      background: transparent;
      color: ${props => props.theme.color.primary['700']};
      border-bottom: 3px solid ${props => props.theme.color.primary['700']};
    }
  }
  @media (min-width: 577px) and (max-width: 1024px) {
    button {
      font-size: ${props => props.theme.font.size.xs};
    }
  }
  @media (max-width: 576px) {
    button {
      width: 50%;
      padding: 16px;
      font-size: ${props => props.theme.font.size.xs};
    }
  }
`

const Partner = ({ projectId }) => {
  const [activeKey, setActivekey] = useState(null)
  const [selected, setSeleted] = useState([])
  const [partners, setPartners] = useState([])
  const [preload, setPreload] = useState(true)

  const { data, error } = queryPartnershipLinks(projectId)
  const { results } = data || {}
  const groupRoles = results ? groupBy(results, 'iatiOrganisationRoleLabel') : []
  const uniqResults = results
    ? results
      .filter((r) => r.organisation)
      .filter((v, i, a) => a.findIndex(v2 => (v2.organisation.id === v.organisation.id)) === i)
    : []

  const getLogoPartner = partner => partner.organisation && partner.organisation.logo
    ? getLogo(partner.organisation.logo)
    : `https://placehold.co/125x85?text=${partner.organisation.name}`

  const handleOnClick = key => {
    setActivekey(key)
    const itemKey = Object.keys(groupRoles)
      .filter((_, nx) => nx === parseInt(key, 10))
      .shift()
    const items = groupRoles[itemKey] || []
    setSeleted(items)
  }

  useEffect(() => {
    if (preload && results && (partners.length !== uniqResults.length)) {
      setPreload(false)
      setPartners(uniqResults)
    }
    if (selected.length && !preload && (partners.length !== results.length)) {
      setPartners(results)
    }
  }, [preload, error, results, uniqResults, partners, selected])

  const loading = (!data && !error)
  return (
    <Skeleton loading={loading} active>
      <Space>
        <Flex direction="column">
          <Title as="h2" type="bold" size="sm" align="center">
            PARTNERS
            <Line center />
          </Title>
          <Wrapper>
            {Object.keys(groupRoles).map((name, nx) => (
              <Button
                onClick={() => handleOnClick(nx)}
                className={classNames({
                  active: activeKey === nx
                })}
                border="0"
                key={nx}
              >
                {name}
              </Button>
            ))}
          </Wrapper>
          <Wrapper>
            {
              partners
                .filter((r) => {
                  if (selected.length) {
                    return selected.find((s) => s.id === r.id)
                  }
                  return r
                })
                .map((r, rx) => (
                  <div className="partner" key={rx}>
                    <img src={getLogoPartner(r)} alt={r.organisation ? r.organisation.name : r.iatiOrganisationRoleLabel} />
                  </div>
                ))
            }
          </Wrapper>
        </Flex>
      </Space>
    </Skeleton>
  )
}

export default Partner
