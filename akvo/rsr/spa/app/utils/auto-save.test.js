/* global it, describe, jest */
import React from 'react'
import expect from 'expect'
import renderer from 'react-test-renderer'
import {AutoSave} from './auto-save'

describe('AutoSave', () => {
  jest.useFakeTimers()

  const initialValues = {
    title: '',
    subtitle: ''
  }
  const mockSaveFields = jest.fn(props => {})
  const reducer = {
    editorRdr: {
      section1: {
        fields: initialValues
      }
    }
  }

  it('should call saveFields', () => {
    const root = renderer.create(
      <AutoSave values={initialValues} sectionIndex={1} {...reducer} saveFields={mockSaveFields} />
    )
    jest.runAllTimers()
    root.update(<AutoSave values={{ title: 'something', subtitle: '' }} sectionIndex={1} {...reducer} saveFields={mockSaveFields} />)
    jest.runAllTimers()
    expect(mockSaveFields).toHaveBeenCalled()
  })
  it('should pass empty strings for deleted values', () => {
    const root = renderer.create(
      <AutoSave values={{ title: 'something', subtitle: '' }} sectionIndex={1} {...reducer} saveFields={mockSaveFields} />
    )
    jest.runAllTimers()
    root.update(<AutoSave values={{ subtitle: '' }} sectionIndex={1} {...reducer} saveFields={mockSaveFields} />)
    jest.runAllTimers()
    expect(mockSaveFields).toHaveBeenCalledWith({ title: '' }, 1, false)
  })
})
