# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class HostPathValues(object):

    DEFAULT = { 'config_home':                  '/usr/local/etc/akvo',
                'repo_checkout_home':           '/var/git',
                'virtualenvs_home':             '/var/virtualenvs',
                'static_media_home':            '/var/www',
                'logging_home':                 '/var/log/akvo',
                'deployment_processing_home':   '/var/tmp/rsr'}

    LIVE    = { 'config_home':                  DEFAULT['config_home'],
                'repo_checkout_home':           '/var/lib/django',
                'virtualenvs_home':             DEFAULT['virtualenvs_home'],
                'static_media_home':            DEFAULT['static_media_home'],
                'logging_home':                 DEFAULT['logging_home'],
                'deployment_processing_home':   DEFAULT['deployment_processing_home']}

    TEST2   = { 'config_home':                  '/usr/local/etc/akvo/test2',
                'repo_checkout_home':           '/var/dev/test2',
                'virtualenvs_home':             '/var/dev/virtualenvs/test2',
                'static_media_home':            '/var/www/test2',
                'logging_home':                 '/var/log/akvo',
                'deployment_processing_home':   '/var/tmp/rsr/test2'}


class HostAlias(object):

    CI      = 'ci'
    LIVE    = 'live'
    TEST    = 'test'
    TEST2   = 'test2'
    UAT     = 'uat'


class DeploymentHostPaths(object):

    host_paths_map  = { HostAlias.CI:       HostPathValues.DEFAULT,
                        HostAlias.LIVE:     HostPathValues.LIVE,
                        HostAlias.TEST:     HostPathValues.DEFAULT,
                        HostAlias.TEST2:    HostPathValues.TEST2,
                        HostAlias.UAT:      HostPathValues.DEFAULT}

    def __init__(self, host_paths):
        self.config_home                = host_paths['config_home']
        self.repo_checkout_home         = host_paths['repo_checkout_home']
        self.virtualenvs_home           = host_paths['virtualenvs_home']
        self.static_media_home          = host_paths['static_media_home']
        self.logging_home               = host_paths['logging_home']
        self.deployment_processing_home = host_paths['deployment_processing_home'] # temp directory for handling deployment activity

    @staticmethod
    def for_host(host_alias):
        if host_alias not in DeploymentHostPaths.host_paths_map:
            raise LookupError('No host path configuration for %s' % host_alias)

        return DeploymentHostPaths(DeploymentHostPaths.host_paths_map[host_alias])

    def __eq__(self, host_paths):
        return (self.config_home                == host_paths.config_home and
                self.repo_checkout_home         == host_paths.repo_checkout_home and
                self.virtualenvs_home           == host_paths.virtualenvs_home and
                self.static_media_home          == host_paths.static_media_home and
                self.logging_home               == host_paths.logging_home and
                self.deployment_processing_home == host_paths.deployment_processing_home)

    def __ne__(self, host_paths):
        return not self.__eq__(host_paths)
