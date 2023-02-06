/* global document */
import React from 'react'
import { Collapse } from 'antd'
import moment from 'moment'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import uniqBy from 'lodash/uniqBy'

import countriesDict from '../../utils/countries-dict'
import { getFlatten, setNumberFormat } from '../../utils/misc'
import TargetCharts from '../../utils/target-charts'
import ApprovedUpdates from './ApprovedUpdates'
import Comments from './Comments'
import ExpandIcon from './ExpandIcon'
import ProjectSummary from './ProjectSummary'
import Disaggregations from './Disaggregations'
import Icon from '../../components/Icon'
import ActualValue from './ActualValue'
import AggregatedActual from './AggregatedActual'
import { printIndicatorPeriod } from '../../utils/dates'
import { getStatusFiltering } from './utils/filters'

const { Panel } = Collapse

const ProjectHeader = ({
  country,
  contributors,
  projectTitle,
  projectSubtitle,
  filtering,
  projectId,
  partners,
  ...props
}) => {
  const { t } = useTranslation()
  const { hasCountry } = getStatusFiltering(filtering)
  const cf = [country, ...getFlatten(contributors)?.map((cb) => cb?.country)?.filter((cb) => (cb?.isoCode))]
  const cl = uniqBy(cf, 'isoCode')
  const cs = hasCountry
    ? cl
      ?.filter((c) => filtering.countries.items.map((it) => it?.id).includes(c.isoCode))
      ?.map((c) => countriesDict[c.isoCode])
      ?.join(', ')
    : country ? countriesDict[country.isoCode] : null
  const hasContrib = filtering?.contributors?.items?.filter((it) => it?.id === projectId).length
  const hasPartner = filtering?.partners?.items?.filter((it) => Object.keys(partners)?.includes(`${it?.id}`))?.length
  return (
    <>
      <div className="title">
        <h4 className={classNames({ 'color-contributors': (hasContrib) })}>
          {projectTitle}
        </h4>
        <p>
          {projectSubtitle && (
            <span className={classNames({ 'color-partners': (hasPartner) })}>
              {projectSubtitle}
            </span>
          )}
          {country && (
            <span className={classNames({ 'color-countries': (hasCountry), 'single-country': (cl?.length === 1) })}>
              <Icon type="environment" />
              {
                (hasCountry && cl?.length > 3)
                  ? ` ${cl.length} ${t('country_s', { count: cl?.length })}`
                  : ` ${cs}`
              }
            </span>
          )}
          &nbsp;
          {contributors.length > 0 && <b>{t('nsubcontributors', { count: contributors.length })}</b>}
          <b>&nbsp;</b>
        </p>
      </div>
      <ProjectSummary contributors={contributors} {...props} />
    </>
  )
}

