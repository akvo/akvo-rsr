/* global window */
import React from 'react'
import { Modal } from 'antd'
import SVGInline from 'react-svg-inline'
import image from './images/server-error.svg'

let intid

class ErrorOverlay extends React.Component {
  state = {
    visible: true,
    seconds: 60
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        visible: true,
        seconds: 59
      })
    })
    if (intid) clearInterval(intid)
    intid = setInterval(() => {
      if (this.state.seconds === 0) {
        clearInterval(intid)
        this.setState({ visible: false })
        window.location.reload()
      } else {
        this.setState({ seconds: this.state.seconds - 1 })
      }
    }, 1000)
  }
  render() {
    const { visible, seconds } = this.state
    return (
      <Modal
        visible={visible}
        footer={null}
        closable={false}
        width="calc(100% - 40px)"
        className="error-overlay"
      >
        <div className="content">
          <div className="text">
            <h1>Server Maintenance</h1>
            <p>{`We'll be back in ${seconds} seconds`}</p>
          </div>
          <div className="svg">
            <SVGInline svg={image} />
          </div>
        </div>
      </Modal>
    )
  }
}

export default ErrorOverlay
