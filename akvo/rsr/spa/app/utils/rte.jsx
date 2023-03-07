/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-unused-state */
import React from 'react'
import RichTextEditor from 'react-rte'

const toolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN'],
  INLINE_STYLE_BUTTONS: [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' }
  ],
  BLOCK_TYPE_DROPDOWN: [
    { label: 'Normal', style: 'unstyled' },
    { label: 'Heading Large', style: 'header-one' },
    { label: 'Heading Medium', style: 'header-two' },
    { label: 'Heading Small', style: 'header-three' }
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' }
  ]
}
class RTE extends React.Component {
  constructor(props) {
    super(props)
    const plainText = props?.value
    const defaultValue = plainText.length > 0
      ? RichTextEditor.createValueFromString(plainText, 'markdown')
      : RichTextEditor.createEmptyValue()
    this.state = {
      value: defaultValue,
      plainText
    }
  }

  componentDidUpdate(prevProps, prevState) {
    /**
     * I create an exception for empty values when this component has a request to reset its value.
     */
    if (this.props?.value !== prevState?.plainText && this.props?.value === '') {
      this.setState({
        value: RichTextEditor.createValueFromString(this.props?.value, 'markdown'),
        plainText: this.props?.value
      })
    }
  }

  handleChange = (value) => {
    this.setState({ value, plainText: value })
    if (this.props.onChange) {
      this.props.onChange(value.toString('markdown'))
    }
  }
  render() {
    const { disabled, placeholder } = this.props
    return (
      <RichTextEditor className="rte" onChange={this.handleChange} {
        ...{
          value: this.state?.plainText === '' ? RichTextEditor.createValueFromString(this.props?.value, 'markdown') : this.state.value,
          toolbarConfig,
          disabled,
          placeholder
        }
      }
      />
    )
  }
}

export default RTE
