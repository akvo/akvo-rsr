from datetime import timedelta
from typing import Optional
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.models import AbstractUser
from django.db.models import QuerySet
from django.utils.timezone import now
from akvo.password_policy.models import PasswordHistory, PolicyConfig


class PasswordHistoryService:
    def __init__(self, user: AbstractUser, config: Optional[PolicyConfig] = None):
        self.user = user
        self.config = config

    @property
    def reuse_limit(self) -> int:
        return self.config.reuse if self.config else 0

    def is_expired(self) -> bool:
        if not self.config:
            return False
        if not self.config.expiration:
            return False
        expired_at = now() - timedelta(days=self.config.expiration)
        latest = self.latest()
        if not latest:
            return False
        return latest.created_at < expired_at

    def contains(self, password: str) -> bool:
        if not self.reuse_limit:
            return False
        entries = self._queryset()
        for entry in entries[:self.reuse_limit]:
            if check_password(password, entry.password):
                return True
        return False

    def push(self, password: str):
        PasswordHistory.objects.create(user=self.user, password=make_password(password))
        self._remove_excess()

    def latest(self) -> Optional[PasswordHistory]:
        return self._queryset().first()

    def _queryset(self) -> QuerySet[PasswordHistory]:
        return PasswordHistory.objects\
            .filter(user=self.user)\
            .order_by("-created_at")

    def _remove_excess(self):
        entries = self._queryset()
        # Keep at least 1 for the user's current password
        offset = self.reuse_limit if self.reuse_limit else 1
        if entries.count() <= offset:
            return
        cursor = entries[offset:offset + 1].get()
        entries.filter(created_at__lte=cursor.created_at).delete()
