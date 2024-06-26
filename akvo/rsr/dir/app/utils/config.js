/* global window */
import rsrHome from '../images/home-rsr.svg'
import rsrMonitoring from '../images/home-monitoring.svg'
import rsrLogo from '../images/rsrLogo.svg'
import step1 from '../images/step-01.svg'
import step2 from '../images/step-02.svg'
import step3 from '../images/step-03.svg'
import step4 from '../images/step-04.svg'
import defaultImage from '../images/default-image.png'

const isLocal = window.location.href.indexOf('localhost') !== -1 || window.location.href.indexOf('localakvoapp') !== -1 || window.location.href.indexOf('rsr3') !== -1
export const prefixUrl = isLocal ? 'https://rsr.akvo.org' : ''
export const images = {
  logo: {
    rsr: rsrLogo
  },
  home: {
    rsr: rsrHome,
    monitoring: rsrMonitoring
  },
  hwork: {
    step1,
    step2,
    step3,
    step4
  },
  default: defaultImage,
}

export const footerUrl = {
  home: [
    {
      url: 'https://kb.akvo.org/rsr/',
      text: 'Help centre'
    },
    {
      url: 'https://kb.akvo.org/rsr/guides/',
      text: 'Quick start guide'
    },
    {
      url: 'https://kb.akvo.org/rsr/',
      text: 'Knowledge base'
    },
    {
      url: 'https://akvo.org/our-work/',
      text: 'Case studies'
    }
  ]
}
export const scheduleDemoUrl = '/dir/schedule-demo'

export const youtubeID = 'qEj6-3ee8pk'

export const RESULTS_KEY = 'result-overview'
export const UPDATES_KEY = 'updates'
export const HOME_KEY = 'home'
export const projectPath = {
  [RESULTS_KEY]: ['results'],
  [UPDATES_KEY]: [
    'updates',
    'update'
  ]
}

export const MAX_TEXT_LENGTH = 700
