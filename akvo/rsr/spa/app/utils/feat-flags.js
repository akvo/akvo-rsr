export const flagOrgs = {
  RESULTS: new Set([42])
}

export const shouldShowFlag = (orgs, orgSet) => {
  return orgs && orgs.findIndex(it => orgSet.has(it.id) || orgSet.has(it.contentOwner)) !== -1
}
