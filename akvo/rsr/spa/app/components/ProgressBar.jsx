import React from 'react'

const ProgressBar = ({ percent }) => (
  <div className="ant-progress ant-progress-line ant-progress-status-normal ant-progress-default">
    <div>
      <div className="ant-progress-outer">
        <div className="ant-progress-inner">
          <div className="ant-progress-bg" style={{ width: `${percent}%` }}>
            <p>{`${percent}%`}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default ProgressBar
