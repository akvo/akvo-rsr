import {loginAsDefaultUser, myProjectsPage, projectEditorPage, isAtPage} from '../pages'
import faker from '@faker-js/faker'

describe('Create project feature', () => {
  beforeAll(async () => {
    await loginAsDefaultUser(myProjectsPage)
  })

  it('should redirect to Project editor page', async () => {
    await myProjectsPage.addNewProject()
    expect(await isAtPage(projectEditorPage)).toBe(true)
  })

  it('should be able to create project', async () => {
    const title = faker.company.catchPhrase()
    const subtitle = faker.company.bs()
    await projectEditorPage.setProjectInfo({title, subtitle})
    await myProjectsPage.visit()
    expect(await myProjectsPage.contains(title)).toBe(true)
    expect(await myProjectsPage.contains(subtitle)).toBe(true)
  })
})
