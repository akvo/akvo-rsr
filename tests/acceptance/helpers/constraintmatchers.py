# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# The following match classes facilitate constraint matching in tests

class MatcherBase:

    _description = "items"

    def __init__(self, test_case, expected_value):
        self._test_case = test_case
        self._expected_value = expected_value

    def set_description(self, new_description):
        self._description = new_description

    def evaluate(self, object_to_evaluate):
        raise Exception("Missing evaluate() method implementation for %s" % self.__class__)


class ExactMatcher(MatcherBase):

    def evaluate(self, actual_value):
        self._test_case.failUnlessEqual(self._expected_value, actual_value,
                                        "Expected exactly %i %s.  Actual %s: %i" %
                                            (self._expected_value, self._description, self._description, actual_value))


class AtLeastMatcher(MatcherBase):

    def evaluate(self, actual_value):
        self._test_case.failUnless(self._expected_value <= actual_value,
                                   "Expected at least %i %s.  Actual %s: %i" %
                                        (self._expected_value, self._description, self._description, actual_value))
