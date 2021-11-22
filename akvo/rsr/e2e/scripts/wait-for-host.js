#!/usr/bin/env node

const isReachable = require('is-reachable');
const { exit } = require('process')

const RSR_DOMAIN = process.env.RSR_DOMAIN || 'http://localhost';

(async () => {
  const isReady = await isReachable(RSR_DOMAIN, {timeout: 30 * 1000});
  if (isReady) {
    console.log('Site reachable');
  } else {
    console.error('Site unreachable');
    exit(1)
  }
})();
