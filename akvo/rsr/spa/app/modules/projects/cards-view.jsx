/* global window, document */
import React, { useEffect, useRef, useState } from 'react'
import { Card, Icon, Tag, Tooltip, Spin, BackTop, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import ConditionalLink from './conditional-link'
import COUNTRIES from '../../utils/countries.json'

const countryDict = {}
COUNTRIES.forEach(({ name, code }) => { countryDict[code.toLowerCase()] = name })

const ProjectCard = ({ project, showNewFeature }) => {
  const { t } = useTranslation()
  const cardBody = useRef()
  const h3 = useRef()
  const [isCompact, setIsCompact] = useState(false)
  const [titleRows, setTitleRows] = useState(-1)
  const sectors = project.sectors.filter(it => it.codeLabel)
  const listOfUniqueCountries =
    [
      ...project.locations.map(it => countryDict[it.isoCode]),
      ...project.recipientCountries.map(it => countryDict[it.country.toLowerCase()])
    ]
      .reduce((acc, val) => { if (acc.indexOf(val) === -1) return [...acc, val]; return acc }, [])
  useEffect(() => {
    if (cardBody.current) {
      const restHeight = cardBody.current.clientHeight - h3.current.clientHeight - 40 /* top */
      const maxTitleHeight = 230 - restHeight
      if (maxTitleHeight < h3.current.clientHeight) {
        setIsCompact(true)
        setTitleRows(Math.floor(maxTitleHeight / 25))
      }
    }
  }, [])
  const HWrapper = ({ title, children }) => isCompact ? <Tooltip title={title}>{children}</Tooltip> : children
  return (
    <li>
      <Card key={project.id}>
        <div className="top" ref={ref => { if (ref) { cardBody.current = ref.parentNode } }}>
          <Icon type={project.isPublic ? 'eye' : 'eye-invisible'} />
          <div className="status">
            {project.isPublic ? 'public' : 'private'}, {project.status}
            {(project.useProjectRoles && showNewFeature) &&
              <Tooltip placement="right" overlayClassName="member-access-tooltip" title={<span><i>Only these members can access: </i><br /><div className="divider" />{project.roles.map(role => <span><b>{role.name}</b> | <i>{role.role}</i><br /></span>)}</span>}>
                <span className={classNames('access', { inaccessible: project.restricted })}>, <b>restricted</b></span>
              </Tooltip>
            }
            {(!project.useProjectRoles && showNewFeature) &&
              <Tooltip title={<span>Members of all project partners have access</span>}>
                <span className="access">, unrestricted</span>
              </Tooltip>
            }
          </div>
        </div>
        <ConditionalLink record={project}>
          <HWrapper title={project.title}>
            <h3 ref={ref => { h3.current = ref }} className={isCompact ? `compact n${titleRows}-rows` : undefined}>{project.title !== '' ? project.title : t('Untitled project')}</h3>
          </HWrapper>
        </ConditionalLink>
        {project.subtitle !== '' && <small>{project.subtitle}</small>}
        {sectors.length > 0 &&
          <div className="sectors">
            <div className="label">Sectors:</div>
            <div className="list">
              {sectors.length < 3 && sectors.map(sector => <Tag size="small">{sector.codeLabel}</Tag>)}
              {sectors.length >= 3 && sectors.map(sector => {
                const Wrapper = sector.codeLabel.split(' - ')[1] ? () => <Tooltip title={sector.codeLabel.split(' - ')[1]}><Tag size="small">{sector.codeLabel.split(' - ')[0]}...</Tag></Tooltip> : ({ children }) => children
                return <Wrapper><Tag size="small">{sector.codeLabel.split(' - ')[0]}</Tag></Wrapper>
              })}
            </div>
          </div>
        }
        {project.parent && (
          <div className="parent">
            {(project.parent !== null && !project.parent.isLead) && [
              <div className="label">Contributes to:</div>,
              <Link to={`/hierarchy/${project.id}`}>{project.parent.title}</Link>
            ]}
            {(project.parent !== null && project.parent.isLead) && [
              <div className="label">Program:</div>,
              <Link to={`/programs/${project.parent.id}`}>{project.parent.title}</Link>
            ]}
          </div>
        )}
        {listOfUniqueCountries.length > 0 &&
          <div className="bottom">
            <Icon type="environment" /> <span>{listOfUniqueCountries.join(', ')}</span>
          </div>
        }
      </Card>
    </li>
  )
}

class CardsView extends React.Component {
  state = {
    page: 1
  }
  componentDidMount() {
    window.onscroll = debounce(() => {
      const { loading, hasMore, onShowMore } = this.props
      if (loading || !hasMore) return
      // Checks that the page has scrolled to the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.scrollHeight
      ) {
        onShowMore(this.state.page + 1)
        this.setState({ page: this.state.page + 1 })
      }
    }, 100)
    if (this.props.setRef) {
      this.props.setRef(this)
    }
  }
  componentWillUnmount() {
    window.onscroll = null
  }
  resetPage = () => {
    this.setState({ page: 1 })
  }
  render() {
    const { dataSource, loading, showNewFeature } = this.props
    return (
      <div>
        {(dataSource.length === 0 && !loading) && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        <ul className="cards-view">
          {dataSource.map(project => <ProjectCard {...{ project, showNewFeature }} />)}
          {loading &&
            <div className="loading">
              <Spin size="large" />
            </div>
          }
        </ul>
        <BackTop />
      </div>
    )
  }
}

export default CardsView
