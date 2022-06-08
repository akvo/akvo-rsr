export const filterByPeriods = (p, filtering) => {
  if (filtering.periods.apply && filtering.periods.items.length) {
    return filtering
      .periods
      .items
      .filter((fp) => {
        const [periodStart, periodEnd] = fp?.value?.split(' - ')
        return (periodStart === p.periodStart && periodEnd === p.periodEnd)
      })
      .length > 0
  }
  return p
}

export const filterByProjects = (cb, filtering) => {
  if (filtering.contributors.apply && filtering.contributors.items.length) {
    return filtering
      .contributors
      .items
      .filter((ci) => (
        ci.id === cb.projectId ||
        cb?.contributors?.some((subCb) => subCb.projectId === ci.id)
      ))
      .length > 0
  }
  return cb
}

export const filterByContries = (cb, filtering) => {
  if (filtering.countries.apply && filtering.countries.items.length) {
    return (filtering.countries.items.filter((cs) => cs.id === cb.country.isoCode).length > 0)
  }
  return cb
}

export const filterByKeywords = (string, keyword) => string?.toLowerCase()?.includes(keyword?.toLowerCase())
