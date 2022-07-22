import React from 'react'

const MainLayout = ({ children, className = 'main-layout', ...props }) => {
  return (
    <div className={className} {...props}>
      <div className="ui-container">
        {children}
      </div>
    </div>
  )
}

export default MainLayout
