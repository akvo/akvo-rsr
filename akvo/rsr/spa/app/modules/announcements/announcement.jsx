/* global window */
import React, { useState, useEffect } from 'react'
import { Button, Modal, Popover } from 'antd'
import { connect } from 'react-redux'
import { Player } from '@lottiefiles/react-lottie-player'
import list from './list'
import AnnouncementModal from './modal'
import lottieJson from '../../images/alert2.json'
import HelpLinks from './HelpLinks'


export default connect()(({ userRdr, openMenu }) => {
  const [showModal, setShowModal] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  useEffect(() => {
    const hasNew = userRdr.seenAnnouncements.length < list.length
    setTimeout(() => {
      setShowPrompt(hasNew)
    }, 1000)
  }, [userRdr])
  useEffect(() => {
    const onScroll = () => {
      if (showHelp) {
        setShowHelp(false)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [showHelp])
  const explore = () => {
    setShowPrompt(false)
    setShowModal(true)
  }
  const dismiss = () => {
    setShowPrompt(false)
  }
  return (
    <>
      <Popover
        content={(
          <div className="announcement-popover">
            <HelpLinks userRole={userRdr?.userRole} />
            <div className="new-feature-container">
              <Button type="link" onClick={() => setShowModal(true)} className="new-feature">New Features</Button>
            </div>
          </div>
        )}
        trigger="click"
        placement="top"
        visible={showHelp}
      >
        <Button
          type="primary"
          icon={showHelp ? 'close' : 'question'}
          size="large"
          shape="circle"
          className="announcement-btn-circle"
          onClick={() => setShowHelp(!showHelp)}
        />
      </Popover>
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
      </Modal>
      {userRdr.seenAnnouncements && <AnnouncementModal key="2" visible={showModal} onCancel={() => setShowModal(false)} {...{ userRdr, openMenu, list }} />}
    </>
  )
})
