# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class HostAlias(object):

    CI      = 'ci'
    DATA    = 'data'
    LIVE    = 'live'
    MEDIA   = 'media'
    TEST    = 'test'
    TEST2   = 'test2'
    UAT     = 'uat'


class SSHConnection(object):

    connection_map  = { HostAlias.CI:       'ci.akvo.org:2275',
                        HostAlias.DATA:     'www.akvo.org:22',
                        HostAlias.LIVE:     'www.akvo.org:22',
                        HostAlias.MEDIA:    '89.233.254.43:2268',
                        HostAlias.TEST:     'test.akvo.org:2270',
                        HostAlias.TEST2:    'test2.akvo.org:2273',
                        HostAlias.UAT:      'uat.akvo.org:2279' }

    @staticmethod
    def for_host(host_alias):
        if host_alias not in SSHConnection.connection_map:
            raise LookupError('No SSH connection details for: %s' % host_alias)

        return SSHConnection.connection_map[host_alias]


class HostPathValues(object):

    DEFAULT = { 'config_home':                  '/usr/local/etc/akvo',
                'repo_checkout_home':           '/var/git',
                'virtualenvs_home':             '/var/virtualenvs',
                'static_media_home':            '/var/www',
                'logging_home':                 '/var/log/akvo',
                'deployment_processing_home':   '/var/tmp/rsr' }

    LIVE    = { 'config_home':                  DEFAULT['config_home'],
                'repo_checkout_home':           '/var/lib/django',
                'virtualenvs_home':             DEFAULT['virtualenvs_home'],
                'static_media_home':            DEFAULT['static_media_home'],
                'logging_home':                 DEFAULT['logging_home'],
                'deployment_processing_home':   DEFAULT['deployment_processing_home'] }

    TEST2   = { 'config_home':                  '/usr/local/etc/akvo/test2',
                'repo_checkout_home':           '/var/dev/test2',
                'virtualenvs_home':             '/var/dev/virtualenvs/test2',
                'static_media_home':            '/var/www/test2',
                'logging_home':                 '/var/log/akvo',
                'deployment_processing_home':   '/var/tmp/rsr/test2' }


class DataHostPaths(object):

    def __init__(self):
        self.django_apps_home           = '/var/lib/django'
        self.virtualenvs_home           = HostPathValues.DEFAULT['virtualenvs_home']
        self.logging_home               = HostPathValues.DEFAULT['logging_home']
        self.deployment_processing_home = HostPathValues.DEFAULT['deployment_processing_home']


class DeploymentHostPaths(object):

    host_paths_map  = { HostAlias.CI:       HostPathValues.DEFAULT,
                        HostAlias.LIVE:     HostPathValues.LIVE,
                        HostAlias.TEST:     HostPathValues.DEFAULT,
                        HostAlias.TEST2:    HostPathValues.TEST2,
                        HostAlias.UAT:      HostPathValues.DEFAULT }

    def __init__(self, host_paths):
        self.config_home                = host_paths['config_home']
        self.repo_checkout_home         = host_paths['repo_checkout_home']
        self.virtualenvs_home           = host_paths['virtualenvs_home']
        self.static_media_home          = host_paths['static_media_home']
        self.logging_home               = host_paths['logging_home']
        self.deployment_processing_home = host_paths['deployment_processing_home'] # temp directory for handling deployment activity

    @staticmethod
    def default():
        return DeploymentHostPaths(HostPathValues.DEFAULT)

    @staticmethod
    def for_host(host_alias):
        if host_alias not in DeploymentHostPaths.host_paths_map:
            raise LookupError('No host path configuration for: %s' % host_alias)

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

    def __repr__(self):
        return repr([self.config_home, self.repo_checkout_home, self.virtualenvs_home,
                     self.static_media_home, self.logging_home, self.deployment_processing_home])
