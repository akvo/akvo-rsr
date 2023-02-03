import { getStatusFiltering } from './filters'

export const setProjectSubtitle = (filtering, cb) => {
  const { hasPartner } = getStatusFiltering(filtering)

  if (hasPartner) {
    const partners = Object.values(cb?.partners)
      ?.filter((pr) => (filtering.partners.items.find((it) => it.value === pr)))

    const projectSubtitle = partners.length ? partners?.join(', ') : cb.projectSubtitle
    return ({ ...cb, projectSubtitle })
  }
  return cb
}

export const setActualContributor = item => ({
  ...item,
  actualValue: item?.actualValue ? parseFloat(item.actualValue, 10) : null
})
