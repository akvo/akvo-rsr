/* global jest, describe, it */
import expect from 'expect'
import { isPeriodNeedsReporting, getNeedReportingPeriods } from './filters'

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
        {status: 'A'},
        {status: 'A'},
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

describe('getNeedReportingPeriods', () => {
  const results = [
    {
      title: 'Result #1',
      indicators: [
        {
          title: 'Indicator #1.1',
          periods: [
            { id: 1, locked: false, updates: [] },
            { id: 2, locked: false, updates: [{ status: 'A' }] },
          ]
        },
        {
          title: 'Indicator #1.2',
          periods: [
            { id: 3, locked: true, updates: [] }
          ]
        },
      ]
    },
    {
      title: 'Result #2',
      indicators: [
        {
          title: 'Indicator #2.1',
          periods: [
            { id: 4, locked: false, updates: [{ status: 'D' }] }
          ]
        },
      ]
    },
  ]
  it('should return list of need reporting periods', () => {
    const actual = getNeedReportingPeriods(results)
    const expected = [1, 4]
    expect(actual).toEqual(expected)
  })
})
