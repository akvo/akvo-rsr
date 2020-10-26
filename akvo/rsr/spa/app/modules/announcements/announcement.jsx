import React, { useState, useEffect } from 'react'
import { Icon } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import list from './list'
import Modal from './modal'

export default connect()(({ userRdr, openMenu }) => {
  const [showModal, setShowModal] = useState(false)
  const [highlight, setHighlight] = useState(false)
  useEffect(() => {
    if (userRdr.seenAnnouncements){
      setHighlight(userRdr.seenAnnouncements.length < list.length)
    }
  }, [userRdr])
  return [
    <div className={classNames('announcement-btn', {highlight})} role="button" tabIndex={-1} onClick={() => setShowModal(true)}>
      <Icon type="notification" />
      {highlight ? 'New features are here' : 'Latest features'}
    </div>,
    userRdr.seenAnnouncements && <Modal visible={showModal} onCancel={() => setShowModal(false)} {...{ userRdr, openMenu, list }} />
  ]
})
