from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from akvo.password_policy.models import PasswordHistory


class Command(BaseCommand):
    help = "Populate user's password history"

    def handle(self, *args, **options):
        existed = PasswordHistory.objects.values('user')
        for user in get_user_model().objects.exclude(id__in=existed):
            PasswordHistory.objects.create(user=user, password=user.password)
