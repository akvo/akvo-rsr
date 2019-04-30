import React from 'react'
import RichTextEditor from 'react-rte'

const toolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN'],
  INLINE_STYLE_BUTTONS: [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'}
  ],
  BLOCK_TYPE_DROPDOWN: [
    {label: 'Normal', style: 'unstyled'},
    {label: 'Heading Large', style: 'header-one'},
    {label: 'Heading Medium', style: 'header-two'},
    {label: 'Heading Small', style: 'header-three'}
  ],
  BLOCK_TYPE_BUTTONS: [
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'}
  ]
}
class RTE extends React.Component {
  constructor(props){
    super(props)
    const state = {}
    if(props.value !== ''){
      state.value = RichTextEditor.createValueFromString(props.value, 'markdown')
    } else {
      state.value = RichTextEditor.createEmptyValue()
    }
    this.state = state
  }
  handleChange = (value) => {
    this.setState({ value })
    if(this.props.onChange){
      this.props.onChange(value.toString('markdown'))
    }
  }
  render(){
    return (
      <RichTextEditor value={this.state.value} onChange={this.handleChange} toolbarConfig={toolbarConfig} />
    )
  }
}

export default RTE
