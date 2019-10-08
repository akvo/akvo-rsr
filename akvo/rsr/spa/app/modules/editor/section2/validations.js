import * as yup from 'yup'
import contacts from './contacts/validations'

const validationSetIds = [1, 3, 6]

const setDef = {}
validationSetIds.forEach(id => {
  setDef[id] = {}
  if(contacts.hasOwnProperty(id)){
    setDef[id].contacts = contacts[id]
  }
})

const defs = {}

validationSetIds.forEach(setId => {
  defs[setId] = yup.object().shape(setDef[setId])
})
