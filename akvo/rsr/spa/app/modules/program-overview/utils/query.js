import { groupBy, sumBy, uniq, uniqBy } from 'lodash'

import countriesDict from '../../../utils/countries-dict'
import { getAllContributors, getShrinkContributors } from '../../../utils/misc'
import {
  findCountries,
  findPartners,
  findProjects,
  getStatusFiltering,
  hasAllCriteria,
  hasContribAndCountries,
  hasContribAndPartners,
  hasCountriesAndPartners,
  onlyHasContributors,
  onlyHasCountries,
  onlyHasPartners,
} from './filters'
/**
 * Get all countries based on selected countries
 *
 * @param {Array.<object>} contributors - Contributors of reporting period
 * @param {Object} filtering - Filter criteria - Filter types
 * @returns {Array}
 */
export const getAllCountries = (contributors, filtering) => {
  const { hasCountry } = getStatusFiltering(filtering)
  const countries = contributors
        ?.filter((c) => c?.country?.isoCode)
        ?.filter((c) => (hasCountry && findCountries(filtering, c)) || !hasCountry)
        ?.map((c) => countriesDict[c.country.isoCode] || null)
        ?.filter((c) => c)
  return uniq(countries)
}
/**
 * Get disaggregations on each contributor and order by value asc
 *
 * @param {Array.<object>} contributors
 * @returns {Array}
 */
const getDisaggregations = (contributors) =>
    contributors
        ?.map((c) => ({ ...c, updates: c?.updates || [] }))
        ?.flatMap((c) => c?.updates)
        ?.filter((u) => u?.disaggregations)
        ?.flatMap((u) => u?.disaggregations)
        ?.sort((a, b) => a.value - b.value)
/**
 * Get sum from data source based on field name
 *
 * @param {Array.<object>} data - Data source
 * @param {string} field - Key or field name
 * @param {number} decimalPlaces - Length of decimal places
 * @returns {number} - Sum result
 */
const getTheSumResult = (data, field, decimalPlaces = 3) =>
  Number(parseFloat(sumBy(data, field), 10).toFixed(decimalPlaces))

/**
 * Get ancestor of reporting periods contributors
 *
 * @param {Array.<object>} contributors
 * @param {number} id
 * @returns
 */
const getTopParent = (contributors, id) => {
  const obj = contributors?.find((c) => c.projectId === id)
  if (obj) {
    return obj.parentId === null ? obj : getTopParent(contributors, obj.parentId)
  }
  return obj
}
/**
 *
 * @param {Array.<object>} contributors
 * @param {Array.<object>} allItems
 * @returns
 */
const handleOnParentConcat = (contributors, allItems) => {
  const items = contributors?.flatMap((a) => {
    const parent = getTopParent(allItems, a.parentId)
    return [
      parent,
      {
        ...a,
        parentId: parent?.projectId,
      },
    ]
  })
  return uniqBy(items, 'projectId')?.filter((item) => item)
}
/**
 * Filter specific contributors based on active/selected criteria
 *
 * @param {Object} filtering - Filter criteria
 * @param {Array.<object>} contributors
 * @returns
 */
const handleOnFilteringContributors = (filtering, contributors) => {
  let allContributors = contributors?.sort((a, b) =>
        a?.projectTitle?.localeCompare(b?.projectTitle)
    )
  if (hasAllCriteria(filtering)) {
    allContributors = allContributors
            ?.filter((cb) => cb?.country)
            ?.filter(
                (cb) =>
                  findProjects(filtering, cb) &&
                    findCountries(filtering, cb) &&
                    findPartners(filtering, cb)
            )
  }
  if (onlyHasContributors(filtering)) {
    allContributors = allContributors?.filter((cb) => findProjects(filtering, cb))
  }

  if (hasContribAndCountries(filtering)) {
    allContributors = allContributors
            ?.filter((cb) => cb?.country)
            ?.filter((cb) => {
              return findProjects(filtering, cb) && findCountries(filtering, cb)
            })
  }

  if (onlyHasCountries(filtering)) {
    allContributors = allContributors
            ?.filter((cb) => cb?.country)
            ?.filter((cb) => findCountries(filtering, cb))
  }

  if (hasCountriesAndPartners(filtering)) {
    allContributors = allContributors
            ?.filter((cb) => cb?.country)
            ?.filter((cb) => {
              return findCountries(filtering, cb) && findPartners(filtering, cb)
            })
  }

  if (hasContribAndPartners(filtering)) {
    allContributors = allContributors?.filter((cb) => {
      return findProjects(filtering, cb) && findPartners(filtering, cb)
    })
  }

  if (onlyHasPartners(filtering)) {
    allContributors = allContributors?.filter(
            (cb) => cb?.partners && findPartners(filtering, cb)
        )
  }
  return allContributors
}

/**
 * Filter specific disaggregations based on active/selected criteria
 *
 * @param {Object} filtering - Filter criteria
 * @param {Array.<object>} disaggregations
 * @returns
 */
