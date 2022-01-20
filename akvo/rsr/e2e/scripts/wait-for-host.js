#!/usr/bin/env node

const waitOn = require('wait-on')
const { exit } = require('process')

const RSR_DOMAIN = process.env.RSR_DOMAIN || 'http://localhost';
const TIMEOUT = parseInt(process.env.TIMEOUT) || 120;

const opts = {
  resources: [RSR_DOMAIN],
  timeout: TIMEOUT * 1000,
};

(async () => {
  try {
    await waitOn(opts);
    console.log('Site reachable');
  } catch (e) {
    console.error('Site unreachable');
    exit(1);
  }
})();
