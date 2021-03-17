import { Button, Icon } from 'antd'
import React from 'react'
import './pending-approval.scss'

const PendingApproval = ({ results }) => {
  return (
    <div className="pending-approval-grid">
      <ul>
        <li>
          <div className="label">result</div>
          <h4>Improved KAP about safe WASH</h4>
        </li>
        <Icon type="right" />
        <li>
          <div className="label">indicator</div>
          <h4>% of people who have knowledge about improved water sources</h4>
        </li>
      </ul>
      <div className="row">
        <ul>
          <li>
            <div className="label">period</div>
            <div className="value">01 Jan 2018 - 31 Mar 2018</div>
          </li>
          <li>
            <div className="label">value</div>
            <strong className="value">8</strong>
          </li>
          <li>
            <div className="label">submitted</div>
            <div className="value">8 days ago by Irene Westra</div>
          </li>
          <li>
            <div className="label">value comment</div>
            <small>something goes here what is it</small>
          </li>
          <li>
            <div className="label">attachments</div>
            <a href="#">file_name_here.jpg</a>
            <a href="#">another_file_name_here.jpg</a>
          </li>
        </ul>
        <div className="btns">
          <Button type="primary">Approve</Button>
          <Button type="link">Decline</Button>
        </div>
      </div>
    </div>
  )
}

export default PendingApproval
