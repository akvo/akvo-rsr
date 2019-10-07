/* global describe, it */
import expect from 'expect'
import React from 'react'
import renderer from 'react-test-renderer'
import { CalculateTotalChecker } from './calc-total-checker'

describe('CalcTotalChecker', () => {
  const reducer = {
    rdr: {
      section7: {
        recipientCountries: [{percentage: 50 }, {percentage: 20}],
        recipientRegions: [{ percentage: 30 }]
      }
    }
  }
  it('should calc total for single item array', () => {
    const root = renderer.create(
      <CalculateTotalChecker section={7} {...reducer} prop="percentage" paths={['recipientCountries']} />
    )
    const instance = root.root
    expect(instance.children.length).toBe(1)
  })
  it('should calc total for multiple item arrays', () => {
    const root = renderer.create(
      <CalculateTotalChecker section={7} {...reducer} prop="percentage" paths={['recipientCountries', 'recipientRegions']} />
    )
    const instance = root.root
    expect(instance.children.length).toBe(0)
  })
})
