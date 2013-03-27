# -*- coding: utf-8 -*-

from lettuce import after, before, step, world
from splinter.browser import Browser

from site_under_test import *


@before.all
def setUp():
    world.browser = Browser('firefox')

@after.all
def tearDown(test_results):
    world.browser.quit()
