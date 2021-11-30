/* global jest, describe, it */
import expect from 'expect'
import { isPeriodNeedsReporting, isPeriodApproved, isIndicatorHasStatus } from './filters'

jest.mock('moment', () => jest.fn((...args) => {
  args = args.length > 0 ? args : ['2021-01-01T00:00:00.000']
  return jest.requireActual('moment')(...args)
}))

describe('isPeriodNeedsReporting', () => {
  it('should false for locked periods', () => {
    const period = { locked: true, updates: [] }
    expect(isPeriodNeedsReporting(period)).toBe(false)
  })
  it('should true for unlocked periods without updates', () => {
    const period = { locked: false, updates: [] }
    expect(isPeriodNeedsReporting(period)).toBe(true)
  })
  it('should false for unlocked period with all approved updates', () => {
    const period = {
      locked: false,
      updates: [
        { status: 'A' },
        { status: 'A' },
      ]
    }
    expect(isPeriodNeedsReporting(period)).toBe(false)
  })
  it('should true if there is a draft update', () => {
    const period = {
      locked: false,
      updates: [
        { status: 'A' },
        { status: 'D' },
      ]
    }
    expect(isPeriodNeedsReporting(period)).toBe(true)
  })
  it('should true if there is a revision update', () => {
    const period = {
      locked: false,
      updates: [
        { status: 'A' },
        { status: 'R' },
      ]
    }
    expect(isPeriodNeedsReporting(period)).toBe(true)
  })
  it('should true if all updates createdAt passed timeout days', () => {
    const period = {
      locked: false,
      updates: [
        { status: 'A', createdAt: '2020-11-01T00:00:00.000' },
        { status: 'A', createdAt: '2020-12-01T00:00:00.000' },
      ]
    }
    expect(isPeriodNeedsReporting(period, 30)).toBe(true)
  })
  it('should false if has update with cratedAt not passed timout days', () => {
    const period = {
      locked: false,
      updates: [
        { status: 'A', createdAt: '2020-11-01T00:00:00.000' },
        { status: 'A', createdAt: '2020-12-01T00:00:00.000' },
      ]
    }
    expect(isPeriodNeedsReporting(period, 90)).toBe(false)
  })
})

describe('isPeriodApproved', () => {
  it('should false for locked period', () => {
    const period = {
      locked: true,
      updates: [
        { status: 'A' }
      ]
    }
    expect(isPeriodApproved(period)).toBe(false)
  })
  it('should false for unlocked period without updates', () => {
    const period = { locked: false, updates: [] }
    expect(isPeriodApproved(period)).toBe(false)
  })
  it('shold true if there is an approved update', () => {
    const period = {
      locked: false,
      updates: [
        { status: 'A' }
      ]
    }
    expect(isPeriodApproved(period)).toBe(true)
  })
  it('should false if there is no approved update', () => {
    const period = {
      locked: false,
      updates: [
        { status: 'R' }
      ]
    }
    expect(isPeriodApproved(period)).toBe(false)
  })
})

describe('isIndicatorHasStatus', () => {
  const init = {
    id: 1,
    periods: [
      {
        id: 1,
        updates: [
          {
            id: 1,
            status: 'R',
            userDetails: {
              id: 1
            }
          }
        ]
      }
    ]
  }

  it('should false if indicator doesn\'t have update revision', () => {
    const indicator = {
      ...init,
      periods: init.periods.map(period => ({
        ...period,
        updates: period.updates.map(update => ({ ...update, status: 'A' }))
      }))
    }
    expect(isIndicatorHasStatus(indicator, 1)).toBe(0)
  })

  it('should true if indicator have update revision', () => {
    expect(isIndicatorHasStatus(init, 1)).toBe(1)
  })

  it('should false if current user doesnt have any updates', () => {
    expect(isIndicatorHasStatus(init, 2)).toBe(0)
  })
})
