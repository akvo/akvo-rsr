/* global document */
import React from 'react'
import { Collapse, Select } from 'antd'
import moment from 'moment'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

import countriesDict from '../../utils/countries-dict'
import { setNumberFormat } from '../../utils/misc'
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

const { Panel } = Collapse
const { Option } = Select

const ProjectHeader = ({
  country,
  contributors,
  projectTitle,
  projectSubtitle,
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <>
      <div className="title">
        <h4>{projectTitle}</h4>
        <p>
          {projectSubtitle && <span>{projectSubtitle}</span>}
          {country && <span><Icon type="environment" /> {countriesDict[country.isoCode]}</span>}
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
  filteredCountries,
  actualValue,
  targetValue,
  targetsAt,
  countryFilter,
  aggFilteredTotalTarget,
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
}) => {
  const { t } = useTranslation()
  return (
    <>
      <div>
        <h5>{printIndicatorPeriod(periodStart, periodEnd)}</h5>
        <ul className="small-stats">
          <li><b>{filteredContributors.length}</b> {t('contributor_s', { count: filteredContributors.length })}</li>
          <li><b>{filteredCountries.length}</b> {t('country_s', { count: filteredCountries.length })}</li>
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
                  of <b>{setNumberFormat(countryFilter.length > 0 ? aggFilteredTotalTarget : targetValue)}</b> target
                </span>
              )}
            </div>
            {targetsAt && targetsAt === 'period' && targetValue > 0 && <TargetCharts {...{ actualValue, targetValue }} />}
          </div>
        )
      }
      {
        (indicatorType === 'quantitative' && filteredContributors.filter(it => it.actualValue > 0).length > 1) && (
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
  countryFilter,
  filteredContributors,
  filteredCountries,
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
    period?.disaggregationTargets?.filter(it => it.value).length <= 1 &&
    period?.disaggregationContributions?.filter(it => it.value).length <= 1
  )
  return (
    <Panel
      {...props}
      key={periodIndex}
      className={classNames(indicatorType, {
        single: filteredContributors.length === 1 || filteredContributors.filter(it => it.actualValue > 0).length === 0
      })}
      header={(
        <PeriodHeader
          {...{
            ...period,
            disaggTooltipRef,
            pinned,
            indicatorType,
            filteredContributors,
            filteredCountries,
            actualValue,
            targetValue,
            targetsAt,
            countryFilter,
            aggFilteredTotalTarget,
            hasDisaggregations,
            clickBar,
            mouseEnterBar,
            mouseLeaveBar,
          }}
          callback={clickOnViewAll}
        />
      )}
    >
      {(period.contributors.length > 1 && !countryFilter) &&
        <div className="filters">
          <Select
            className="country-filter"
            mode="multiple"
            allowClear
            placeholder={<span><Icon type="filter" /> Filter countries</span>}
            onChange={handleCountryFilter}
            value={countriesFilter}
          >
            {period.countries.map(it => <Option value={it.isoCode}>{countriesDict[it.isoCode]} ({period.contributors.filter(_it => _it.country && _it.country.isoCode === it.isoCode).length})</Option>)}
          </Select>
          {countriesFilter.length > 0 && [
            <span className="filtered-project-count label">{period.contributors.filter(it => { if (countriesFilter.length === 0) return true; return countriesFilter.findIndex(_it => it.country && it.country.isoCode === _it) !== -1 }).length} projects</span>,
            <div className="total">
              <span className="label">Filtered {Math.round((aggFilteredTotal / period.actualValue) * 100 * 10) / 10}% of total</span>
              <b>{String(aggFilteredTotal).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b>
            </div>
          ]}
        </div>
      }
      <div ref={ref => { listRef.current = ref }}>
        {period.contributors.length === 0 &&
          <span>No data</span>
        }
        <Collapse
          onChange={handleAccordionChange}
          defaultActiveKey={period.contributors.length === 1 ? '0' : null}
          className="contributors-list"
          expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
          accordion
        >
          {
            filteredContributors
              ?.sort((a, b) => b.actualValue - a.actualValue)
              ?.map((project, _index) => {
                const approvedItems = project?.updates?.filter(it => it.status && it.status.code === 'A')
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
                          scoreOptions
                        }}
                      />
                    )}
                  >
                    {(indicatorType === 'qualitative' && scoreOptions == null) && <ApprovedUpdates items={approvedItems} />}
                    <ul className="sub-contributors">
                      {
                        project.contributors.map(subproject => {
                          const approves = subproject.updates.filter(it => it.status && it.status.code === 'A')
                          return (
                            <li key={subproject.id} className={`subproject ${subproject?.job?.status}`}>
                              <div className="max-w-1180">
                                <h5>{subproject.projectTitle}</h5>
                                <p>
                                  {subproject.projectSubtitle && <span>{subproject.projectSubtitle}</span>}
                                  {subproject.country && <span><Icon type="environment" /> {countriesDict[subproject.country.isoCode]}</span>}
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
                                {subproject.updates.length > 0 &&
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

export default ProgramPeriod
