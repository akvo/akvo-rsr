/* global window */
import rsrHome from '../images/home-rsr.svg'
import rsrMonitoring from '../images/home-monitoring.svg'
import rsrLogo from '../images/rsrLogo.svg'
import step1 from '../images/step-01.png'
import step2 from '../images/step-02.png'
import step3 from '../images/step-03.png'
import step4 from '../images/step-04.png'

const isLocal = window.location.href.indexOf('localhost') !== -1 || window.location.href.indexOf('localakvoapp') !== -1
export const prefixUrl = isLocal ? 'http://rsr.akvo.org' : ''
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
  }
}

export const footerUrl = {
  home: [
    {
      url: 'https://rsrsupport.akvo.org/content',
      text: 'Help Center'
    },
    {
      url: '#',
      text: 'Quick Start guide'
    },
    {
      url: 'https://rsrsupport.akvo.org',
      text: 'Knowledge Base'
    },
    {
      url: 'https://akvo.org/our-work/',
      text: 'Case Studies'
    }
  ]
}
