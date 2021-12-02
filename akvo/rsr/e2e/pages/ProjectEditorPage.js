import BasePageObject from './BasePageObject'
import {dismissAnnouncement} from './helpers'

export default class ProjectEditorPage extends BasePageObject {

  get url() {
    return `${this.baseUrl}/my-rsr/projects/new`
  }

  async isAt() {
    try {
      await this.page.waitForNetworkIdle()
      await this.page.waitForSelector('.editor', {timeout: 2000})
      return true
    } catch {
      return false
    }
  }

  async setProjectInfo({title, subtitle = ''}) {
    await this.openProjectInfo()
    await this.page.waitForSelector('.info textarea[name="title"]')
    await this.page.type('.info textarea[name="title"]', title)
    await this.page.waitForSelector('.info textarea[name="subtitle"]')
    await this.page.focus('.info textarea[name="subtitle"]')
    await this.page.waitForNetworkIdle()
    if (subtitle) {
      await this.page.type('.info textarea[name="subtitle"]', subtitle)
      await this.page.focus('.info textarea[name="title"]')
      await this.page.waitForNetworkIdle()
    }
    await this.page.waitForTimeout(2000)
  }

  async openProjectInfo() {
    await dismissAnnouncement(this.page)
    await this.page.waitForNetworkIdle()
    await this.page.waitForSelector('aside.main-menu a[href*="/info"]')
    await this.page.$eval('aside.main-menu a[href*="/info"]', (el) => el.click())
    await this.page.waitForTimeout(2000)
    await this.page.waitForSelector('.info')
  }
}
