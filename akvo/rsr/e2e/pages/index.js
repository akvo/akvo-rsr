/* global page */
import LandingPage from './LandingPage'
import LoginPage from './LoginPage'
import MyProctsPage from './MyProjectsPage'
import {BASE_URL} from '../config'

export const landingPage = new LandingPage(page, BASE_URL)

export const loginPage = new LoginPage(page, BASE_URL)

export const myProjectsPage = new MyProctsPage(page, BASE_URL)

export const isAtPage = async (pageObject) => {
  return await pageObject.isAt()
}

export const isLoggedIn = async () => {
  try {
    await page.waitForSelector('.top-bar .user', {visible: true})
    return true
  } catch {
    return false
  }
}

export const ensureLoggedOut = async () => {
  await page.goto(`${BASE_URL}/sign_out/`, {waitUntil: 'domcontentloaded'})
}
