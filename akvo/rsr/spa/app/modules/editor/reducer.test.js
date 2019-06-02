/* global describe, it */
import expect from 'expect'
import reducer, { initialState } from './reducer'
import * as actions from './actions'
import actionTypes from './action-types'

describe('editor reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle SAVE_FIELDS', () => {
    const action1 = {
      type: actionTypes.SAVE_FIELDS,
      sectionIndex: 1,
      fields: {
        title: 'Test title',
        subtitle: 'Test subtitle'
      }
    }
    const state1 = reducer(undefined, action1)
    expect(state1)
      .toHaveProperty(`section${action1.sectionIndex}.fields`, action1.fields)

    const action2 = {
      type: actionTypes.SAVE_FIELDS,
      sectionIndex: 1,
      fields: {
        iatiID: 123
      }
    }
    expect(reducer(state1, action2))
      .toHaveProperty(`section${action1.sectionIndex}.fields`, {...action1.fields, ...action2.fields})
  })

  const addContactAction = {
    type: actionTypes.ADD_SET_ITEM,
    sectionIndex: 2,
    setName: 'contacts'
  }

  it('should ADD_SET_ITEM', () => {
    expect(reducer(undefined, addContactAction).section2.fields.contacts)
      .toHaveLength(1)
    expect(initialState.section2.fields.contacts)
      .toHaveLength(0)
  })

  it('should EDIT_SET_ITEM', () => {
    const action = {
      type: actionTypes.EDIT_SET_ITEM,
      sectionIndex: 2,
      setName: 'contacts',
      itemIndex: 0,
      fields: { name: 'Finn' }
    }
    const state1 = reducer(undefined, addContactAction)
    const state2 = reducer(state1, action)
    expect(state2.section2.fields.contacts[0].name)
      .toEqual('Finn')

    const action2 = {
      ...action,
      fields: { phone: 123 }
    }
    expect(reducer(state2, action2).section2.fields.contacts[0].phone)
      .toEqual(123)
  })

  it('should REMOVE_SET_ITEM', () => {
    const action = {
      type: actionTypes.REMOVE_SET_ITEM,
      sectionIndex: 2,
      setName: 'contacts',
      itemIndex: 0
    }
    const state1 = reducer(undefined, addContactAction)
    expect(state1.section2.fields.contacts).toHaveLength(1)
    expect(reducer(state1, action).section2.fields.contacts).toHaveLength(0)
  })
})
