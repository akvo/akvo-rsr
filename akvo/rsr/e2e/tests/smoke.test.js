const RSR_DOMAIN = process.env.RSR_DOMAIN || 'http://localhost'

describe('Project directory', () => {
  beforeAll(async () => {
    await page.goto(RSR_DOMAIN, {waitUntil: 'domcontentloaded'})
  })

  it('should display "Most active project" text on page', async () => {
    await expect(page).toMatch('Most active projects')
  })
})
