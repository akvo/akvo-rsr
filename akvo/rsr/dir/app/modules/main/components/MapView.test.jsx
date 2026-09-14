/* global test, expect */
import React from 'react'
import renderer, { act } from 'react-test-renderer'
import { MapView } from './MapView'

// jsdom provides no WebGL context, which is exactly the situation in Chromium with hardware
// acceleration disabled or a blocklisted GPU. Without the guard in MapView, the mapbox-gl
// constructor throws from inside a commit-phase effect, React tears the whole tree down, and
// the directory page renders as a blank screen. This asserts we degrade to a map-less page
// instead of losing everything.
test('renders the page when the browser has no WebGL', () => {
  const mapRef = { current: null }
  let tree
  act(() => {
    tree = renderer.create(<MapView mapRef={mapRef} filter={{}} directories={[]} />)
  })
  expect(tree.toJSON()).toBeTruthy()
  expect(mapRef.current).toBeNull()
})
