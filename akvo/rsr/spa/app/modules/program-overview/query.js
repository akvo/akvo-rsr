import { groupBy, sumBy } from 'lodash'
import moment from 'moment'

export const handleOnFiltering = (results, filtering) => {
  return results?.map((r) => ({
    ...r,
    indicators: r.indicators
      .map((i) => ({
        ...i,
        periods: i?.periods
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
            return ({
              ...p,
              single,
              dsgItems,
              actualValue,
              disaggregations,
              contributors: p
                .contributors
                ?.filter((cb) => {
                  if (filtering.contributors.items.length && filtering.contributors.apply) {
                    return filtering
                      .contributors
                      .items
                      .filter((ci) => ci.id === cb.id)
                      .length > 0
                  }
                  return cb
                })
                ?.filter((cb) => {
                  if (filtering.partners.items.length && filtering.partners.apply) {
                    const allPartners = Object.keys(cb.partners)
                    return filtering
                      .partners
                      .items
                      .filter((pi) => allPartners?.includes(`${pi.id}`))
                      .length > 0
                  }
                  return cb
                })
                ?.filter((cb) => {
                  if (filtering.countries.items.length && filtering.countries.apply) {
                    const allCountries = cb.country
                      ? [...cb.contributors.map((it) => it?.country?.isoCode), cb.country.isoCode]
                      : cb.contributors.map((it) => it?.country?.isoCode)
                    return filtering
                      .countries
                      .items
                      .filter((cs) => allCountries.includes(cs.id))
                      .length > 0
                  }
                  return cb
                })
                ?.sort((a, b) => a?.projectTitle.localeCompare(b?.projectTitle))
                ?.map((cb) => {
                  if (cb?.contributors?.length) {
                    return ({
                      ...cb,
                      contributors: cb
                        .contributors
                        .filter((it) => {
                          if (it.country && (filtering.countries.items.length && filtering.countries.apply)) {
                            return filtering
                              .countries
                              .items
                              .filter((cs) => cs.id === it.country.isoCode)
                              .length > 0
                          }
                          return it
                        })
                    })
                  }
                  return cb
                })
            })
          })
      }))
  }))
}
