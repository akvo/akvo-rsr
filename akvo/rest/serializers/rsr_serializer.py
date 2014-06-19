# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import serializers


# These classes are for easy switching between URL based foreign key representation and ID based
# If we want both it might make sense to use a meta class to keep the underlying code DRY

class BaseRSRSerializer(serializers.HyperlinkedModelSerializer):
    pass


# class BaseRSRSerializer(serializers.ModelSerializer):
#     pass