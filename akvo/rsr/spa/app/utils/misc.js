export const datePickerConfig = {
  format: 'DD/MM/YYYY',
  placeholder: 'DD/MM/YYYY'
}

export const havePropsChanged = (props, nextProps, prevProps) => {
  let hasChanged = false
  for(let i = 0; i < props.length; i += 1){
    if(nextProps[props[i]] !== prevProps[props[i]]){
      hasChanged = true
      break
    }
  }
  return hasChanged
}

export const Aux = node => node.children

export const inputNumberAmountFormatting = {
  formatter: value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  parser: value => value.replace(/(,*)/g, '')
}
