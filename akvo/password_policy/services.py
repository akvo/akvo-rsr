from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser
from akvo.password_policy.models import PasswordHistory, PolicyConfig


class PasswordHistoryService:
    def __init__(self, user: AbstractUser, config: PolicyConfig):
        self.user = user
        self.config = config

    @property
    def limit(self):
        if self.config.reuse:
            return self.config.reuse
        if self.config.expiration:
            return 1
        return 0

    def push(self, password):
        if not self.limit:
            return
        PasswordHistory.objects.create(user=self.user, password=make_password(password))
        self._remove_excess()

    def _remove_excess(self):
        entries = PasswordHistory.objects.filter(user=self.user)
        if entries.count() <= self.limit:
            return
        cursor = entries[self.limit:self.limit + 1].get()
        entries.filter(created_at__lte=cursor.created_at).delete()
