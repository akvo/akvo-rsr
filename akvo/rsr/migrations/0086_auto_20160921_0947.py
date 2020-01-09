# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0085_auto_20160920_1448'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='invoice',
            name='project',
        ),
        migrations.RemoveField(
            model_name='invoice',
            name='user',
        ),
        migrations.DeleteModel(
            name='Invoice',
        ),
        migrations.RemoveField(
            model_name='paymentgatewayselector',
            name='mollie_gateway',
        ),
        migrations.DeleteModel(
            name='MollieGateway',
        ),
        migrations.RemoveField(
            model_name='paymentgatewayselector',
            name='paypal_gateway',
        ),
        migrations.RemoveField(
            model_name='paymentgatewayselector',
            name='project',
        ),
        migrations.DeleteModel(
            name='PaymentGatewaySelector',
        ),
        migrations.DeleteModel(
            name='PayPalGateway',
        ),
    ]
