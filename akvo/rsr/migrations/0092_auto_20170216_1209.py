# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from __future__ import print_function

from django.db import models, migrations, transaction

# rsr_partnersite id,Name,Piwikid
MISSING_DATA = """\
151,afdb,118
122,akvoeastafrica,119
127,akvoflow,120
136,akvoppp3,121
125,akvowestafrica,123
138,drydev,124
154,eutf,125
121,iccoasia,126
135,iccoindia,127
106,iggwater,128
142,kepa,129
147,leprosyrelief,130
123,nlembassykenya,131
150,nlembassymozambique,132
152,nso-g4aw,133
126,pind,134
130,planfinland,135
153,snvworld,136
149,vnginternational,137
134,walkingforwater2016,138
144,walkingforwater2017,139
133,wandelenvoorwater2016,140
143,wandelenvoorwater2017,141
131,washmali,142
145,worldveg,143
103,yepprogrammes,144
"""


def assign_piwik_ids(apps, schema_editor):
    PartnerSite = apps.get_model('rsr', 'PartnerSite')

    with transaction.atomic():
        for line in MISSING_DATA.strip().splitlines():
            partner_site_id, hostname, piwik_id = line.split(',')
            try:
                partner_site = PartnerSite.objects.get(id=partner_site_id)
            except PartnerSite.DoesNotExist:
                pass
            else:
                if not partner_site.hostname == hostname:
                    print("{0}'s host name is '{1}', expected '{2}'. Skipping!".format(
                        partner_site_id, partner_site.hostname, hostname
                    ))
                    continue

                partner_site.piwik_id = piwik_id
                partner_site.save()


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0091_auto_20170208_1035'),
    ]

    operations = [
        migrations.RunPython(
            assign_piwik_ids,
            # Required to not crash when trying to run a backwards migration
            reverse_code=lambda x, y: None
        )
    ]
