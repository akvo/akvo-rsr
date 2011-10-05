# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class SystemPackageSpecifications(object):

    COMPILATION =   [{'name': 'linux-libc-dev',     'version': '2.6.24-29.93'},
                     {'name': 'gcc-4.2-base',       'version': '4.2.4-1ubuntu4'},
                     {'name': 'libgcc1',            'version': '1:4.2.4-1ubuntu4'},
                     {'name': 'libc6',              'version': '2.7-10ubuntu8'},
                     {'name': 'libc6-dev',          'version': '2.7-10ubuntu8'},
                     {'name': 'binutils',           'version': '2.18.1~cvs20080103-0ubuntu1'},
                     {'name': 'libgomp1',           'version': '4.2.4-1ubuntu4'},
                     {'name': 'cpp-4.2',            'version': '4.2.4-1ubuntu4'},
                     {'name': 'cpp',                'version': '4:4.2.3-1ubuntu6'},
                     {'name': 'gcc-4.2',            'version': '4.2.4-1ubuntu4'},
                     {'name': 'gcc',                'version': '4:4.2.3-1ubuntu6'},
                     {'name': 'libstdc++6',         'version': '4.2.4-1ubuntu4'},
                     {'name': 'libstdc++6-4.2-dev', 'version': '4.2.4-1ubuntu4'},
                     {'name': 'g++-4.2',            'version': '4.2.4-1ubuntu4'},
                     {'name': 'g++',                'version': '4:4.2.3-1ubuntu6'},
                     {'name': 'make',               'version': '3.81-3build1'}]

    CORE_UTILS =    [{'name': 'libattr1',           'version': '1:2.4.39-1'},
                     {'name': 'libacl1',            'version': '2.2.45-1'},
                     {'name': 'libselinux1',        'version': '2.0.55-0ubuntu4'},
                     {'name': 'coreutils',          'version': '6.10-3ubuntu2'}]

    PACKAGE_TOOLS = [{'name': 'libbz2-1.0',         'version': '1.0.4-2ubuntu4.1'},
                     {'name': 'bzip2',              'version': '1.0.4-2ubuntu4.1'},
                     {'name': 'cpio',               'version': '2.9-6ubuntu1'},
                     {'name': 'lzma',               'version': '4.43-12ubuntu1'},
                     {'name': 'patch',              'version': '2.5.9-4'},
                     {'name': 'libdb4.6',           'version': '4.6.21-6ubuntu1'},
                     {'name': 'libgdbm3',           'version': '1.8.3-3'},
                     {'name': 'perl-base',          'version': '5.8.8-12ubuntu0.5'},
                     {'name': 'perl-modules',       'version': '5.8.8-12ubuntu0.5'},
                     {'name': 'perl',               'version': '5.8.8-12ubuntu0.5'},
                     {'name': 'libtimedate-perl',   'version': '1.1600-9'},
                     {'name': 'dpkg',               'version': '1.14.16.6ubuntu4.2'},
                     {'name': 'dpkg-dev',           'version': '1.14.16.6ubuntu4.2'},
                     {'name': 'build-essential',    'version': '11.3ubuntu1'}]

    LOCALES_AND_LANGUAGES = [{'name': 'liblocale-gettext-perl',     'version': '1.05-2ubuntu1'},
                             {'name': 'libtext-charwidth-perl',     'version': '0.04-4build1'},
                             {'name': 'libtext-iconv-perl',         'version': '1.4-3'},
                             {'name': 'libtext-wrapi18n-perl',      'version': '0.06-5'},
                             {'name': 'debconf-i18n',               'version': '1.5.20'},
                             {'name': 'debconf',                    'version': '1.5.20'},
                             {'name': 'tzdata',                     'version': '2011g~repack-0ubuntu0.8.04'},
                             {'name': 'belocs-locales-bin',         'version': '2.4-2.2ubuntu7'},
                             {'name': 'locales',                    'version': '2.7.9-4'},
                             {'name': 'language-pack-en-base',      'version': '1:8.04+20100117.1'},
                             {'name': 'language-pack-en',           'version': '1:8.04+20100117.1'}]

    PYTHON =    [{'name': 'zlib1g',                 'version': '1:1.2.3.3.dfsg-7ubuntu1'},
                 {'name': 'libncurses5',            'version': '5.6+20071124-1ubuntu2'},
                 {'name': 'libncursesw5',           'version': '5.6+20071124-1ubuntu2'},
                 {'name': 'readline-common',        'version': '5.2-3build1'},
                 {'name': 'libreadline5',           'version': '5.2-3build1'},
                 {'name': 'libsqlite3-0',           'version': '3.4.2-2'},
                 {'name': 'libssl0.9.8',            'version': '0.9.8g-4ubuntu3.13'},
                 {'name': 'mime-support',           'version': '3.39-1ubuntu1'},
                 {'name': 'python2.5-minimal',      'version': '2.5.2-2ubuntu6.1'},
                 {'name': 'python2.5',              'version': '2.5.2-2ubuntu6.1'},
                 {'name': 'python-minimal',         'version': '2.5.2-0ubuntu1'},
                 {'name': 'python',                 'version': '2.5.2-0ubuntu1'}]

    PYTHON_PACKAGE_DEPENDENCIES =   [{'name': 'libxml2',    'version': '2.6.31.dfsg-2ubuntu1.6'}]

    DATABASE =  [{'name': 'mysql-common',           'version': '5.0.51a-3ubuntu5.8'},
                 {'name': 'libmysqlclient15off',    'version': '5.0.51a-3ubuntu5.8'},
                 {'name': 'python-support',         'version': '0.7.5ubuntu1'},
                 {'name': 'python-mysqldb',         'version': '1.2.2-5ubuntu1'}]

    ADDITIONAL_TOOLS =  [{'name': 'libcomerr2',         'version': '1.40.8-2ubuntu2'},
                         {'name': 'libidn11',           'version': '1.1-1'},
                         {'name': 'libkeyutils1',       'version': '1.2-4'},
                         {'name': 'libkrb53',           'version': '1.6.dfsg.3~beta1-2ubuntu1.8'},
                         {'name': 'libgpg-error0',      'version': '1.4-2ubuntu7'},
                         {'name': 'libgcrypt11',        'version': '1.2.4-2ubuntu7'},
                         {'name': 'liblzo2-2',          'version': '2.02-3'},
                         {'name': 'libopencdk10',       'version': '0.6.6-1ubuntu1'},
                         {'name': 'libtasn1-3',         'version': '1.1-1'},
                         {'name': 'libgnutls13',        'version': '2.0.4-1ubuntu2.6'},
                         {'name': 'libsasl2-modules',   'version': '2.1.22.dfsg1-18ubuntu2.1'},
                         {'name': 'libsasl2-2',         'version': '2.1.22.dfsg1-18ubuntu2.1'},
                         {'name': 'libldap-2.4-2',      'version': '2.4.9-0ubuntu0.8.04.5'},
                         {'name': 'libcurl3',           'version': '7.18.0-1ubuntu2.3'},
                         {'name': 'curl',               'version': '7.18.0-1ubuntu2.3'},
                         {'name': 'wget',               'version': '1.10.2-3ubuntu1.2'}]

    ALL_PACKAGES =  [COMPILATION, CORE_UTILS, PACKAGE_TOOLS, LOCALES_AND_LANGUAGES,
                     PYTHON, PYTHON_PACKAGE_DEPENDENCIES, DATABASE, ADDITIONAL_TOOLS]
