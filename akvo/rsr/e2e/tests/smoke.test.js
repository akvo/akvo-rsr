import {landingPage, ensureLoggedOut} from '../pages'

describe('Project directory', () => {
  beforeEach(async () => {
    await ensureLoggedOut()
    await landingPage.visit()
  })

  it('should have title', async () => {
    const title = await landingPage.title()
    expect(title).toBe('Akvo RSR')
  })
})
