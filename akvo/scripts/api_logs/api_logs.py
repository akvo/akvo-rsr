# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import re

from datetime import datetime


def dates_for_path(path, path_n_date):
    bits = []
    for item in path_n_date:
        if item['path'] == path:
            bits += [item['date']]
    return bits


def analyze_log(filename):
    path_n_date = []
    post_pattern = re.compile('"POST\s[/|\w]*')
    when_pattern = re.compile('\[.*\]')
    with open(filename) as f:
        for line in f:
            # find '"POST /api/v1/iati_activity/' in log line
            post_path = post_pattern.search(line)
            # remove '"POST '
            path = post_path.group().split(" ")[1]
            # replace '/nnn/' with '/*/' so we ignore different IDs
            replace_id = re.compile('/[\d]*/')
            path = replace_id.sub('/<id>/', path)

            # find e.g. '[13/Mar/2015:13:15:50 +0100]'
            when = when_pattern.search(line).group()[1:-1]
            # get the date, '13/Mar/2015'
            when = when.split(':')[0]
            dt_when = datetime.strptime(when, "%d/%b/%Y")

            path_n_date += [{'path': path, 'date': dt_when.date()}]

    paths = [item['path'] for item in path_n_date]
    unique = list(set(paths))

    stats = []

    # create a list of tuples on the form
    # (number of requests, request path, latest date a request was made)
    for path in unique:
        stats += [(paths.count(path), path, max(dates_for_path(path, path_n_date)))]

    # sort on latest date, change s[2] to s[0 or 1] to sort on count or path
    sorted_stats = sorted(stats, key=lambda s: s[2])
    for stat in sorted_stats:
        print "{:>6} {} {}".format(stat[0], stat[1], str(stat[2]))
    print 'Number of "unique" endpoints:', len(sorted_stats)

if __name__ == '__main__':
    print("\n***** List of /api/... calls *****")
    analyze_log('api_post.txt')
    print("\n***** List of /rest/... calls *****")
    analyze_log('rest_post.txt')
