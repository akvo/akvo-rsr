const headless = process.env.HEADLESS != 'false'
const slowMo = parseInt(process.env.SLOWMO) || 0

module.exports = {
  launch: {
    headless,
    slowMo,
    defaultViewport: {width: 1025, height: 800},
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-dev-shm-usage',
    ]
  },
}
