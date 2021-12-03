
export const dismissAnnouncement = async (page) => {
  try {
    await page.waitForSelector('.announcement-prompt', {visible: true, timeout: 2000})
    await page.click('.announcement-prompt button.ant-modal-close')
    await page.waitForSelector('.announcement-prompt', {visible: false, timeout: 2000})
  } catch {
    // do nothing when no announcement
  }
}
