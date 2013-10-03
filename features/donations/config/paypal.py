# -*- coding: utf-8 -*-

from lettuce import world


world.DECIMALS_DEBUG = 0 # set to 0 if this flag is not switched on in the test target (or 1 if it is)
world.PAYPAL_TEST_VISA = '4131363167241088'
world.PAYPAL_TEST_VISA_EXP_MONTH = '11'
world.PAYPAL_TEST_VISA_EXP_YEAR = '2017'
world.PAYPAL_MAX_DONATION_AMOUNT = '8000'
world.PAYPAL_FEE_PCT_USD = 3.9  # 3.9% transaction fee
world.PAYPAL_FEE_BASE_USD = 0.30  # plus ¢30
world.PAYPAL_FEE_PCT_EUR = 3.4  # 3.4% transaction fee
world.PAYPAL_FEE_BASE_EUR = 0.35  # plus ¢35
