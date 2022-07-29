/* global window */
import rsrHome from '../images/home-rsr.svg'
import rsrMonitoring from '../images/home-monitoring.svg'
import rsrLogo from '../images/rsrLogo.svg'
import step1 from '../images/step-01.svg'
import step2 from '../images/step-02.svg'
import step3 from '../images/step-03.svg'
import step4 from '../images/step-04.svg'
import defaultImage from '../images/default-image.png'
import chevronLeft from '../images/chevron-left.svg'
import chevronRight from '../images/chevron-right.svg'
import humbergerMenu from '../images/hamburger-button.svg'
import socialTwitter from '../images/social-twitter.svg'
import socialGithub from '../images/social-github.svg'
import socialLinkedin from '../images/social-linkedin.svg'
import socialYoutube from '../images/social-youtube.svg'

const isLocal = window.location.href.indexOf('localhost') !== -1 || window.location.href.indexOf('localakvoapp') !== -1 || window.location.href.includes('rsr3')
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
  default: defaultImage
}

export const footerUrl = {
  home: [
    {
      url: 'https://rsrsupport.akvo.org/content',
      text: 'Help centre'
    },
    {
      url: 'https://rsrsupport.akvo.org/article/show/152434-user-guides',
      text: 'Quick start guide'
    },
    {
      url: 'https://rsrsupport.akvo.org/container/show/akvo-rsr',
      text: 'Knowledge base'
    },
    {
      url: 'https://akvo.org/our-work/',
      text: 'Case studies'
    }
  ]
}
export const scheduleDemoUrl = '/dir/schedule-demo'

export const icons = {
  ...images,
  menu: humbergerMenu,
  chevron: {
    left: chevronLeft,
    right: chevronRight
  },
  social: {
    twitter: socialTwitter,
    github: socialGithub,
    linkedin: socialLinkedin,
    youtube: socialYoutube
  }
}
