# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# ElementParsingTestCase extends unittest.TestCase with common XML and HTML parsing assertion patterns

from unittest import TestCase

from helpers.constraintmatchers import *

class ElementParsingTestCase(TestCase):

    def assert_element(self, element):
        self._actual_element = element
        return self

    def is_not_none_and_has_tag(self, expected_tag):
        self.is_not_none()
        self.has_tag(expected_tag)

    def is_not_none(self):
        self.failUnless(self._actual_element, "Expected an element -- received None instead")

    def is_not_empty(self):
        self.failUnless(self._actual_element.text,
                        "Element <%s> should not be empty -- expected element text" % (self._actual_element.tag))

    def has_text(self):
        self.is_not_empty()

    def has_tag(self, expected_tag):
        self.failUnlessEqual(expected_tag, self._actual_element.tag,
                             "Expected element tag: %s.  Actual tag: %s" % (expected_tag, self._actual_element.tag))

    def has_single_children_in_list(self, expected_child_tags):
        for expected_tag in expected_child_tags:
            self.has_exactly(1).child_with_tag(expected_tag)

    def has_exactly(self, exactly):
        self._matcher = ExactMatcher(self, exactly)
        return self

    def has_at_least(self, at_least):
        self._matcher = AtLeastMatcher(self, at_least)
        return self

    def children(self):
        self._describe_and_evaluate_children("child elements")

    def child(self):
        self._describe_and_evaluate_children("child element")

    def _describe_and_evaluate_children(self, child_or_children):
        self._matcher.set_description(child_or_children)
        self._matcher.evaluate(len(self._actual_element.getchildren()))

    def children_with_tag(self, expected_tag):
        self._describe_and_evaluate_children_with_tag("children", expected_tag)

    def child_with_tag(self, expected_tag):
        self._describe_and_evaluate_children_with_tag("child", expected_tag)

    def _describe_and_evaluate_children_with_tag(self, child_or_children, expected_tag):
        self._matcher.set_description("%s with tag <%s>" % (child_or_children, expected_tag))
        self._matcher.evaluate(len(self._actual_element.findall(expected_tag)))

    def elements_matching_xpath(self, expected_xpath):
        self._matcher.set_description("elements at path %s" % (expected_xpath))
        self._matcher.evaluate(len(self._actual_element.xpath(expected_xpath)))
