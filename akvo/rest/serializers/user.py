# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.auth import get_user_model
from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers

from .employment import EmploymentSerializer
from .organisation import OrganisationExtraSerializer, OrganisationBasicSerializer
from .rsr_serializer import BaseRSRSerializer


class UserRawSerializer(BaseRSRSerializer):
    """
    Raw user serializer.
    """

    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'first_name',
            'last_name',
            'email',
            'is_active',
            'is_staff',
            'is_admin',
            'is_support',
            'is_superuser',
        )


class UserSerializer(BaseRSRSerializer):
    # Needed to show only the first organisation of the user
    organisation = OrganisationExtraSerializer(source='first_organisation', required=False,)
    organisations = OrganisationExtraSerializer(many=True, required=False,)
    approved_employments = EmploymentSerializer(many=True, required=False,)
    # Legacy fields to support Tastypie API emulation
    legacy_org = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'first_name',
            'last_name',
            'email',
            'username',
            'is_active',
            'is_staff',
            'is_admin',
            'is_support',
            'is_superuser',
            'organisation',
            'organisations',
            'approved_employments',
            'legacy_org',
        )

    def __init__(self, *args, **kwargs):
        """ Delete the 'absolute_url' field added in BaseRSRSerializer.__init__().
        It's neither correct nor do we want this data to be visible.

        Remove the fields "legacy_org" and "username" that are only present to support older
        versions of Up calling the Tastypie API endpoints that we now emulate using DRF
        """
        super(UserSerializer, self).__init__(*args, **kwargs)
        del self.fields['absolute_url']

        # Remove the fields unless we're called via Tastypie URLs
        request = kwargs.get("context", {}).get("request", None)
        if request and "/api/v1/" not in request.path:
            del self.fields['legacy_org']
            del self.fields['username']

    def get_legacy_org(self, obj):
        """ Up needs the last tag to be the user's org, it only needs the org ID
        """
        if obj.first_organisation():
            return {"object": {"id": obj.first_organisation().id}}
        return None

    def get_username(self, obj):
        return obj.email


class UserPasswordSerializer(serializers.Serializer):
    """Change password serializer"""

    old_password = serializers.CharField(
        help_text='Current Password',
    )
    new_password1 = serializers.CharField(
        help_text='New Password',
    )
    new_password2 = serializers.CharField(
        help_text='New Password (confirmation)',
    )

    def validate_old_password(self, value):
        """Check for current password"""
        if not self.instance.check_password(value):
            raise serializers.ValidationError(_(u'Old password is not correct.'))
        return value

    def validate(self, data):
        """Check if password1 and password2 match"""
        if data['new_password1'] != data['new_password2']:
            raise serializers.ValidationError(_(u'Passwords do not match.'))
        return data

    def update(self, instance, validated_data):
        instance.set_password(validated_data.get('new_password2', instance.password))
        return instance


class UserDetailsSerializer(BaseRSRSerializer):

    approved_organisations = OrganisationBasicSerializer(many=True, required=False)
    email = serializers.ReadOnlyField()

    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'approved_organisations',
        )

    def __init__(self, *args, **kwargs):
        """ Delete the 'absolute_url' field added in BaseRSRSerializer.__init__().
        It's neither correct nor do we want this data to be visible.
        """
        super(UserDetailsSerializer, self).__init__(*args, **kwargs)
        del self.fields['absolute_url']
