import React, { Suspense, useState, lazy, useEffect } from 'react'
import { connect } from 'react-redux'
import { Modal, Spin, Tabs } from 'antd'
import moment from 'moment'
import api from '../../utils/api'

const { TabPane } = Tabs
const importView = date =>
  lazy(() =>
    import(`./${date}.jsx`).catch(() => import('./null-view'))
  )

export default connect()(({ visible, onCancel, openMenu, userRdr, dispatch, list }) => {
  const [Body, setBody] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const handleOpenAnn = async (item) => {
    setSelectedIndex(String(list.findIndex(it => it.date === item.date)))
    const View = await importView(item.date)
    setBody(View)
    if (userRdr.seenAnnouncements.indexOf(item.date) === -1) {
      api.patch(`/user/${userRdr.id}/`, {
        seenAnnouncements: [...userRdr.seenAnnouncements, item.date]
      })
      dispatch({ type: 'SEEN_ANNOUNCEMENT', date: item.date })
    }
  }
  useEffect(() => {
    // select most recent unseen announcement
    if(visible){
      const unseen = list.filter(it => userRdr.seenAnnouncements.indexOf(it.date) === -1)
      if (unseen.length > 0) {
        handleOpenAnn(unseen[0])
      }
      else {
        handleOpenAnn(list[0])
      }
    }
  }, [visible])
  const handleTabChange = (index) => {
    handleOpenAnn(list[index])
  }
  const resetDev = () => {
    api.patch(`/user/${userRdr.id}/`, { seenAnnouncements: [] })
  }
  return (
    <Modal {...{visible, onCancel}} footer={null} width={770} className="announcement-modal">
      <div className="reset-dev" onClick={resetDev}>RESET NOTIFICATIONS</div>
      <Tabs tabPosition="left" activeKey={selectedIndex} onChange={handleTabChange}>
        {list.map((item, index) => {
          const seen = userRdr.seenAnnouncements.indexOf(item.date) !== -1
          return (
            <TabPane
              tab={[
                <h5 className={!seen ? 'highlight' : ''}>{item.title}</h5>,
                <span className="date">{moment(item.date, 'DD-MM-YYYY').format('DD MMM YYYY')}</span>
              ]}
              key={index}
            />
          )
        })
        }
      </Tabs>
      <div className="body">
        {Body != null && <Suspense fallback={<div><Spin /></div>}><Body close={onCancel} {...{ openMenu }} /></Suspense>}
      </div>
    </Modal>
  )
})
