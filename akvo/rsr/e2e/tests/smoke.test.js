import {landingPage, ensureLoggedOut} from '../pages'

describe('Project directory', () => {
  beforeEach(async () => {
    await ensureLoggedOut()
    await landingPage.visit()
  })

  it('should display "Most active project" text on page', async () => {
    const haveText = await landingPage.contains('Most active projects')
    expect(haveText).toBe(true)
  })
})