const PeriodHeader = ({
  disaggTooltipRef,
  pinned,
  indicatorType,
  filteredContributors,
  countries,
  actualValue,
  targetValue,
  targetsAt,
  hasDisaggregations,
  clickBar,
  mouseEnterBar,
  mouseLeaveBar,
  periodStart,
  periodEnd,
  disaggregationContributions,
  disaggregationTargets,
  periodId,
  callback,
  jobs,
  filtering,
}) => {
  const { t } = useTranslation()
  const { hasPeriod, hasCountry, hasContrib } = getStatusFiltering(filtering)
  const cn = hasCountry
    ? filtering?.countries?.items?.filter((it) => countries?.map((ct) => ct?.isoCode)?.includes(it?.id))?.length
    : countries?.length
  return (
    <>
      <div>
        <h5 className={classNames({ 'color-periods': (hasPeriod) })}>
          {printIndicatorPeriod(periodStart, periodEnd)}
        </h5>
        <ul className="small-stats">
          <li className={classNames({ 'color-contributors': (hasContrib) })}>
            <b className={classNames({ 'color-contributors': (hasContrib) })}>
              {filteredContributors?.length ? `${filteredContributors?.length} ` : ''}
            </b>
            {filteredContributors?.length ? t('contributor_s', { count: filteredContributors?.length }) : ''}
          </li>
          <li className={classNames({ 'color-countries': (hasCountry) })}>
            <b className={classNames({ 'color-countries': (hasCountry) })}>
              {`${cn || ''} `}
            </b>
            {cn ? t('country_s', { count: cn }) : ''}
          </li>
        </ul>
      </div>
      {
        (indicatorType === 'quantitative') && (
          <div className={classNames('stats', { extended: targetValue > 0 })}>
            {hasDisaggregations && (
              <Disaggregations
                {...{
                  disaggTooltipRef,
                  disaggregationContributions,
                  disaggregationTargets
                }}
              />
            )}
            <div className="stat value">
              <div className="label">aggregated actual</div>
              <AggregatedActual
                {...{
                  periodStart,
                  periodEnd,
                  periodId,
                  jobs,
                }}
                value={actualValue}
                total={filteredContributors?.length}
                callback={callback}
              />
              {targetsAt && targetsAt === 'period' && targetValue > 0 && (
                <span>
                  of <b>{setNumberFormat(targetValue)}</b> target
                </span>
              )}
            </div>
            {targetsAt && targetsAt === 'period' && targetValue > 0 && <TargetCharts {...{ actualValue, targetValue }} />}
          </div>
        )
      }
      {
        (indicatorType === 'quantitative' && filteredContributors?.filter(it => it.actualValue > 0)?.length > 1) && (
          <ul
            className={classNames('bar', {
              'contains-pinned': pinned !== -1
            })}
          >
            {filteredContributors.sort((a, b) => b.actualValue - a.actualValue).map((it, _index) =>
              <li
                key={_index}
                className={pinned === _index ? 'pinned' : undefined}
                style={{ flex: it.actualValue }}
                onClick={(e) => clickBar(_index, e)}
                onMouseEnter={(e) => mouseEnterBar(_index, setNumberFormat(it.actualValue), e)}
                onMouseLeave={(e) => mouseLeaveBar(_index, it.actualValue, e)}
              />
            )}
          </ul>
        )
      }
    </>
  )
}

