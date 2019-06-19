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
  },
  section5: {
    results: '/results_framework/'
  },
  section6: {
    budgetItems: '/budget_item/',
    countryBudgetItems: '/country_budget_item/',
    transactions: '/transaction/',
    'transactions.sectors': '/transaction_sector/',
    plannedDisbursements: '/planned_disbursement/'
  }
}
export const getEndpoint = (sectionIndex, setName) => {
  return endpoints[`section${sectionIndex}`][setName ? setName : 'root']
}
