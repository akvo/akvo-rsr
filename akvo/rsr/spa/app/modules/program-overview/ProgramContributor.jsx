/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react'
import { Collapse, Empty, Icon } from 'antd'
import { useTranslation } from 'react-i18next'
import { groupBy, sumBy } from 'lodash'
import classNames from 'classnames'
import { connect } from 'react-redux'

import { setNumberFormat } from '../../utils/misc'
import countriesDict from '../../utils/countries-dict'
import ExpandIcon from '../program/ExpandIcon'
import api from '../../utils/api'
import ApprovedUpdates from '../program/ApprovedUpdates'
import ValueComments from './ValueComments'
import ProjectSummary from '../program/ProjectSummary'
import { findCountries, findPartners, findProjects, getStatusFiltering } from './utils/filters'
import * as actions from '../program/store/actions'
import { getAllCountries } from './utils/query'
import { createdAtFormatted } from '../../utils/dates'

const { Panel } = Collapse

const ProgramContributor = ({
  id: periodID,
  dataId,
  pinned,
  type,
  fetched,
  updates,
  openedItem,
  filtering,
  contributors,
  actualValue,
  scoreOptions,
  setContributors,
  onChange
}) => {
  const { t } = useTranslation()
  const [preload, setPreload] = useState(true)
  const [fetching, setFetching] = useState(true)
  const [contribKey, setContribKey] = useState(['0'])

  const { hasContrib, hasPartner, hasCountry } = getStatusFiltering(filtering)

  useEffect(() => {
    if (preload && fetched === undefined) {
      setPreload(false)
      const ids = [
        ...contributors?.map((cb) => cb.id),
        ...contributors?.flatMap((cb) => cb?.contributors)?.map((cb) => cb.id)
      ].join(',')
      api
        .get(`/program/${dataId}/indicator_updates_by_period_id/?format=json&ids=${ids}`)
        .then(res => {
          const groupUpdates = groupBy(res.data, 'period')
          const updateItems = Object.keys(groupUpdates)?.map((_key) => {
            const item = contributors?.flatMap((cb) => [cb, ...cb?.contributors])?.find((c) => `${c.id}` === _key) || {}
            const total = type === 'quantitative' ? sumBy(groupUpdates[_key], 'value') : 0
            return {
              ...item,
              updates: groupUpdates[_key],
              total
            }
          })
          const projects = contributors?.map((cb) => {
            const findUpdate = updateItems.find((u) => u?.id === cb.id) || {}
            if (cb?.contributors?.length && Object.keys(findUpdate).length === 0) {
              const childs = cb.contributors.map((it) => {
                const findChild = updateItems.find((u) => u?.id === it.id) || {}
                return ({
                  ...it,
                  updates: findChild?.updates || [],
                  total: parseInt(findChild?.total || 0, 10)
                })
              })
              const grandTotal = sumBy(childs, 'total')
              return ({
                ...cb,
                contributors: childs,
                total: grandTotal,
                updates: []
              })
            }
            return ({
              ...cb,
              updates: findUpdate?.updates || [],
              total: findUpdate?.total || 0
            })
          })
          setContributors(periodID, projects)
          setFetching(false)
        })
        .catch(() => {
          setFetching(false)
        })
    }
    if (fetched === undefined && !preload && !fetching) {
      setFetching(true)
      setPreload(true)
    }
  }, [updates, fetched, fetching, preload])

  return contributors.length
    ? (
      <Collapse
        onChange={(values) => {
          setContribKey(values)
          onChange(values)
        }}
        activeKey={contribKey}
        className="contributors-list"
        expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
        accordion
      >
        {contributors?.sort((a, b) => b.total - a.total)?.map((cb, _index) => {
          const totalParentValues = sumBy(cb.updates, 'value')
          const subCountries = getAllCountries(cb?.contributors, filtering)
          const homeSelected = findCountries(filtering, cb)
          const homeClass = (hasCountry && (homeSelected || !contribKey))
          const homeCountry = ((hasCountry && (contribKey || (subCountries.length === 0 && cb.country))) || (!hasCountry && cb.country))
            ? ` ${countriesDict[cb.country.isoCode]}`
            : subCountries?.length === 1
              ? ` ${subCountries.pop()}`
              : subCountries.length === 0 ? null : ` ${subCountries.length} ${t('country_s', { count: subCountries.length })}`
          const activePartner = findPartners(filtering, cb)
          const activeContributor = findProjects(filtering, cb)
          return (
            <Panel
              key={_index}
              className={classNames(type, { pinned: pinned === _index })}
              header={(
                <>
                  <div className="title">
                    <h4 className={classNames({ 'color-contributors': activeContributor })}>{cb.projectTitle}</h4>
                    <p>
                      {cb.projectSubtitle && <span className={classNames({ 'color-partners': activePartner })}>{cb.projectSubtitle}</span>}
                      {homeCountry && (
                        <span className={classNames({ 'color-countries': homeClass })}>
                          <Icon type="environment" />
                          {homeCountry}
                        </span>
                      )}
                      &nbsp;
                      {cb?.contributors?.length > 0 && <b>{t('nsubcontributors', { count: cb.contributors.length })}</b>}
                      <b>&nbsp;</b>
                    </p>
                  </div>
                  {fetched && (
                    <ProjectSummary
                      indicatorType={type}
                      aggFilteredTotal={actualValue}
                      actualValue={cb.total}
                      updatesValue={totalParentValues}
                      {...{ ...cb, openedItem, scoreOptions, _index }}
                    />
                  )}
                </>
              )}
            >
              {(type === 'qualitative' && scoreOptions == null) && <ApprovedUpdates items={cb.updates} />}
              <ul className="sub-contributors">
                {cb?.contributors?.map(subproject => (
                  <li key={subproject.id}>
                    <div style={{ maxWidth: '95%' }}>
                      <h5 className={classNames({ 'color-contributors': (hasContrib) })}>{subproject.projectTitle}</h5>
                      <p>
                        {subproject.projectSubtitle && <span className={classNames({ 'color-partners': hasPartner })}>{subproject.projectSubtitle}</span>}
                        <span className={classNames({ 'color-countries': hasCountry })}>
                          {(subproject.country) && (
                            <>
                              <Icon type="environment" />
                              {` ${countriesDict[subproject.country.isoCode]}`}
                            </>
                          )}
                        </span>
                      </p>
                    </div>
                    <div className={classNames('value', `score-${subproject.scoreIndex ? subproject.scoreIndex + 1 : 1}`, { score: type === 'qualitative' && scoreOptions != null })}>
                      {type === 'quantitative' && (
                        <>
                          <b>{setNumberFormat(subproject.total)}</b>
                          <small>{cb.total ? Math.round((subproject.total / cb.total) * 100 * 10) / 10 : 0}%</small>
                        </>
                      )}
                      {(type === 'qualitative' && scoreOptions != null) && (
                        <div className="score-box">Score {subproject.scoreIndex || 0 + 1}</div>
                      )}
                      {subproject?.updates?.length > 0 &&
                        <div className="updates-popup">
                          <header>{subproject.updates.length} approved updates</header>
                          <ul>
                            {subproject.updates.map(update => (
                              <li key={update.id}>
                                <span>{createdAtFormatted(update.createdAt)}</span>
                                <span>{`${update?.userDetails?.firstName} ${update?.userDetails?.lastName}`}</span>
                                {update.value && <b>{setNumberFormat(update.value)}</b>}
                                {update.scoreIndex != null && <b><small>Score {update.scoreIndex ? update.scoreIndex + 1 : 1}</small></b>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      }
                    </div>
                    {(type === 'qualitative' && scoreOptions == null) && <ApprovedUpdates items={subproject.updates} />}
                  </li>
                ))}
              </ul>
              {(type === 'quantitative' || scoreOptions != null) && <ValueComments items={cb.updates} />}
            </Panel>
          )
        })}
      </Collapse>
    )
    : (
      <>
        {(fetching && fetched === undefined) ? 'Loading...' : <Empty />}
      </>
    )
}

export default connect(
  null, actions
)(ProgramContributor)