const handleOnFilteringDisaggregations = (filtering, disaggregations) => {
  const dsg = disaggregations?.filter((dg) => {
    if (
            dg?.category?.toLowerCase() === 'ct' &&
            filtering?.countries?.items?.length &&
            filtering?.countries?.apply
    ) {
      return (
        filtering.countries.items.filter((ci) => {
          const fc = ci?.value?.toLowerCase()
          const ct = dg?.type?.toLowerCase()
          const rx = new RegExp(`${fc}*`, 'g')
          return rx.test(ct) || ct === fc
        }).length > 0
      )
    }
    return dg
  })
  const dsgGroups = groupBy(dsg, 'category')
  const { hasAnyFilters } = getStatusFiltering(filtering)
  return Object.keys(dsgGroups)
        ?.map((dsgKey) => {
          const groupTypes = groupBy(dsgGroups[dsgKey], 'type')
          return Object.keys(groupTypes)
                ?.map((typeKey) => ({
                  ...(groupTypes[typeKey][0] || {}),
                  value: getTheSumResult(groupTypes[typeKey], 'value'),
                }))
                ?.filter((v) => (hasAnyFilters && v.value) || !hasAnyFilters)
                ?.sort((a, b) => a.value - b.value)
        })
        ?.flatMap((dg) => dg)
}

/**
 * Set selected Partner from filter criteria as the project's subtitle
 *
 * @param {Object} filtering - Filter criteria
 * @param {Object} cb - Selected contributor
 * @returns
 */
export const setProjectSubtitle = (filtering, cb) => {
  const { hasPartner } = getStatusFiltering(filtering)

  if (hasPartner) {
    const partners = Object.values(cb?.partners)?.filter((pr) =>
      filtering.partners.items.find((it) => it.value === pr)
        )

    const projectSubtitle = partners.length ? partners?.join(', ') : cb.projectSubtitle
    return { ...cb, projectSubtitle }
  }
  return cb
}


/**
 * Map each result based on search keywords
 *
 * @param {Object} r - Result
 * @param {string} search - Keyword
 * @returns
 */
export const handleOnMapSearching = (r, search) => {
  if (search) {
    const keyword = search?.toLowerCase()
    const findIndicators = r?.indicators
            ?.map((i) => ({
              ...i,
              matched: i?.title?.toLowerCase().indexOf(keyword) > -1,
            }))
            ?.filter((i) => i.matched)
    const findResult = r?.title?.toLowerCase()?.indexOf(keyword) > -1
    return {
      ...r,
      indicators: findResult && !findIndicators?.length ? r?.indicators : findIndicators,
      matched: findResult,
    }
  }
  return r
}

/**
 * Map each result to apply active filter criteria and search keywords
 *
 * @param {Object} r - Result
 * @param {Object} filtering - Filter criteria
 * @param {string} search
 * @returns
 */
export const handleOnMapFiltering = (r, filtering, search) => {
  const { hasAnyFilters } = getStatusFiltering(filtering)
  if (hasAnyFilters || search) {
    return {
      ...r,
      indicators: r?.indicators
                ?.map((i) => {
                  const fp = i?.periods
                        ?.filter((p) => {
                          if (filtering.periods.items.length && filtering.periods.apply) {
                            return (
                              filtering.periods.items.filter((ip) => {
                                const [periodStart, periodEnd] = ip?.value?.split(' - ')
                                return (
                                  p.periodStart === periodStart &&
                                            p.periodEnd === periodEnd
                                )
                              }).length > 0
                            )
                          }
                          return p
                        })
                        ?.map((p) => {
                          const allContributors = getAllContributors(p?.contributors)
                          let fcb = handleOnFilteringContributors(filtering, allContributors)
                          fcb = handleOnParentConcat(fcb, allContributors)
                          fcb = fcb?.map((cb) => setProjectSubtitle(filtering, cb))
                          const cs = getShrinkContributors(fcb)
                          const _contributors = cs?.length ? cs : fcb
                          const disaggregations = r?.fetched ? getDisaggregations(_contributors) : []
                          const disaggregationContributions = r?.fetched
                            ? handleOnFilteringDisaggregations(filtering, disaggregations)
                            : []
                          return {
                            ...p,
                            contributors: _contributors,
                            disaggregations,
                            disaggregationContributions,
                          }
                        })
                        ?.filter((p) => (hasAnyFilters ? p?.contributors?.length : p))
                  return {
                    ...i,
                    periods: fp,
                  }
                })
                ?.filter((i) => {
                  if (hasAnyFilters) {
                    return i?.periods?.length
                  }
                  return i
                }),
    }
  }
  return r
}

/**
 * Filter based on the filter criteria that have been applied to each result along with the indicators and reporting period.
 *
 * @param {Object} r - Result
 * @param {Object} filtering - Filter criteria
 * @param {string} search
 * @returns
 */
export const handleOnFilterResult = (r, filtering, search) => {
  const { hasAnyFilters } = getStatusFiltering(filtering)
  if (hasAnyFilters || search) {
    return r?.indicators?.length
  }
  return r
}
/**
 * Count thoroughly the filters that have been applied
 *
 * @param {Array.<object>} results - Filtered data results
 * @param {Object} filtering - Filter criteria
 * @param {string} search - Keyword
 * @returns
 */
export const handleOnCountFiltering = (results, filtering, search) => {
  const { hasAnyFilters, hasPeriod, hasCountry, hasContrib, hasPartner } = getStatusFiltering(filtering)
  if (search && !hasAnyFilters) {
    return [...results, ...results?.flatMap((r) => r?.indicators)]?.filter((r) => r.matched)?.length
  }
  if (hasPeriod && (!hasCountry && !hasContrib && !hasPartner)) {
    return results
      ?.flatMap((r) => r?.indicators)
      ?.flatMap((r) => r?.periods)
      ?.length
  }
  if (hasCountry || hasContrib || hasPartner) {
    return results
      ?.flatMap((r) => r?.indicators)
      ?.flatMap((i) => i?.periods)
      ?.flatMap((p) => p?.contributors)
      ?.flatMap((c) => [c, ...c?.contributors])
      ?.length
  }
  return results?.length
}
