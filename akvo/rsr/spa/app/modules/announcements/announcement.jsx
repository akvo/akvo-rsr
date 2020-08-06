import React, { useState, useEffect, lazy } from 'react'
import { Icon, Dropdown, Menu } from 'antd'
import classNames from 'classnames'
import moment from 'moment'
import { connect } from 'react-redux'
import list from './list'
import Modal from './modal'
import api from '../../utils/api'

const importView = date =>
  lazy(() =>
    import(`./${date}.jsx`).catch(() => import('./null-view'))
  )

export default connect()(({ userRdr, dispatch, openMenu }) => {
  const [showModal, setShowModal] = useState(false)
  const [highlight, setHighlight] = useState(false)
  const [modalBody, setModalBody] = useState(null)
  useEffect(() => {
    if (userRdr.seenAnnouncements){
      setHighlight(userRdr.seenAnnouncements.length < list.length)
    }
  }, [userRdr])
  const handleOpenAnn = (item) => async () => {
    // const _Body = await require(`./${item.date}.jsx`).default // eslint-disable-line
    // console.log(_Body)
    const View = await importView(item.date)
    setModalBody(View)
    setShowModal(true)
    if (userRdr.seenAnnouncements.indexOf(item.date) === -1){
      api.patch(`/user/${userRdr.id}/`, {
        seenAnnouncements: [...userRdr.seenAnnouncements, item.date]
      })
      dispatch({ type: 'SEEN_ANNOUNCEMENT', date: item.date })
    }
  }
  return [
    list.length > 0 &&
    <Dropdown
      trigger={['click']}
      overlay={
        <Menu className="ann-menu">
          {list.map((item, index) => {
            const seen = userRdr.seenAnnouncements && userRdr.seenAnnouncements.indexOf(item.date) !== -1
            return (
              <Menu.Item key={index} className={classNames({seen})} onClick={handleOpenAnn(item)}>
                <span className="date">{moment(item.date, 'DD-MM-YYYY').format('DD MMM YYYY')}</span>
                {item.title}
              </Menu.Item>
            )
          }
          )}
        </Menu>
      }
    >
      <div className={classNames('announcement', {highlight})} role="button" tabIndex={-1}>
        <Icon type="notification" />
        {highlight ? 'New features are here' : 'Latest features'}
      </div>
    </Dropdown>,
    <Modal visible={showModal} onCancel={() => setShowModal(false)} {...{userRdr, Body: modalBody, openMenu}} />
  ]
})
