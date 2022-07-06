# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.utils import rsr_send_mail
from django.conf import settings
from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['POST'])
def demo_request(request):
    serializer = DemoRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    data = serializer.validated_data
    mail_to = getattr(settings, 'RSR_DEMO_REQUEST_TO_EMAILS', [])
    if mail_to:
        rsr_send_mail(
            mail_to,
            subject='demo_request/subject.txt',
            message='demo_request/message.txt',
            subject_context=data,
            msg_context=data
        )
    return Response({'message': 'success'})


class DemoRequestSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField(required=False, allow_blank=True)
    akvo_hub = serializers.CharField()
    message = serializers.CharField()

    class Meta:
        fields = '__all__'
