# -*- coding: utf-8 -*-

from lettuce import after, before, step, world
from splinter.browser import Browser

world.SITE_UNDER_TEST = 'test.akvo.org'
world.PAYPAL_MASTER_USER ='test@akvo.org'
world.PAYPAL_MASTER_PASSWORD = 'akvotest'
world.PAYPAL_TEST_USER = 'test_1352204974_per@akvo.org'
#world.PAYPAL_TEST_USER_PASSWORD = '361456090' 
world.PAYPAL_TEST_USER_PASSWORD = 'akvotest' 
world.AKVO_ADMIN_USER = 'admintest'
world.AKVO_ADMIN_PASSWORD = 'testing123'
world.DECIMALS_DEBUG = 0 		# set to 0 if this flag is not switched on in the test target (or 1 if it is)
world.PAYPAL_TEST_VISA = '4131363167241088'
world.PAYPAL_TEST_VISA_EXP_MONTH = '11'
world.PAYPAL_TEST_VISA_EXP_YEAR = '2017'
world.PAYPAL_MAX_DONATION_AMOUNT = '8000'
world.PAYPAL_FEE_PCT_USD = 3.9  # 3.9% transaction fee
world.PAYPAL_FEE_BASE_USD = 0.30  # plus ¢30
world.PAYPAL_FEE_PCT_EUR = 3.4  # 3.4% transaction fee
world.PAYPAL_FEE_BASE_EUR = 0.35  # plus ¢35
world.MOLLIE_FEE_BASE = 1.20  # ¢99 plus 
world.MOLLIE_VAT_PCT = 20  # Dutch VAT changed on Mollie fee
world.MOLLIE_NOTIFICATION_EMAIL = 'test@akvo.org' 
world.MOLLIE_PARTNER_ID = '281135'


@before.all
def setUp():
    world.browser = Browser('firefox')

#@after.all
#def tearDown(test_results):
#    world.browser.quit()

