export const findPartners = (filtering, cb) => filtering
  .partners
  .items
  .find((it) => Object.keys(cb?.partners).includes(`${it.id}`))

export const findProjects = (filtering, cb) => filtering
  .contributors
  .items
  .find((it) => it.id === cb.projectId)

export const findCountries = (filtering, cb) => filtering
  .countries
  .items.find((it) => (cb.country && it.id === cb.country.isoCode))

export const hasAllCriteria = filtering => (
  (filtering.contributors.items.length && filtering.contributors.apply) &&
  (filtering.countries.items.length && filtering.countries.apply) &&
  (filtering.partners.items.length && filtering.partners.apply)
)

export const onlyHasContributors = filtering => (
  (filtering.contributors.items.length && filtering.contributors.apply) &&
  !filtering.countries.apply &&
  !filtering.partners.apply
)

export const hasContribAndCountries = filtering => (
  (filtering.contributors.items.length && filtering.contributors.apply) &&
  (filtering.countries.items.length && filtering.countries.apply) &&
  !filtering.partners.apply
)

export const onlyHasCountries = filtering => (
  !filtering.contributors.apply &&
  (filtering.countries.items.length && filtering.countries.apply) &&
  !filtering.partners.apply
)

export const hasCountriesAndPartners = filtering => (
  !filtering.contributors.apply &&
  (filtering.countries.items.length && filtering.countries.apply) &&
  (filtering.partners.items.length && filtering.partners.apply)
)

export const hasContribAndPartners = filtering => (
  (filtering.contributors.items.length && filtering.contributors.apply) &&
  !filtering.countries.apply &&
  (filtering.partners.items.length && filtering.partners.apply)
)

export const onlyHasPartners = filtering => (
  !filtering.contributors.apply &&
  !filtering.countries.apply &&
  (filtering.partners.items.length && filtering.partners.apply)
)

export const getStatusFiltering = (filtering) => {
  const { data, ...props } = filtering
  const allFilters = Object.values(props).filter(({ apply }) => (apply))
  const hasPeriod = (allFilters.filter((t) => t.key === 'periods').length > 0)
  const hasCountry = (allFilters.filter((t) => t.key === 'countries').length > 0)
  const hasContrib = (allFilters.filter((t) => t.key === 'contributors').length > 0)
  const hasPartner = (allFilters.filter((t) => t.key === 'partners').length > 0)
  const hasAnyFilters = (allFilters?.length > 0)
  return {
    allFilters,
    hasPeriod,
    hasCountry,
    hasContrib,
    hasPartner,
    hasAnyFilters,
  }
}
