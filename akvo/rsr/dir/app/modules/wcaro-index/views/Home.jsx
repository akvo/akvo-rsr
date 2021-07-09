import React from 'react'
import { Slider, Summarize, Stories } from '../components'

const Home = ({
  slides,
  summary,
  results,
  stories
}) => {
  return (
    <>
      <Slider items={slides} />
      <Summarize items={summary} />
      <Stories {...{ results, stories }} />
    </>
  )
}

export default Home
