import { images } from './config'
import chevronLeft from '../images/chevron-left.svg'
import chevronRight from '../images/chevron-right.svg'
import menu from '../images/hamburger-button.svg'
import socialTwitter from '../images/social-twitter.svg'
import socialGithub from '../images/social-github.svg'
import socialLinkedin from '../images/social-linkedin.svg'
import socialYoutube from '../images/social-youtube.svg'
import smallChevronLeft from '../images/small-chevron-left.svg'
import smallChevronRight from '../images/small-chevron-right.svg'
import arrowRight from '../images/arrow-right.svg'

export const icons = {
  ...images,
  menu,
  social: {
    twitter: socialTwitter,
    github: socialGithub,
    linkedin: socialLinkedin,
    youtube: socialYoutube
  },
  chevron: {
    left: chevronLeft,
    right: chevronRight,
    small: {
      left: smallChevronLeft,
      right: smallChevronRight,
    }
  },
  arrow: {
    right: arrowRight,
  },
}
