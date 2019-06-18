export const endpoints = {
  section1: {
    root: '/project/:projectId',
    relatedProjects: '/related_project/'
  },
  section2: {
    contacts: '/project_contact/'
  },
  section3: {
    partners: '/partnership/'
  }
}
export const getEndpoint = (sectionIndex, setName) => {
  return endpoints[`section${sectionIndex}`][setName ? setName : 'root']
}
