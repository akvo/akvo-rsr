/* global describe, it */
import expect from 'expect'
import { dateTransform } from './misc'

describe('dateTransform', () => {
  it('dateTransform should return null', () => {
    expect(dateTransform.request(null)).toEqual(null)
  })
  it('dateTransform should transform request with object', () => {
    const data = {
      dateStart: '23/02/1989'
    }
    expect(dateTransform.request(data)).toEqual({ dateStart: '1989-02-23' })
  })
  it('dateTransform should transform request with array', () => {
    const data = [
      {dateStart: '23/02/1989'},
      {periodStart: '11/07/2019'}
    ]
    const transformedData = [
      {dateStart: '1989-02-23'},
      {periodStart: '2019-07-11'}
    ]
    expect(dateTransform.request(data)).toEqual(transformedData)
  })
  it('dateTransform should transform response with object', () => {
    const transformedData = {
      dateStart: '23/02/1989'
    }
    const data = {
      dateStart: '1989-02-23'
    }
    expect(dateTransform.response(data)).toEqual(transformedData)
  })
  it('dateTransform should transform request with nested array', () => {
    const data = {
      results: [
        {dateStart: '23/02/1989'},
        {periodStart: '11/07/2019'}
      ]
    }
    const transformedData = {
      results: [
        {dateStart: '1989-02-23'},
        {periodStart: '2019-07-11'}
      ]
    }
    expect(dateTransform.request(data)).toEqual(transformedData)
  })
  it('dateTransform should transform response with nested array (recursive)', () => {
    const transformedData = {
      results: [
        {dateStart: '23/02/1989'},
        {periodStart: '11/07/2019'},
        {periods: [{dateStart: '01/01/2010'}]}
      ]
    }
    const data = {
      results: [
        {dateStart: '1989-02-23'},
        {periodStart: '2019-07-11'},
        {periods: [{dateStart: '2010-01-01'}]}
      ]
    }
    expect(dateTransform.response(data)).toEqual(transformedData)
  })
  it('dateTransform does not transform unintended fields', () => {
    const data = {
      validations: [1, 2]
    }
    expect(dateTransform.request(data)).toEqual(data)
  })
})
