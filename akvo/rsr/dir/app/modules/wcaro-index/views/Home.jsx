import React from 'react'
import { Slider, Summarize, Stories } from '../components'

const Home = ({
  user,
  slides,
  summary,
  results,
  stories,
  setMenuKey
}) => {
  return (
    <>
      <Slider items={slides} {...{ user, setMenuKey }} />
      <Summarize items={summary} />
      <Stories {...{ results, stories }} />
    </>
  )
}

export default Home
