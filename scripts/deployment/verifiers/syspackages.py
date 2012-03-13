# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from verifiers.helpers.dependencies import CommandDependency, DependencyVerifier, HeaderDirectoryDependency, HeaderFileDependency, LibraryDependency


class SystemPackageVerifier(object):

    def ensure_expected_system_components_are_installed(self):
        # perhaps load these dependency assertions from a YAML file in future
        verifier = DependencyVerifier()
        verifier.add(CommandDependency("mysql_config", "MySQL", "MySQL-python"))
        verifier.add(HeaderFileDependency("libiconv", "iconv.h", "lxml"))
        verifier.add(HeaderDirectoryDependency("libxml2", "lxml"))
        verifier.add(HeaderDirectoryDependency("libxslt", "lxml"))
        verifier.add(HeaderFileDependency("libjpeg", "jpeglib.h", "PIL"))
        verifier.add(HeaderFileDependency("zlib", "zlib.h", "PIL"))

        print "\n>> Verifying expected system components for building Python modules:"
        verifier.verify_all()
        print
        if verifier.not_all_dependencies_met():
            print ">> Not all expected dependencies were met:"
            verifier.display_dependency_warnings()
            print
            raise Exception("Missing dependencies for building required Python modules: %s" % verifier.missing_dependencies())
