# Generated by Django 3.2.18 on 2024-02-19 07:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0229_organisation_enforce_2fa'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='enforce_2fa',
            field=models.BooleanField(default=False, help_text='Enfore related users (through employment or project access) to enable their 2FA', verbose_name='Enforce 2-Factor-Authentication'),
        ),
    ]