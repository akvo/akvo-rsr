/* global window */

// jsdom does not implement URL.createObjectURL, which mapbox-gl calls at import time to spin
// up its web worker. A stub is enough - nothing under test exercises the worker.
window.URL.createObjectURL = () => ''
