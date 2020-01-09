# -*- coding: utf-8 -*-


from django.db import models, migrations, transaction


MISSING_DATA = {
    'afrialliance': 146,
    'akvorsr': 36,
    'simavidemo': 0,  # Dummy number for demo site
    'unicefpacific': 147,
    'watershed': 148,
    'nlembassyindonesia': 149,
}


def add_piwik_ids(apps, schema_editor):
    """Migration adding piwik_id for PartnerSites not having them."""

    PartnerSite = apps.get_model('rsr', 'PartnerSite')

    with transaction.atomic():
        for hostname, piwik_id in MISSING_DATA.items():
            try:
                partner_site = PartnerSite.objects.get(hostname=hostname)
            except PartnerSite.DoesNotExist:
                continue
            else:
                partner_site.piwik_id = piwik_id
                partner_site.save()

    missing_piwik_id_sites = PartnerSite.objects.filter(piwik_id=None)
    hostnames = ', '.join(missing_piwik_id_sites.values_list('hostname', flat=True))

    assert missing_piwik_id_sites.count() == 0, 'Sites missing piwik_ids: {}'.format(hostnames)


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0093_auto_20170216_1409'),
    ]

    operations = [
        migrations.RunPython(add_piwik_ids, reverse_code=lambda x, y: None),

        migrations.AlterField(
            model_name='partnersite',
            name='piwik_id',
            field=models.PositiveIntegerField(verbose_name='Piwik analytics ID'),
            preserve_default=True,
        ),
    ]
