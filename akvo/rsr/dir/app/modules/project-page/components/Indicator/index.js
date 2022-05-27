import React, { useState } from 'react'

import Quantitative from './Quantitative'
import Qualitative from './Qualitative'
import PanelHeader from './PanelHeader'

const Indicator = ({
  showProgress,
  resultID,
  period,
  periods,
  search,
  type,
  items,
  setItems,
  ...props
}) => {
  const [dsgOpen, setDsgOpen] = useState(false)
  return (
    <>
      {type === 1 && (
        <Quantitative
          {...{
            ...props,
            type,
            period,
            periods,
            dsgOpen,
            items,
            setItems,
            setDsgOpen
          }}
        />
      )}
      {type === 2 && <Qualitative {...{ periods }} />}
    </>
  )
}

Indicator.Header = PanelHeader

export default Indicator
