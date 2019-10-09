/* global window, document */
import React from 'react'
import { Card, Icon, Tag, Tooltip, Spin, BackTop } from 'antd'
import { withTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import ConditionalLink from './conditional-link'

class CardsView extends React.Component{
  state = {
    page: 1
  }
  componentDidMount(){
    window.onscroll = debounce(() => {
      const { loading, hasMore, onShowMore} = this.props
      if (loading || !hasMore) return
      // Checks that the page has scrolled to the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.scrollHeight
      ) {
        onShowMore(this.state.page + 1)
        this.setState({ page: this.state.page + 1})
      }
    }, 100)
    if(this.props.setRef){
      this.props.setRef(this)
    }
  }
  componentWillUnmount(){
    window.onscroll = null
  }
  resetPage = () => {
    this.setState({ page: 1 })
  }
  render() {
    const { dataSource, loading, t } = this.props
    return (
      <div>
      <ul className="cards-view">
        {dataSource.map(project => {
          const sectors = project.sectors.filter(it => it.codeLabel)
          return (
            <li>
              <Card key={project.id}>
                <div className="top">
                  <Icon type={project.isPublic ? 'eye' : 'eye-invisible'} />
                  <div className="status">{project.isPublic ? 'public' : 'private'}, {project.status}</div>
                </div>
                <ConditionalLink record={project}>
                  <h3>{project.title !== '' ? project.title : t('Untitled project')}</h3>
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
                    <div className="label">Parent:</div>
                    <div className="list">
                      <ConditionalLink record={project.parent}>{project.parent.title}</ConditionalLink>
                    </div>
                  </div>
                )}
                {project.locations.length > 0 &&
                  <div className="bottom">
                    <Icon type="environment" /> <span>{project.locations.map(it => it.country).join(', ')}</span>
                  </div>
                }
              </Card>
            </li>
            )
        }
        )}
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

export default withTranslation()(CardsView)
