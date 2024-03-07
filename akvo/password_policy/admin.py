from django.contrib import admin

from akvo.password_policy.models import PolicyConfig, RegexRuleConfig


class RegexRuleConfigInline(admin.TabularInline):
    model = RegexRuleConfig
    extra = 1


@admin.register(PolicyConfig)
class PolicyConfigAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {"fields": ("name", "expiration", "reuse", "min_length")}),
        (
            "Character requirements",
            {
                "fields": (
                    "letters",
                    "uppercases",
                    "numbers",
                    "symbols",
                )
            },
        ),
        ("Prohibited words", {"fields": ("no_common_password", "no_user_attributes")}),
    )
    inlines = (RegexRuleConfigInline,)