const ProgramPeriod = ({
  listRef,
  tooltipRef,
  disaggTooltipRef,
  pinned,
  period,
  periodIndex,
  targetsAt,
  indicatorType,
  scoreOptions,
  filteredContributors,
  actualValue,
  targetValue,
  countriesFilter,
  handleCountryFilter,
  aggFilteredTotalTarget,
  aggFilteredTotal,
  openedItem,
  activePeriod,
  setActivePeriod,
  handleAccordionChange,
  filterRdr: filtering,
  ...props
}) => {
  const mouseEnterBar = (index, value, ev) => {
    if (pinned === index || !listRef.current) return
    listRef.current.children[0].children[index].classList.add('active')
    if (tooltipRef.current) {
      tooltipRef.current.innerHTML = `<div>${value}</div>`
      tooltipRef.current.style.opacity = 1
      const rect = ev.target.getBoundingClientRect()
      const bodyRect = document.body.getBoundingClientRect()
      tooltipRef.current.style.top = `${(rect.top - bodyRect.top) - 40}px`
      tooltipRef.current.style.left = `${rect.left + (rect.right - rect.left) / 2}px`
    }
  }

  const mouseLeaveBar = (index) => {
    if (!listRef.current) return
    listRef.current.children[0].children[index].classList.remove('active')
    tooltipRef.current.style.opacity = 0
  }

  const clickBar = (index, e) => {
    e.stopPropagation()
    if (listRef.current.children[0].children[index].classList.contains('ant-collapse-item-active') === false) {
      listRef.current.children[0].children[index].children[0].click()
    }
  }

  const clickOnViewAll = () => {
    setActivePeriod({
      period,
      popUp: !activePeriod?.popUp
    })
  }

  const hasDisaggregations = !(
    period?.disaggregationTargets?.filter(it => it.value)?.length <= 1 &&
    period?.disaggregationContributions?.filter(it => it.value)?.length <= 1
  )

  const { hasCountry, hasPartner } = getStatusFiltering(filtering)
  return (
    <Panel
      {...props}
      key={periodIndex}
      className={classNames(indicatorType, {
        single: filteredContributors?.length === 1 || filteredContributors?.filter(it => it.actualValue > 0)?.length === 0
      })}
      header={(
        <PeriodHeader
          {...{
            ...period,
            disaggTooltipRef,
            pinned,
            indicatorType,
            filteredContributors,
            actualValue,
            targetValue,
            targetsAt,
            aggFilteredTotalTarget,
            hasDisaggregations,
            clickBar,
            mouseEnterBar,
            mouseLeaveBar,
            filtering,
          }}
          callback={clickOnViewAll}
        />
      )}
    >
      <div ref={ref => { listRef.current = ref }}>
        {period.contributors.length === 0 &&
          <span>No data</span>
        }
        <Collapse
          onChange={handleAccordionChange}
          defaultActiveKey={['0']}
          className="contributors-list"
          expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
          accordion
        >
          {
            filteredContributors
              ?.sort((a, b) => b.actualValue - a.actualValue)
              ?.map((project, _index) => {
                const approvedItems = project?.updates?.filter(it => it.status && it.status.code === 'A') || []
                return (
                  <Panel
                    className={classNames(indicatorType, {
                      pinned: pinned === _index,
                      [project?.job?.status]: (project?.job?.status)
                    })}
                    key={_index}
                    header={(
                      <ProjectHeader
                        {...{
                          ...project,
                          _index,
                          indicatorType,
                          openedItem,
                          aggFilteredTotal,
                          scoreOptions,
                          filtering,
                        }}
                      />
                    )}
                  >
                    {(indicatorType === 'qualitative' && scoreOptions == null) && <ApprovedUpdates items={approvedItems} />}
                    <ul className="sub-contributors">
                      {
                        project.contributors.map(subproject => {
                          const approves = subproject?.updates?.filter(it => it.status && it.status.code === 'A')
                          const hasSubCb = filtering?.contributors?.items?.map((it) => it?.id)?.includes(subproject?.projectId)
                          const projectSubtitle = hasPartner
                            ? filtering?.partners?.items
                              ?.filter((it) => Object.keys(subproject?.partners)?.includes(`${it?.id}`))
                              ?.map((it) => it?.value)
                              ?.join(', ')
                            : subproject.projectSubtitle
                          return (
                            <li key={subproject.id} className={`subproject ${subproject?.job?.status || ''}`}>
                              <div className="max-w-1180">
                                <h5 className={classNames({ 'color-contributors': hasSubCb })}>
                                  {subproject?.projectTitle?.length > 1 ? subproject.projectTitle : 'Untitled project'}
                                </h5>
                                <p>
                                  <span className={classNames({ 'color-partners': hasPartner })}>
                                    {projectSubtitle}
                                  </span>
                                  {subproject.country && (
                                    <span className={classNames({ 'color-countries': (hasCountry) })}>
                                      <Icon type="environment" /> {countriesDict[subproject.country.isoCode]}
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div className={classNames('value', `score-${subproject.scoreIndex + 1}`, { score: indicatorType === 'qualitative' && scoreOptions != null })}>
                                {indicatorType === 'quantitative' && (
                                  <>
                                    <ActualValue {...subproject} />
                                    <small>{Math.round((subproject.actualValue / project.actualValue) * 100 * 10) / 10}%</small>
                                  </>
                                )}
                                {(indicatorType === 'qualitative' && scoreOptions != null) && (
                                  <div className="score-box">Score {subproject.scoreIndex + 1}</div>
                                )}
                                {subproject?.updates?.length > 0 &&
                                  <div className="updates-popup">
                                    <header>{subproject.updates.length} approved updates</header>
                                    <ul className={subproject?.job?.status}>
                                      {subproject.updates.map(update => (
                                        <li key={update?.id}>
                                          <span>{moment(update.createdAt).format('DD MMM YYYY')}</span>
                                          <span>{update.user.name}</span>
                                          {update.value && <b>{setNumberFormat(update.value)}</b>}
                                          {update.scoreIndex != null && <b><small>Score {update.scoreIndex + 1}</small></b>}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                }
                              </div>
                              {(indicatorType === 'qualitative' && scoreOptions == null) && <ApprovedUpdates items={approves} />}
                            </li>
                          )
                        })
                      }
                    </ul>
                    {(indicatorType === 'quantitative' || scoreOptions != null) && <Comments items={approvedItems} />}
                  </Panel>
                )
              })
          }
        </Collapse>
      </div>
    </Panel>
  )
}

export default connect(({ filterRdr }) => ({ filterRdr }), null
)(ProgramPeriod)
