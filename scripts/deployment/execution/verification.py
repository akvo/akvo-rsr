# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import sys


def display_deployment_script_usage(script_name):
    print 'Usage: %s "host_config_specification"' % script_name
    print '       where host config is specified as either one of:'
    print '           preconfigured:host_alias'
    print '           standard:host_alias;repository_branch;database_name'
    print '           custom:/path/to/fab/config/custom.py\n'

def display_usage_and_exit_if_host_config_spec_is_missing(script_name):
    if len(sys.argv) < 2:
        print 'Missing parameter: host_config_specification'
        display_deployment_script_usage(script_name)
        sys.exit(1)
