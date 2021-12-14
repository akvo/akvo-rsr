from django.conf import settings
from django.core.cache import caches
from django.core.management.base import BaseCommand, CommandError
from django.contrib.sessions.models import Session


class Command(BaseCommand):
    help = "Log everybody out. Requires cached_db SESSION_ENGINE"

    def handle(self, **options):
        if settings.SESSION_ENGINE != 'django.contrib.sessions.backends.cached_db':
            raise CommandError("Session engine %s is unsupported" % settings.SESSION_ENGINE)
        # Delete sessions from DB
        sessions = Session.objects.all()
        print(f"Deleting {sessions.count()} sessions")
        sessions.delete()

        # Delete all cached sessions
        cache = caches[settings.SESSION_CACHE_ALIAS]
        cached_sessions = [key for key in cache.list_keys() if "cached_db" in key]
        print(f"Deleting {len(cached_sessions)} cached sessions")
        cache.delete_many(cached_sessions)
