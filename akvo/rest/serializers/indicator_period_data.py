# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from django.contrib.auth import get_user_model
from rest_framework import serializers

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rest.serializers.user import UserDetailsSerializer
from akvo.rsr.models import IndicatorPeriod, IndicatorPeriodData, IndicatorPeriodDataComment


class IndicatorPeriodDataCommentSerializer(BaseRSRSerializer):

    user_details = UserDetailsSerializer(required=False, source='user')

    class Meta:
        model = IndicatorPeriodDataComment


class IndicatorPeriodDataSerializer(BaseRSRSerializer):

    user_details = UserDetailsSerializer(required=False, source='user')
    status_display = serializers.ReadOnlyField()
    photo_url = serializers.ReadOnlyField()
    file_url = serializers.ReadOnlyField()

    class Meta:
        model = IndicatorPeriodData


class IndicatorPeriodDataFrameworkSerializer(BaseRSRSerializer):

    period = serializers.PrimaryKeyRelatedField(queryset=IndicatorPeriod.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())
    comments = IndicatorPeriodDataCommentSerializer(read_only=True, many=True, required=False)
    user_details = UserDetailsSerializer(required=False, source='user')
    status_display = serializers.ReadOnlyField()
    photo_url = serializers.ReadOnlyField()
    file_url = serializers.ReadOnlyField()
    # HACK: In DRF3, any boolean field which is missing is assumed to be False,
    # because HTML checkboxes are dropped from forms, when unchecked.  But, we
    # we have a default value of True for this field in the model. So, we use a
    # NullBooleanField to accept a None and use it as a True.
    # http://www.django-rest-framework.org/topics/release-notes/?q=BooleanField#322
    # A more correct fix would be to ensure that the form which submits this
    # data has a hidden checkbox for relative_data that is always checked.
    relative_data = serializers.NullBooleanField(required=False)

    class Meta:
        model = IndicatorPeriodData
