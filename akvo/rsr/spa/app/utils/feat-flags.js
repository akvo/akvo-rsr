export const flagOrgs = {
  DISABLE_FAC: new Set([4531]),
  CREATE_NEW_PROGRAM: new Set([42, 3394]),
  CREATE_HIERARCHY_PROJECT: new Set([42, 3394])
}

export const shouldShowFlag = (orgs, orgSet) => {
  return orgs && orgs.findIndex(it => orgSet.has(it.id) || orgSet.has(it.contentOwner)) !== -1
}
