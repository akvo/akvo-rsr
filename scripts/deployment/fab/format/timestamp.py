# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import datetime


class TimeStampFormatter(object):

    def append_timestamp(self, text):
        return "%s_%s" % (text, self.file_timestamp())

    def file_timestamp(self):
        return self._utc_datetime_now().strftime('%Y%m%d_%H%M%S') # i.e. 20110408_162032

    def _utc_datetime_now(self):
        return datetime.datetime.utcnow()
