import BasePageObject from './BasePageObject'

export default class LoginPage extends BasePageObject {

  get url() {
    return `${this.baseUrl}/en/sign_in/`
  }

  async login(username, password) {
    await this.page.type('#id_username', username)
    await this.page.type('#id_password', password)
    await this.page.click('button[type=submit]')
  }
}
