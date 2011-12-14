# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, sys


class ConfigVerifier(object):

    @staticmethod
    def exit_if_config_files_are_missing(config_file_paths):
        missing_files = []
        for file_path in config_file_paths:
            if not os.path.exists(file_path):
                missing_files.append(file_path)
            else:
                print ">> Found expected configuration file: %s" % file_path

        if len(missing_files) > 0:
            print ">> Missing configuration files: %s" % ", ".join(missing_files)
            print ">> Copy the associated template files and edit as necessary"
            sys.exit(1)

    @staticmethod
    def exit_if_config_file_is_missing(config_file_path):
        if not os.path.exists(config_file_path):
            config_file_name = config_file_path.split('/')[-1]
            print ">> Configuration file missing: %s" % config_file_path
            print ">> Copy the %s.template file and edit as necessary" % config_file_name
            sys.exit(1)
        else:
            print ">> Found expected configuration file: %s" % config_file_path
