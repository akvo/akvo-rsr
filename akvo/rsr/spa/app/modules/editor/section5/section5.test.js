/* global it, describe */
import expect from 'expect'
import { parseHashComponents } from './section5'

describe('parseHashComponents', () => {
  it('should parse hash', () => {
    const parsed = parseHashComponents('#/result/2')
    expect(parsed).toHaveProperty('resultId')
    expect(parsed.resultId).toEqual('2')
  })
  it('should parse hash and get indicator', () => {
    const parsed = parseHashComponents('#/result/2/indicator/23')
    expect(parsed).toHaveProperty('indicatorId')
    expect(parsed.indicatorId).toEqual('23')
  })
  it('should parse hash and get period', () => {
    const parsed = parseHashComponents('#/result/2/indicator/23/period/71')
    expect(parsed).toHaveProperty('periodId')
    expect(parsed.periodId).toEqual('71')
  })
})
