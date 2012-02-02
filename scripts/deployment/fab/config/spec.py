# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.loader import ConfigType


class HostConfigSpecification(object):

    def create_preconfigured_with(self, host_alias):
        return self._format_spec(ConfigType.PRECONFIGURED, [host_alias])

    def create_standard_with(self, host_alias, repository_branch, database_name):
        return self._format_spec(ConfigType.STANDARD, [host_alias, repository_branch, database_name])

    def create_custom_with(self, custom_config_module_path):
        return self._format_spec(ConfigType.CUSTOM, [custom_config_module_path])

    def _format_spec(self, config_type_specifier, config_values):
        return "%s:%s" % (config_type_specifier, ';'.join(config_values))
