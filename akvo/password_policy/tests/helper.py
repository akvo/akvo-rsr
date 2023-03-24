from datetime import timedelta
from django.contrib.auth import get_user_model

from akvo.password_policy.models import PolicyConfig
from akvo.password_policy.services import PasswordHistoryService

User = get_user_model()


class PasswordHistoryServiceTestBuilder:
    def __init__(self):
        self.user = None
        self.config = None
        self.no_config = False

    def with_user(self, user):
        self.user = user
        return self

    def with_config(self, config):
        self.config = config
        return self

    def with_no_config(self):
        self.no_config = True
        return self

    def build(self):
        if not self.user:
            self.user = User(username='test')
        if not self.config and not self.no_config:
            self.config = PolicyConfig(expiration=1, reuse=2)
        self.user.save()
        return PasswordHistoryService(self.user, self.config)
