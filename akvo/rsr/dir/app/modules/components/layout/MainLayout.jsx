import React from 'react'
import { Layout } from 'antd'

const MainLayout = ({ children, ...props }) => {
  return (
    <Layout className="main-layout" {...props}>
      <div className="ui-container">
        {children}
      </div>
    </Layout>
  )
}

export default MainLayout
