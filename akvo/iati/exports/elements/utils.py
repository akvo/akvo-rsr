# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def has_data(obj, field_list=None):
    """ Return True if at least one field of obj in field_list has a truthy value
    """
    if field_list is not None:
        for field in field_list:
            if getattr(obj, field):
                return True
    return False


def has_qs_data(obj, related_field_list=None):
    """ Return True if at least one related field of obj in related_field_list contains objects
    """
    if related_field_list is not None:
        for qs in related_field_list:
            if getattr(obj, qs, None) and getattr(obj, qs).exists():
                return True
    return False
