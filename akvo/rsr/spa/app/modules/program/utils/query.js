import { groupBy, sumBy, uniq, uniqBy } from 'lodash'

import countriesDict from '../../../utils/countries-dict'
import { getFlatten, getShrink } from '../../../utils/misc'
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
  onlyHasPartners
} from './filters'

export const getAllCountries = (contributors, filtering) => {
  const { hasCountry } = getStatusFiltering(filtering)
  const countries = contributors
    ?.filter((c) => c?.country?.isoCode)
    ?.filter((c) => ((hasCountry && findCountries(filtering, c)) || !hasCountry))
    ?.map((c) => countriesDict[c.country.isoCode] || null)
    ?.filter((c) => c)
  return uniq(countries)
}

const getDisaggregations = contributors => contributors
  ?.map((c) => ({ ...c, updates: c?.updates || [] }))
  ?.flatMap((c) => c?.updates)
  ?.filter((u) => u?.disaggregations)
  ?.flatMap((u) => u?.disaggregations)
  ?.sort((a, b) => a.value - b.value)

const getTheSumResult = (data, field, decimalPlaces = 3) => Number(parseFloat(sumBy(data, field), 10).toFixed(decimalPlaces))

const getTopParent = (contributors, id) => {
  const obj = contributors?.find((c) => c.projectId === id)
  if (obj) {
    return obj.parentId === null ? obj : getTopParent(contributors, obj.parentId)
  }
  return obj
}

const handleOnParentConcat = (contributors, allItems) => {
  const items = contributors
    ?.flatMap((a) => {
      const parent = getTopParent(allItems, a.parentId)
      return [
        parent,
        {
          ...a,
          parentId: parent?.projectId
        }
      ]
    })
  return uniqBy(items, 'projectId')?.filter((item) => item)
}

const handleOnFilteringContributors = (filtering, contributors) => {
  let allContributors = contributors?.sort((a, b) => a?.projectTitle?.localeCompare(b?.projectTitle))
  if (hasAllCriteria(filtering)) {
    allContributors = allContributors
      ?.filter((cb) => (cb?.country))
      ?.filter((cb) => (
        findProjects(filtering, cb) &&
        findCountries(filtering, cb) &&
        findPartners(filtering, cb)
      ))
  }
  if (onlyHasContributors(filtering)) {
    allContributors = allContributors?.filter((cb) => findProjects(filtering, cb))
  }

  if (hasContribAndCountries(filtering)) {
    allContributors = allContributors
      ?.filter((cb) => (cb?.country))
      ?.filter((cb) => {
        return (
          findProjects(filtering, cb) &&
          findCountries(filtering, cb)
        )
      })
  }

  if (onlyHasCountries(filtering)) {
    allContributors = allContributors
      ?.filter((cb) => (cb?.country))
      ?.filter((cb) => findCountries(filtering, cb))
  }

  if (hasCountriesAndPartners(filtering)) {
    allContributors = allContributors
      ?.filter((cb) => (cb?.country))
      ?.filter((cb) => {
        return (
          findCountries(filtering, cb) &&
          findPartners(filtering, cb)
        )
      })
  }

  if (hasContribAndPartners(filtering)) {
    allContributors = allContributors?.filter((cb) => {
      return (
        findProjects(filtering, cb) &&
        findPartners(filtering, cb)
      )
    })
  }

  if (onlyHasPartners(filtering)) {
    allContributors = allContributors?.filter((cb) => (cb?.partners && findPartners(filtering, cb)))
  }
  return allContributors
}

