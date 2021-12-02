import {loginAsDefaultUser, myProjectsPage, projectEditorPage, isAtPage} from '../pages'
import faker from 'faker'

describe('Create project feature', () => {
  beforeEach(async () => {
    await loginAsDefaultUser(myProjectsPage)
  })

  it('should be able to create project', async () => {
    await myProjectsPage.addNewProject()

    expect(await isAtPage(projectEditorPage)).toBe(true)

    const title = faker.company.catchPhrase()
    const subtitle = faker.company.bs()
    await projectEditorPage.setProjectInfo({title, subtitle})
    await myProjectsPage.visit()

    expect(await myProjectsPage.contains(title)).toBe(true)
    expect(await myProjectsPage.contains(subtitle)).toBe(true)
  })
})
