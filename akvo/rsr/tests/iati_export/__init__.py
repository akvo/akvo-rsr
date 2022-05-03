from datetime import datetime
from unittest.util import safe_repr

from lxml import etree
from xmlunittest import XmlTestMixin


class AkvoXmlMixin(XmlTestMixin):
    def assertXmlAttributeIsXsdDateTime(self, node: etree.Element, attribute: str, msg: str = None) -> datetime:
        """
        Checks if the given node with the provided attribute has a datetime str value in xsd:dateTime

        https://www.w3schools.blog/xsd-date-and-time-data-types

        :return: The datetime value of the attribute
        """
        self.assertXmlHasAttribute(node, attribute)
        attr_val = node.attrib[attribute]
        try:
            return datetime.fromisoformat(attr_val)
        except ValueError:
            standard_msg = "%s is not a valid ISO formatted datetime" % safe_repr(attr_val)
            self.fail(self._formatMessage(msg, standard_msg))

    def assertDatetimeEqual(self, left_dt: datetime, right_dt: datetime, microseconds=False):
        """
        Ensures that two datetimes are equal by converting them to timestamps

        In this manner, timezones don't matter
        :param left_dt:
        :param right_dt:
        :param microseconds: Include microseconds in the comparison
        :return:
        """
        self.assertIsNotNone(left_dt)
        self.assertIsNotNone(right_dt)

        left_ts = left_dt.timestamp()
        right_ts = right_dt.timestamp()
        if microseconds:
            self.assertAlmostEqual(left_ts, right_ts)
        else:
            self.assertEqual(int(left_ts), int(right_ts))
