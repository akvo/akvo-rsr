# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

class ViewCounter:

    def __init__(self, identifier, view_count):
        self.identifier = identifier
        self.view_counts = [int(view_count)]

    def record_view_count(self, view_count):
        self.view_counts.append(int(view_count))

    def counts_have_incremented_in_recording_period(self):
        return self.view_counts[-1] > self.view_counts[0]

    def __str__(self):
        return str({self.identifier: self.view_counts})


class ViewCountRecorder:

    def __init__(self):
        self.view_counter_dictionary = {}

    def record_view_counts(self, latest_view_count_dictionary):
        for project_identifier, view_count in latest_view_count_dictionary.iteritems():
            if project_identifier in self.view_counter_dictionary:
                self.view_counter_dictionary[project_identifier].record_view_count(view_count)
            else:
                self.view_counter_dictionary[project_identifier] = ViewCounter(project_identifier, view_count)

    def at_least_one_view_count_has_increased(self):
        for view_counter in self.view_counter_dictionary.values():
            if view_counter.counts_have_incremented_in_recording_period(): return True

        return False

    def __str__(self):
        return str(map(lambda view_counter: {view_counter.identifier: view_counter.view_counts}, self.view_counter_dictionary.values()))
