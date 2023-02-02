from django.db import models


class PolicyConfig(models.Model):
    name = models.CharField(max_length=100, unique=True)
    expiration = models.DurationField(blank=True, null=True)
    reuse = models.PositiveSmallIntegerField(
        blank=True, null=True, verbose_name="Reuse policy"
    )
    min_length = models.PositiveSmallIntegerField(default=5)
    letters = models.PositiveSmallIntegerField(blank=True, null=True, default=1)
    uppercases = models.PositiveSmallIntegerField(blank=True, null=True)
    numbers = models.PositiveSmallIntegerField(blank=True, null=True)
    symbols = models.PositiveSmallIntegerField(blank=True, null=True)
    no_common_password = models.BooleanField(default=False)
    no_user_attributes = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["-id"]


class RegexRuleConfig(models.Model):
    config = models.ForeignKey(
        PolicyConfig, on_delete=models.CASCADE, related_name="regex_rules"
    )
    pattern = models.CharField(max_length=255)
