// import {cloneDee}
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
    results: '/results_framework_lite/',
    'results.indicators': '/indicator_framework/',
    'results.indicators.periods': '/indicator_period/',
    'results.indicators.periods.disaggregationTargets': '/disaggregation_target/'
  },
  section6: {
    budgetItems: '/budget_item/',
    countryBudgetItems: '/country_budget_item/',
    transactions: '/transaction/',
    'transactions.sectors': '/transaction_sector/',
    plannedDisbursements: '/planned_disbursement/'
  },
  section7: {
    locationItems: '/project_location/',
    'locationItems.administratives': '/administrative_location/',
    recipientCountries: '/recipient_country/',
    recipientRegions: '/recipient_region/'
  },
  section8: {
    sectors: '/sector/',
    policyMarkers: '/policy_marker/',
    humanitarianScopes: '/humanitarian_scope/'
  },
  section9: {
    links: '/link/',
    docs: '/project_document/'
  },
  section10: {
    // comments: '/project_comment/'
  },
  section11: {
    crs: '/crs_add/',
    flags: '/crs_add_other_flag/',
    fss: '/fss/',
    forecasts: '/fss_forecast/',
    legacies: '/legacy_data/'
  }
}

export const transforms = {
  section7: {
    locationItems: {
      request: data => {
        if(!data) return null
        const transformed = {
          ...data,
          address_1: data.address1,
          address_2: data.address2
        }
        if(data.location){
          transformed.latitude = data.location.coordinates.lat
          transformed.longitude = data.location.coordinates.lng
          transformed.city = data.location.description
          transformed.country_iso_code = data.location.countryComp.short_name
          delete transformed.location
        }
        if(data.project){
          transformed.location_target = data.project
          delete transformed.project
        }
        delete transformed.address1
        delete transformed.address2
        return transformed
      },
      response: data => {
        const transformed = {
          ...data,
          results: data.results.map(result => ({
            ...result,
            location: {
              coordinates: {
                lat: result.latitude,
                lng: result.longitude
              },
              description: result.city ? result.city : `(Unspecified city), ${result.countryLabel}`
            }
          }))
        }
        return transformed
      }
    }
  },
  section9: {
    docs: {
      request: data => {
        if(!data) return null
        const transformed = { ...data }
        if(transformed.document === ''){
          delete transformed.document
        }
        return transformed
      }
    }
  }
}
export const getEndpoint = (sectionIndex, setName) => {
  // regexp coverts "set[1].item" to "set.item"
  return endpoints[`section${sectionIndex}`][setName ? setName.replace(/\[([^\]]+)]/g, '') : 'root']
}

export const getTransform = (sectionIndex, setName, direction) => {
  if(transforms.hasOwnProperty(`section${sectionIndex}`) && transforms[`section${sectionIndex}`].hasOwnProperty(setName)){
    const ret = {}
    ret[direction] = transforms[`section${sectionIndex}`][setName][direction]
    return ret
  }
  return null
}
