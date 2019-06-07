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
    expect(state1.section1.fields)
      .toMatchObject(action1.fields)

    const action2 = {
      type: actionTypes.SAVE_FIELDS,
      sectionIndex: 1,
      fields: {
        iatiID: 123
      }
    }
    expect(reducer(state1, action2).section1.fields)
      .toMatchObject({...action1.fields, ...action2.fields})
  })

  const addContactAction = {
    type: actionTypes.ADD_SET_ITEM,
    sectionIndex: 2,
    setName: 'contacts'
  }

  const addResultAction = {
    type: actionTypes.ADD_SET_ITEM,
    sectionIndex: 5,
    setName: 'results',
    item: {
      title: 'Test result',
      indicators: []
    }
  }
  const addIndicatorAction = {
    type: actionTypes.ADD_SET_ITEM,
    sectionIndex: 5,
    setName: 'results[0].indicators',
    item: {
      title: 'Indicator test 1',
      disaggregations: []
    }
  }

  it('should ADD_SET_ITEM', () => {
    expect(reducer(undefined, addContactAction).section2.fields.contacts)
      .toHaveLength(1)
    expect(initialState.section2.fields.contacts)
      .toHaveLength(0)
    // test section5 actions (deep paths)
    const state2 = reducer(undefined, addResultAction)
    expect(reducer(state2, addIndicatorAction).section5.fields.results[0].indicators).toHaveLength(1)
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

    // section 5 specific deep paths
    const state3 = reducer(undefined, addResultAction)
    const state4 = reducer(state3, addIndicatorAction)
    const editIndicatorAction = {
      type: actionTypes.EDIT_SET_ITEM,
      sectionIndex: 5,
      setName: 'results[0].indicators',
      itemIndex: 0,
      fields: {
        title: 'Edited Indicator Title'
      }
    }
    const state5 = reducer(state4, editIndicatorAction)
    expect(state5.section5.fields.results[0].indicators[0].title).toEqual(editIndicatorAction.fields.title)
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
