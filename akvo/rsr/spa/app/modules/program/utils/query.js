import { groupBy, sumBy, uniq, uniqBy, sum } from 'lodash'
import moment from 'moment'

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

export const getAllCountries = (contributors, filtering) => {
  const { hasCountry } = getStatusFiltering(filtering)
  const countries = contributors
        ?.filter((c) => c?.country?.isoCode)
        ?.filter((c) => (hasCountry && findCountries(filtering, c)) || !hasCountry)
        ?.map((c) => countriesDict[c.country.isoCode] || null)
        ?.filter((c) => c)
  return uniq(countries)
}

const getDisaggregations = (contributors) =>
    contributors
        ?.map((c) => ({ ...c, updates: c?.updates || [] }))
        ?.flatMap((c) => c?.updates)
        ?.filter((u) => u?.disaggregations)
        ?.flatMap((u) => u?.disaggregations)
        ?.sort((a, b) => a.value - b.value)

const getTheSumResult = (data, field, decimalPlaces = 3) =>
  Number(parseFloat(sumBy(data, field), 10).toFixed(decimalPlaces))

const getTopParent = (contributors, id) => {
  const obj = contributors?.find((c) => c.projectId === id)
  if (obj) {
    return obj.parentId === null ? obj : getTopParent(contributors, obj.parentId)
  }
  return obj
}

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
                          const cs = getShrinkContributors(fcb)
                          const cb = cs?.length ? cs : fcb
                          const disaggregations = r?.fetched ? getDisaggregations(cb) : []
                          const disaggregationContributions = r?.fetched
                            ? handleOnFilteringDisaggregations(filtering, disaggregations)
                            : []
                          return {
                            ...p,
                            contributors: cb,
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

export const handleOnFilterResult = (r, filtering, search) => {
  const { hasAnyFilters } = getStatusFiltering(filtering)
  if (r?.fetched && (hasAnyFilters || search)) {
    return r?.indicators?.length
  }
  return r
}

export const handleOnCountFiltering = (results, filtering, search) => {
  const { allFilters, hasPeriod, hasCountry, hasContrib, hasPartner } =
        getStatusFiltering(filtering)
  if (search && !allFilters.length) {
    return [...results, ...results?.flatMap((r) => r?.indicators)]?.filter((r) => r.matched)
            ?.length
  }
  if (hasPeriod && !hasCountry && !hasContrib && !hasPartner) {
    return results?.flatMap((r) => r?.indicators)?.flatMap((r) => r?.periods)?.length
  }
  if (hasCountry || hasContrib || hasPartner) {
    return results
            ?.flatMap((r) => r?.indicators)
            ?.flatMap((i) => i?.periods)
            ?.flatMap((p) => p?.contributors)
            ?.flatMap((c) => [c, ...c?.contributors])?.length
  }
  return results?.length
}

export const handleOnSetPartners = (fs, i) => {
  const fi = fs?.indicators?.find((it) => it?.id === i.id)
  return {
    ...i,
    periods: i?.periods?.map((p) => {
      const fp = fi?.periods?.find((it) => it?.id === p?.periodId)
      if (fp) {
        const contribA = getAllContributors(fp?.contributors)
        const contribB = getAllContributors(p?.contributors)?.map((cb) => {
          if (cb?.partners === undefined) {
            const fca = contribA?.find((it) => it?.projectId === cb?.projectId)
            return {
              ...cb,
              partners: fca?.partners,
            }
          }
          return cb
        })
        const _contributors = getShrinkContributors(contribB)
        return {
          ...p,
          contributors: _contributors,
        }
      }
      return p
    }),
  }
}

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

export const setActualContributor = (item) => ({
  ...item,
  actualValue: item?.actualValue ? parseFloat(item.actualValue, 10) : null,
})

export const handleOnFiltering = (results, filtering, search) => {
  const { hasAnyFilters } = getStatusFiltering(filtering)
  return results
        ?.map((r) => {
          if (search) {
            const keyword = search?.toLowerCase()
            const findIndicators = r?.indicators
                    ?.map((i) => ({
                      ...i,
                      matched: i?.title?.toLowerCase().indexOf(keyword) > -1,
                    }))
                    ?.filter((i) => i.matched)
            const findResult = r?.title?.toLowerCase()?.indexOf(keyword) > -1
            const _indicators =
                    findResult && !findIndicators?.length ? r?.indicators : findIndicators
            return {
              ...r,
              indicators: _indicators,
              matched: findResult,
            }
          }
          return r
        })
        ?.map((r) => ({
          ...r,
          indicators: r?.indicators
                ?.map((i) => {
                  const periods = i?.periods
                        ?.sort(
                            (a, b) =>
                              moment(a.periodStart, 'DD/MM/YYYY').unix() -
                                moment(b.periodStart, 'DD/MM/YYYY').unix()
                        )
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
                          const allItems = getAllContributors(p?.contributors)
                          let allContributors = handleOnFilteringContributors(
                            filtering,
                            allItems
                          )?.map((cb) => setProjectSubtitle(filtering, cb))
                          allContributors = hasAnyFilters
                            ? handleOnParentConcat(allContributors, allItems)
                            : allContributors
                          allContributors = allContributors?.map(setActualContributor)
                          const contribTransform = getShrinkContributors(allContributors)
                          const contributors = contribTransform?.length
                            ? contribTransform
                            : allContributors

                          const disaggregations = getDisaggregations(contributors)
                          const dsgItems = handleOnFilteringDisaggregations(
                            filtering,
                            hasAnyFilters,
                            disaggregations
                          )
                          const _contributors = allContributors
                                ?.map(setActualContributor)
                                ?.map((cb) => cb?.actualValue)
                          const actualValue = hasAnyFilters
                            ? sum(_contributors)
                            : parseFloat(p?.actualValue || null, 10)
                          const countries = getAllCountries(allContributors, filtering)
                          const single = true
                          return {
                            ...p,
                            single,
                            dsgItems,
                            actualValue,
                            disaggregations,
                            countries,
                            contributors,
                          }
                        })
                  const _periods = periods
                        ?.filter((p) => (hasAnyFilters ? p?.contributors?.length : p))
                        ?.filter((p) => !Number.isNaN(Number(p?.actualValue)))
                        ?.map((p) => p?.actualValue)

                  const sumActualValue = sum(_periods)
                  return {
                    ...i,
                    periods: _periods,
                    sumActualValue,
                  }
                })
                ?.filter((i) => {
                  if (hasAnyFilters) {
                    return i?.periods?.length
                  }
                  return i
                }),
        }))
        ?.filter((r) => {
          if (hasAnyFilters || search) {
            return r?.indicators?.length
          }
          return r
        })
}
