/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* global describe, it */
import React from 'react'
import TestRenderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router'
import ConditionalLink from './conditional-link'

describe('Check all unpublished program or project link is correct', () => {
  const init = {
    id: 1,
    name: 'Project 1',
    isProgram: false,
    status: 'unpublished',
    editable: true,
    restricted: false
  }
  it('unpublished project link with editable true is correct', () => {
    const record = { ...init }
    const testRenderer = TestRenderer.create(
      <MemoryRouter>
        <ConditionalLink record={record} isProgram={false}>
          {record.name}
        </ConditionalLink>
      </MemoryRouter>
    )
    const testInstance = testRenderer.root
    expect(testInstance.findByType('a').props.href).toEqual('/projects/1')
  })

  it('unpublished project link with editable false is correct', () => {
    const record = { ...init, editable: false }
    const testRenderer = TestRenderer.create(
      <MemoryRouter>
        <ConditionalLink record={record} isProgram={false}>
          {record.name}
        </ConditionalLink>
      </MemoryRouter>
    )
    const testInstance = testRenderer.root
    expect(testInstance.findByType('a').props.href).toEqual('/projects/1/results')
  })

  it('unpublished project link with restricted true is correct', () => {
    const record = { ...init, restricted: true }
    const testRenderer = TestRenderer.create(
      <MemoryRouter>
        <ConditionalLink record={record} isProgram={false}>
          {record.name}
        </ConditionalLink>
      </MemoryRouter>
    )
    const testInstance = testRenderer.root
    expect(testInstance.findByType('a').props.href).toEqual('/dir/project/1/')
  })

  it('unpublished project link with isOldVersion true is correct', () => {
    const record = { ...init }
    const testRenderer = TestRenderer.create(
      <MemoryRouter>
        <ConditionalLink record={record} isProgram={false} isOldVersion>
          {record.name}
        </ConditionalLink>
      </MemoryRouter>
    )
    const testInstance = testRenderer.root
    expect(testInstance.findByType('a').props.href).toEqual('/projects/1')
  })

  it('unpublished program link is correct', () => {
    const record = { ...init, isProgram: true }
    const testRenderer = TestRenderer.create(
      <MemoryRouter>
        <ConditionalLink record={record} isProgram>
          {record.name}
        </ConditionalLink>
      </MemoryRouter>
    )
    const testInstance = testRenderer.root
    expect(testInstance.findByType('a').props.href).toEqual('/programs/1')
  })
})

/**
 * Published program or project link
 */
describe('Check all published program or project link is correct', () => {
  const init = {
    id: 1,
    name: 'Project 1',
    isProgram: false,
    status: 'published',
    editable: true,
    restricted: false
  }
  it('published project link with editable true is correct', () => {
    const record = { ...init }
    const testRenderer = TestRenderer.create(
      <MemoryRouter>
        <ConditionalLink record={record} isProgram={false}>
          {record.name}
        </ConditionalLink>
      </MemoryRouter>
    )
    const testInstance = testRenderer.root
    expect(testInstance.findByType('a').props.href).toEqual('/projects/1/results')
  })

  it('published project link with editable false is correct', () => {
    const record = { ...init, editable: false }
    const testRenderer = TestRenderer.create(
      <MemoryRouter>
        <ConditionalLink record={record} isProgram={false}>
          {record.name}
        </ConditionalLink>
      </MemoryRouter>
    )
    const testInstance = testRenderer.root
    expect(testInstance.findByType('a').props.href).toEqual('/projects/1/results')
  })

  it('published project link with restricted true is correct', () => {
    const record = { ...init, restricted: true }
    const testRenderer = TestRenderer.create(
      <MemoryRouter>
        <ConditionalLink record={record} isProgram={false}>
          {record.name}
        </ConditionalLink>
      </MemoryRouter>
    )
    const testInstance = testRenderer.root
    expect(testInstance.findByType('a').props.href).toEqual('/dir/project/1/')
  })

  it('published project link with isOldVersion true is correct', () => {
    const record = { ...init }
    const testRenderer = TestRenderer.create(
      <MemoryRouter>
        <ConditionalLink record={record} isProgram={false} isOldVersion>
          {record.name}
        </ConditionalLink>
      </MemoryRouter>
    )
    const testInstance = testRenderer.root
    expect(testInstance.findByType('a').props.href).toEqual('/en/myrsr/my_project/1/')
  })

  it('published program link is correct', () => {
    const record = { ...init, isProgram: true }
    const testRenderer = TestRenderer.create(
      <MemoryRouter>
        <ConditionalLink record={record} isProgram>
          {record.name}
        </ConditionalLink>
      </MemoryRouter>
    )
    const testInstance = testRenderer.root
    expect(testInstance.findByType('a').props.href).toEqual('/programs/1')
  })
})
