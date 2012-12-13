# -*- coding: utf-8 -*-

from lettuce import after, before, step, world
from splinter.browser import Browser

world.SITE_UNDER_TEST = 'uat.akvo.org'
world.PAYPAL_MASTER_USER ='test@akvo.org'
world.PAYPAL_MASTER_PASSWORD = 'akvotest'
world.PAYPAL_TEST_USER = 'test_1352204974_per@akvo.org'
world.PAYPAL_TEST_USER_PASSWORD = 'akvotest' 
world.AKVO_ADMIN_USER = 'admintest'
world.AKVO_ADMIN_PASSWORD = 'testing123'
world.DECIMALS_DEBUG = 0 		# set to 0 if this flag is not switched on in the test target (or 1 if it is)
world.PAYPAL_TEST_VISA = '4131363167241088'
world.PAYPAL_TEST_VISA_EXP_MONTH = '11'
world.PAYPAL_TEST_VISA_EXP_YEAR = '2017'


@before.all
def setUp():
    world.browser = Browser('firefox')

@after.all
def tearDown(test_results):
    world.browser.quit()

