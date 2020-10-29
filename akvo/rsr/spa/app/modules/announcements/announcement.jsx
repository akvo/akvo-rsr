import React, { useState, useEffect } from 'react'
import { Button, Icon, Modal } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Player } from '@lottiefiles/react-lottie-player'
import list from './list'
import AnnouncementModal from './modal'
import lottieJson from '../../images/alert2.json'

export default connect()(({ userRdr, openMenu }) => {
  const [showModal, setShowModal] = useState(false)
  const [highlight, setHighlight] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  useEffect(() => {
    const hasNew = userRdr.seenAnnouncements.length < list.length
    setHighlight(hasNew)
  }, [userRdr])
  useEffect(() => {
    const hasNew = userRdr.seenAnnouncements.length < list.length
    setTimeout(() => {
      setShowPrompt(hasNew)
    }, 1000)
  }, [])
  const explore = () => {
    setShowPrompt(false)
    setShowModal(true)
  }
  const dismiss = () => {
    setShowPrompt(false)
  }
  return [
    <div className={classNames('announcement-btn', {highlight})} role="button" tabIndex={-1} onClick={() => setShowModal(true)}>
      <Icon type="notification" />
      {highlight ? 'New features are here' : 'Latest features'}
    </div>,
    <Modal visible={showPrompt} onCancel={() => setShowPrompt(false)} footer={null} className="announcement-prompt" width={400}>
      <div className="content">
        <Player
          autoplay
          loop
          src={lottieJson}
          style={{ height: '250px', width: '300px' }}
        />
        <h2>New features are here!</h2>
      </div>
      <Button type="primary" size="large" onClick={explore}>Explore</Button>&nbsp;
      <Button size="large" onClick={dismiss}>Dismiss</Button>
    </Modal>,
    userRdr.seenAnnouncements && <AnnouncementModal visible={showModal} onCancel={() => setShowModal(false)} {...{ userRdr, openMenu, list }} />
  ]
})
