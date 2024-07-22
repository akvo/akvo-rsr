from typing import cast
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser

from akvo.password_policy.models import PolicyConfig
from akvo.password_policy.services import PasswordHistoryService

User = get_user_model()


class PasswordHistoryServiceTestBuilder:
    def __init__(self):
        self.user = None
        self.config = None
        self.no_config = False

    def with_user(self, user: AbstractUser):
        self.user = user
        return self

    def with_config(self, config: PolicyConfig):
        self.config = config
        return self

    def with_no_config(self):
        self.no_config = True
        return self

    def build(self):
        if not self.user:
            self.user = cast(AbstractUser, User(username="test"))
        if not self.config and not self.no_config:
            self.config = PolicyConfig.objects.create(expiration=1, reuse=2)
        self.user.save()
        return PasswordHistoryService(self.user, self.config)
