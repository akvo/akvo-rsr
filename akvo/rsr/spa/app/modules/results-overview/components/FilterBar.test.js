/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* global describe, it, document */
import React from 'react'
import ReactDOM from 'react-dom'
import { render, screen } from '@testing-library/react'
import { FilterBar } from './FilterBar'

describe('Renders filter bar markup test', () => {
  it('renders search, select periods and lock buttons', () => {
    const selectedPeriods = []
    const handleSwitchLock = jest.fn()
    render(<FilterBar {...{ selectedPeriods, handleSwitchLock }} />)
    screen.getByText('Filter by indicator title')
    screen.getByText('Select period')
    screen.getByText('Lock')
    screen.getByText('Unlock')
  })

  it('renders all buttons lock is disabled true', () => {
    const selectedPeriods = []
    const handleSwitchLock = jest.fn()
    const div = document.createElement('div')
    ReactDOM.render(<FilterBar {...{ selectedPeriods, handleSwitchLock }} />, div)
    expect(div.querySelector('button.lock').disabled).toBe(true)
    expect(div.querySelector('button.unlock').disabled).toBe(true)
  })

  it('renders lock button is disabled false and unlock is disabled true', () => {
    const selectedPeriods = [{ periodId: 1, locked: true }]
    const handleSwitchLock = jest.fn()
    const div = document.createElement('div')
    ReactDOM.render(<FilterBar {...{ selectedPeriods, handleSwitchLock }} />, div)
    expect(div.querySelector('button.lock').disabled).toBe(true)
    expect(div.querySelector('button.unlock').disabled).toBe(false)
  })

  it('renders lock button is disabled true and unlock is disabled false', () => {
    const selectedPeriods = [{ periodId: 1, locked: false }]
    const handleSwitchLock = jest.fn()
    const div = document.createElement('div')
    ReactDOM.render(<FilterBar {...{ selectedPeriods, handleSwitchLock }} />, div)
    expect(div.querySelector('button.lock').disabled).toBe(false)
    expect(div.querySelector('button.unlock').disabled).toBe(true)
  })
})
