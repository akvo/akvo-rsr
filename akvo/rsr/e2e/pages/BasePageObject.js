export default class BasePageObject {

  constructor(page, baseUrl) {
    this.page = page
    this.baseUrl = baseUrl
  }

  get url() {
    return this.baseUrl
  }

  async visit() {
    await this.page.goto(this.url, {waitUntil: 'domcontentloaded'})
  }

  async isAt() {
    await this.page.waitForSelector('body')
    const pageUrl = await this.page.url()
    return pageUrl === this.url
  }

  async contains(text) {
    const content = await this.page.$eval('body', (el) => el.textContent)
    return content.replace(/\s+/g, ' ').trim().includes(text)
  }
}