const handleOnFilteringDisaggregations = (filtering, isFiltering, disaggregations) => {
  const dsg = disaggregations
    ?.filter((dg) => {
      if (
        dg?.category?.toLowerCase() === 'ct' &&
        (filtering?.countries?.items?.length && filtering?.countries?.apply)
      ) {
        return filtering
          .countries
          .items
          .filter((ci) => {
            const fc = ci?.value?.toLowerCase()
            const ct = dg?.type?.toLowerCase()
            const rx = new RegExp(`${fc}*`, 'g')
            return rx.test(ct) || ct === fc
          })
          .length > 0
      }
      return dg
    })
  const dsgGroups = groupBy(dsg, 'category')
  return Object.keys(dsgGroups)
    ?.map((dsgKey) => {
      const groupTypes = groupBy(dsgGroups[dsgKey], 'type')
      return Object.keys(groupTypes)
        ?.map((typeKey) => ({
          ...groupTypes[typeKey][0] || {},
          value: getTheSumResult(groupTypes[typeKey], 'value')
        }))
        ?.filter((v) => ((isFiltering && v.value) || !isFiltering))
        ?.sort((a, b) => a.value - b.value)
    })
    ?.flatMap((dg) => dg)
}

export const handleOnFiltering = (results, filtering, search) => {
  const isFiltering = Object.keys(filtering)
    .filter((_key) => (filtering[_key]?.apply && filtering[_key]?.items?.length))
    .length
  return results
    ?.map((r) => {
      if (search) {
        const keyword = search?.toLowerCase()
        const findIndicators = r
          ?.indicators
          ?.map((i) => ({
            ...i,
            matched: (i?.title?.toLowerCase().indexOf(keyword) > -1)
          }))
          ?.filter((i) => (i.matched))
        const findResult = r?.title?.toLowerCase()?.indexOf(keyword) > -1
        return {
          ...r,
          indicators: (findResult && !findIndicators?.length) ? r?.indicators : findIndicators,
          matched: (findResult)
        }
      }
      return r
    })
    ?.map((r) => {
      if (isFiltering || search) {
        return ({
          ...r,
          indicators: r
            ?.indicators
            ?.map((i) => {
              const fp = i
                ?.periods
                ?.filter((p) => {
                  if (filtering.periods.items.length && filtering.periods.apply) {
                    return filtering
                      .periods
                      .items.filter((ip) => {
                        const [periodStart, periodEnd] = ip?.value?.split(' - ')
                        return (p.periodStart === periodStart && p.periodEnd === periodEnd)
                      })
                      .length > 0
                  }
                  return p
                })
                ?.map((p) => {
                  const allContributors = getFlatten(p?.contributors)
                  let fcb = handleOnFilteringContributors(filtering, allContributors)
                  fcb = handleOnParentConcat(fcb, allContributors)
                  const cs = getShrink(fcb)
                  const cb = cs?.length ? cs : fcb
                  const disaggregations = r?.fetched ? getDisaggregations(cb) : []
                  const disaggregationContributions = r?.fetched ? handleOnFilteringDisaggregations(filtering, isFiltering, disaggregations) : []
                  return ({
                    ...p,
                    filteredContributors: cb,
                    disaggregations,
                    disaggregationContributions,
                  })
                })
                ?.filter((p) => isFiltering ? (p?.filteredContributors?.length) : p)
              return ({
                ...i,
                periods: fp
              })
            })
            ?.filter((i) => {
              if (isFiltering) {
                return (i?.periods?.length)
              }
              return i
            })
        })
      }
      return r
    })
    ?.filter((r) => {
      if (isFiltering || search) {
        return (r?.indicators?.length)
      }
      return r
    })
}

export const handleOnCountFiltering = (results, filtering, search) => {
  const { allFilters, hasPeriod, hasCountry, hasContrib, hasPartner } = getStatusFiltering(filtering)
  if (search && !allFilters.length) {
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

export const handleOnSetPartners = (fs, i) => {
  const fi = fs?.indicators?.find((it) => it?.id === i.id)
  return ({
    ...i,
    periods: i?.periods?.map((p) => {
      const fp = fi?.periods?.find((it) => it?.id === p?.periodId)
      if (fp) {
        const contribA = getFlatten(fp?.contributors)
        const contribB = getFlatten(p?.contributors)
          ?.map((cb) => {
            if (cb?.partners === undefined) {
              const fca = contribA?.find((it) => it?.projectId === cb?.projectId)
              return ({
                ...cb,
                partners: fca?.partners
              })
            }
            return cb
          })
          const _contributors = getShrink(contribB)
          return ({
            ...p,
            contributors: _contributors
          })
      }
      return p
    })
  })
}
