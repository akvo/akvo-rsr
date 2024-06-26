import {loginPage, myProjectsPage, ensureLoggedOut, isAtPage, isLoggedIn} from '../pages'

describe('Login page', () => {
  beforeEach(async () => {
    await ensureLoggedOut()
    await loginPage.visit()
  })

  test('registered user can login', async () => {
    await loginPage.login('e2e-user@akvo.org', 'password')
    expect(await isLoggedIn()).toBe(true)
  });

  it('should redirect to "My projects" page', async () => {
    await loginPage.login('e2e-user@akvo.org', 'password')
    expect(await isAtPage(myProjectsPage)).toBe(true)
  })
})
