import { groupBy, sumBy, uniq, defaults } from 'lodash'
import moment from 'moment'

const getFlatten = data => {
  let children = []
  let flattened = data.map(m => {
    if (m.contributors && m.contributors.length) {
      children = [...children, ...m.contributors.map((cb) => ({ ...cb, parentId: m.id }))]
    }
    return m
  })
  flattened = flattened.concat(children.length ? getFlatten(children) : children)
  return flattened?.map((f) => {
    const { contributors, ...item } = f
    return (item?.parentId === undefined) ? ({ ...item, parentId: null }) : item
  })
}

const getShrink = items => {
  const nodes = {}
  return items.filter((obj) => {
    const id = obj.id
    const parentId = obj.parentId
    nodes[id] = defaults(obj, nodes[id], { contributors: [] })
    parentId && (nodes[parentId] = (nodes[parentId] || { contributors: [] })).contributors.push(obj)
    return !parentId
  })
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
            matched: (i?.title?.indexOf(keyword) > -1)
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
          const sumActualValue = i.periods.reduce((total, currentValue) => total + currentValue.actualValue, 0)
          return ({
            ...i,
            sumActualValue,
            periods: i?.periods
              ?.sort((a, b) => moment(a.periodStart, 'DD/MM/YYYY').unix() - moment(b.periodStart, 'DD/MM/YYYY').unix())
              ?.map((p) => {
                const actualValue = p?.fetched ? sumBy(p.contributors, 'total') : null
                let disaggregations = []
                if (p?.fetched) {
                  disaggregations = p.contributors
                    ?.flatMap((c) => c?.updates)
                    ?.flatMap((u) => u?.disaggregations)
                    ?.sort((a, b) => a.value - b.value)
                }
                const dsgGroups = groupBy(disaggregations, 'category')
                const dsgItems = Object.keys(dsgGroups)?.map((dsgKey) => {
                  const groupTypes = groupBy(dsgGroups[dsgKey], 'type')
                  const groupItems = Object.keys(groupTypes)
                    ?.map((typeKey) => ({
                      ...groupTypes[typeKey][0] || {},
                      total: sumBy(groupTypes[typeKey], 'value')
                    }))
                    ?.sort((a, b) => a.total - b.total)
                  return {
                    name: dsgKey,
                    items: groupItems
                  }
                })
                const single = (
                  (p?.contributors?.length === 1) ||
                  (
                    p?.fetched &&
                    p?.contributors?.filter(it => it.total > 0)?.length === 0
                  )
                )
                const allItems = getFlatten(p?.contributors)
                let allContributors = allItems?.sort((a, b) => a?.value?.localeCompare(b?.value))
                if (
                  (filtering.contributors.items.length && filtering.contributors.apply) &&
                  !filtering.countries.apply &&
                  !filtering.partners.apply
                ) {
                  allContributors = allContributors?.filter((cb) => filtering.contributors.items.find((it) => it.id === cb.projectId))
                }

                if (
                  (filtering.contributors.items.length && filtering.contributors.apply) &&
                  (filtering.countries.items.length && filtering.countries.apply) &&
                  !filtering.partners.apply
                ) {
                  allContributors = allContributors
                    ?.filter((cb) => (cb?.country))
                    ?.filter((cb) => {
                      return (
                        filtering.contributors.items.find((it) => it.id === cb.projectId) &&
                        filtering.countries.items.find((it) => it.id === cb.country.isoCode)
                      )
                    })
                }

                if (
                  !filtering.contributors.apply &&
                  (filtering.countries.items.length && filtering.countries.apply) &&
                  !filtering.partners.apply
                ) {
                  allContributors = allContributors
                    ?.filter((cb) => (cb?.country))
                    ?.filter((cb) => filtering.countries.items.find((it) => it.id === cb.country.isoCode))
                }

                if (
                  !filtering.contributors.apply &&
                  (filtering.countries.items.length && filtering.countries.apply) &&
                  (filtering.partners.items.length && filtering.partners.apply)
                ) {
                  allContributors = allContributors
                    ?.filter((cb) => (cb?.country))
                    ?.filter((cb) => {
                      return (
                        filtering.countries.items.find((it) => it.id === cb.country.isoCode) &&
                        filtering.partners.items.find((it) => Object.keys(cb?.partners).includes(`${it.id}`))
                      )
                    })
                }

                if (
                  (filtering.contributors.items.length && filtering.contributors.apply) &&
                  !filtering.countries.apply &&
                  (filtering.partners.items.length && filtering.partners.apply)
                ) {
                  allContributors = allContributors?.filter((cb) => {
                    return (
                      filtering.contributors.items.find((it) => it.id === cb.projectId) &&
                      filtering.partners.items.find((it) => Object.keys(cb?.partners).includes(`${it.id}`))
                    )
                  })
                }

                if (
                  !filtering.contributors.apply &&
                  !filtering.countries.apply &&
                  (filtering.partners.items.length && filtering.partners.apply)
                ) {
                  allContributors = allContributors?.filter((cb) => {
                    return filtering.partners.items.find((it) => Object.keys(cb?.partners).includes(`${it.id}`))
                  })
                }
                const countryCount = uniq(allContributors
                  ?.map((it) => it?.country?.isoCode)
                  ?.filter((it) => it))
                  ?.length
                if (isFiltering) {
                  const parentIds = uniq(allContributors?.map((a) => a?.parentId))?.filter((a) => (a))
                  const parents = allItems?.filter((a) => parentIds?.includes(a.id))
                  allContributors = [...allContributors, ...parents]
                }
                const contributors = getShrink(allContributors)
                return ({
                  ...p,
                  single,
                  dsgItems,
                  actualValue,
                  disaggregations,
                  countryCount,
                  contributors
                })
              })
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

export const getStatusFiltering = (filtering) => {
  const allFilters = Object.values(filtering).filter(({ apply }) => (apply))
  const hasPeriod = allFilters.filter((t) => t.key === 'periods').length
  const hasCountry = allFilters.filter((t) => t.key === 'countries').length
  const hasContrib = allFilters.filter((t) => t.key === 'contributors').length
  const hasPartner = allFilters.filter((t) => t.key === 'partners').length
  return {
    allFilters,
    hasPeriod,
    hasCountry,
    hasContrib,
    hasPartner
  }
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
