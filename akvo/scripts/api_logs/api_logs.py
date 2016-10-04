# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import re

def analyze_log(filename):
    paths = []
    with open(filename) as f:
        for line in f:
            # find '"POST /api/v1/iati_activity/' in log line
            p = re.compile('"POST\s[/|\w]*')
            m = p.search(line)
            # remove '"POST '
            path = m.group().split(" ")[1]
            # replace '/nnn/' with '/*/' so we ignore different IDs
            replace_id = re.compile('/[\d]*/')
            path = replace_id.sub('/*/', path)
            paths += [path]
    unique = list(set(paths))
    stats = []

    for path in unique:
        stats += [(paths.count(path), path)]
    sorted_stats = reversed(sorted(stats, key=lambda s: s[0]))
    for stat in sorted_stats:
        print stat[0], stat[1]

if __name__ == '__main__':
    print("\n***** List of /api/... calls *****")
    analyze_log('api_post.txt')
    print("\n***** List of /rest/... calls *****")
    analyze_log('rest_post.txt')

