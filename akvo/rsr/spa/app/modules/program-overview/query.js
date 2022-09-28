import { groupBy, sumBy, uniq } from 'lodash'
import moment from 'moment'

import countriesDict from '../../utils/countries-dict'
import { getFlatten, getShrink } from '../../utils/misc'
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
import { setProjectSubtitle } from './transform'

const getSingleClassStatus = p => (
  (p?.contributors?.length === 1) ||
  (
    p?.fetched &&
    p?.contributors?.filter(it => it.total > 0)?.length === 0
  )
)

const getSingleCountry = contributors => {
  const countries = contributors
    ?.filter((c) => c?.country?.isoCode)
    ?.map((c) => countriesDict[c.country.isoCode] || null)
    ?.filter((c) => c)
  const uniqContries = uniq(countries)
  return uniqContries.length === 1 ? uniqContries.pop() : null
}

const getDisaggregations = contributors => contributors
  ?.map((c) => ({ ...c, updates: c?.updates || [] }))
  ?.flatMap((c) => c?.updates)
  ?.filter((u) => u?.disaggregations)
  ?.flatMap((u) => u?.disaggregations)
  ?.sort((a, b) => a.value - b.value)

const getTheSumResult = (data, field, decimalPlaces = 3) => Number(parseFloat(sumBy(data, field), 10).toFixed(decimalPlaces))

const handleOnFilteringContributors = (filtering, isFiltering, contributors) => {
  const allItems = getFlatten(contributors)
  let allContributors = allItems?.sort((a, b) => a?.value?.localeCompare(b?.value))

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
    allContributors = allContributors?.filter((cb) => findPartners(filtering, cb))
  }
  if (isFiltering) {
    const parentIds = uniq(allContributors?.map((a) => a?.parentId))?.filter((a) => (a))
    const parents = allItems?.filter((a) => parentIds?.includes(a.id))
    allContributors = [...allContributors, ...parents]
  }
  return allContributors
}

const handleOnFilteringDisaggregations = (filtering, isFiltering, disaggregations) => {
  const dsgGroups = groupBy(disaggregations, 'category')
  return Object.keys(dsgGroups)
    ?.map((dsgKey) => {
      const groupTypes = groupBy(dsgGroups[dsgKey], 'type')
      const groupItems = Object.keys(groupTypes)
        ?.filter((typeKey) => {
          const { hasCountry } = getStatusFiltering(filtering)
          if (hasCountry && dsgKey?.toLowerCase() === 'country') {
            return filtering
              .countries
              .items.filter((ci) => {
                const currentCountry = ci?.value?.toLowerCase()
                const country = typeKey?.toLowerCase()
                const regex = new RegExp(`${currentCountry}*`, 'g')
                return regex.test(country) || country === currentCountry || currentCountry.includes(country)
              })
              .length
          }
          return typeKey
        })
        ?.map((typeKey) => ({
          ...groupTypes[typeKey][0] || {},
          total: getTheSumResult(groupTypes[typeKey], 'value')
        }))
        ?.filter((v) => ((isFiltering && v.total) || !isFiltering))
        ?.sort((a, b) => a.total - b.total)
      return {
        name: dsgKey,
        items: groupItems
      }
    })
    ?.filter((item) => ((isFiltering && item.items.length) || !isFiltering))
}

export const handleOnFiltering = (results, filtering, search) => {
  const isFiltering = Object.keys(filtering).filter((_key) => filtering[_key]?.apply).length
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
    ?.map((r) => ({
      ...r,
      indicators: r
        ?.indicators
        ?.map((i) => {
          const periods = i?.periods
            ?.sort((a, b) => moment(a.periodStart, 'DD/MM/YYYY').unix() - moment(b.periodStart, 'DD/MM/YYYY').unix())
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
              const allContributors = handleOnFilteringContributors(filtering, isFiltering, p?.contributors)
                ?.map((cb) => setProjectSubtitle(filtering, cb))
                /* ?.filter((cb) => {
                  if (isFiltering && p?.fetched) {
                    return cb.total
                  }
                  return cb
                }) */
              const contributors = getShrink(allContributors)

              const disaggregations = getDisaggregations(contributors)
              const dsgItems = handleOnFilteringDisaggregations(filtering, isFiltering, disaggregations)

              const actualValue = p?.fetched ? getTheSumResult(contributors, 'total') : null

              const countryCount = uniq(allContributors
                ?.map((it) => it?.country?.isoCode)
                ?.filter((it) => it))
                ?.length

              const single = getSingleClassStatus(p)
              const singleCountry = getSingleCountry(contributors)
              return ({
                ...p,
                single,
                singleCountry,
                dsgItems,
                actualValue,
                disaggregations,
                countryCount,
                contributors
              })
            })
          const sumActualValue = periods.reduce((total, currentValue) => total + currentValue.actualValue, 0)
          return ({
            ...i,
            sumActualValue,
            periods: periods
              ?.filter((p) => {
                if (isFiltering) {
                  return (p?.contributors?.length)
                }
                return p
              })
          })
        })
        ?.filter((i) => {
          if (isFiltering) {
            return (i?.periods?.length)
          }
          return i
        })
    }))
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
