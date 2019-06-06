/* global document */
// forked from https://github.com/gabergg/react-scrollable-anchor/blob/master/src/utils/scroll.js
export const getScrollTop = () => {
  return document.body.scrollTop || document.documentElement.scrollTop
}

// get vertical offsets of element, taking scrollTop into consideration
export const getElementOffset = (element) => {
  const scrollTop = getScrollTop()
  const {top, bottom} = element.getBoundingClientRect()
  return {
    top: Math.floor(top + scrollTop),
    bottom: Math.floor(bottom + scrollTop)
  }
}

// does scrollTop live within element bounds?
export const doesElementContainScrollTop = (element, extraOffset = 0) => {
  const scrollTop = getScrollTop()
  const offsetTop = getElementOffset(element).top + extraOffset
  return scrollTop >= offsetTop// && scrollTop < offsetTop + element.offsetHeight
}

// given a set of anchors, find which one is, given the following logic:
// 1. children nodes are more relevant than parent nodes
// 2. if neither node contains the other, and their top locations differ,
//    the node with the top lower on the page is more relevant
// 3. if neither node contains the other, and their top locations are the same,
//    the node with the bottom higher on the page is more relevant
// 4. if neither node contains the other, and their top and bottom locations
//    are the same, a node is chosen at random, in a deterministic way,
//    to be more relevant.
export const getBestAnchorGivenScrollLocation = (anchors, offset) => {
  let bestId

  Object.keys(anchors).forEach((id) => {
    const element = anchors[id]
    if (element && doesElementContainScrollTop(element, offset)) {
      bestId = id
    }
  })
  return bestId
}
