import BasePageObject from './BasePageObject'

export default class MyProjectsPage extends BasePageObject {

  get url() {
    return `${this.baseUrl}/my-rsr/`
  }
}
