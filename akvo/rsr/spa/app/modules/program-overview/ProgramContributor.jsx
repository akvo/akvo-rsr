/* eslint-disable no-restricted-globals */
import React, { useState } from 'react'
import { Collapse, Icon } from 'antd'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import moment from 'moment'

import { getPercentage, setNumberFormat } from '../../utils/misc'
import countriesDict from '../../utils/countries-dict'
import ExpandIcon from '../../components/ExpandIcon'
import ApprovedUpdates from '../program/ApprovedUpdates'
import ValueComments from './ValueComments'
import ProjectSummary from '../program/ProjectSummary'
import { findCountries, findPartners, findProjects, getStatusFiltering } from '../program/utils/filters'
import { getAllCountries } from '../program/utils/query'
import ActualValueApi from './ActualValueApi'
import ActualValue from '../program/ActualValue'
import ContribUpdatesApi from './ContribUpdatesApi'

const { Panel } = Collapse

const ProgramContributor = ({
  id: periodID,
  pinned,
  type,
  fetched,
  openedItem,
  filtering,
  contributors,
  actualValue,
  scoreOptions,
  onChange
}) => {
  const { t } = useTranslation()
  const [contribKey, setContribKey] = useState(['0'])

  const { hasContrib, hasPartner, hasCountry } = getStatusFiltering(filtering)

  return (
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
      {contributors?.sort((a, b) => b.actualValue - a.actualValue)?.map((cb, _index) => {
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
                <div className="title" data-id={cb.id}>
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
                    actualValue={cb.actualValue}
                    updatesValue={actualValue}
                    {...{ ...cb, openedItem, scoreOptions, _index }}
                  />
                )}
              </>
            )}
          >
            <ActualValueApi periodID={periodID} contributors={cb?.contributors} />
            {(cb?.updates === undefined) && <ContribUpdatesApi {...cb} />}
            {(type === 'qualitative' && scoreOptions == null) && <ApprovedUpdates items={cb.updates} />}
            <ul className="sub-contributors">
              {cb?.contributors?.map(subproject => (
                <li key={subproject.id} data-id={subproject.id}>
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
                        <ActualValue {...subproject} />
                        <small>
                          {cb.actualValue ? getPercentage(subproject.actualValue, cb.actualValue) : 0}%
                        </small>
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
                              <span>{moment(update.createdAt).format('DD MMM YYYY')}</span>
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
}

export default ProgramContributor
