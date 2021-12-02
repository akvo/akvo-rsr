import BasePageObject from './BasePageObject'
import {dismissAnnouncement} from './helpers'

export default class MyProjectsPage extends BasePageObject {

  get url() {
    return `${this.baseUrl}/my-rsr/`
  }

  async visit() {
    await super.visit()
    await this.page.waitForNetworkIdle()
    await this.page.waitForSelector('#projects-view')
    await dismissAnnouncement(this.page)
  }

  async addNewProject() {
    await this.page.waitForSelector('#projects-view .add-project-btn button', {visible: true, timeout: 2000})
    await this.page.focus('#projects-view .add-project-btn button')
    await this.page.keyboard.type('\n')
    await this.page.waitForSelector('.editor')
  }
}
