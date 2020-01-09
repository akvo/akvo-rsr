# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields


def edit_budget_items(apps, schema_editor):
    try:
        BudgetItem = apps.get_model("rsr", "BudgetItem")
        BudgetItemLabel = apps.get_model("rsr", "BudgetItemLabel")

        # Create new labels
        other_label = BudgetItemLabel.objects.create(label='Other')
        BudgetItemLabel.objects.create(label='Monitoring & evaluation')
        BudgetItemLabel.objects.create(label='Office costs')
        BudgetItemLabel.objects.create(label='Staff costs')
        BudgetItemLabel.objects.create(label='Water resource management')

        # Capitalise all labels
        for label in BudgetItemLabel.objects.all():
            label.label = label.label.capitalize()
            label.save()

        # Rename 'Transportation' to 'Transportation / logistics'
        transportation_label = BudgetItemLabel.objects.get(label='Transportation')
        transportation_label.label = 'Transportation / logistics'
        transportation_label.save()

        # Rename 'Pr & marketing' to 'PR & marketing'
        pr_label = BudgetItemLabel.objects.get(label='Pr & marketing')
        pr_label.label = 'PR & marketing'
        pr_label.save()

        # Replace old labels
        for budget_item in BudgetItem.objects.all():
            if budget_item.label.label in ['Other 1', 'Other 2', 'Other 3']:
                budget_item.label = other_label
                budget_item.save()
            elif budget_item.label.label in ['Building material', 'Equipment', 'Overhead']:
                old_label = budget_item.label.label
                budget_item.label = other_label
                budget_item.other_extra = old_label
                budget_item.save()

        # Remove old labels
        for label in BudgetItemLabel.objects.all():
            if label.label in ['Other 1', 'Other 2', 'Other 3', 'Building material', 'Equipment',
                               'Overhead']:
                label.delete()
    except:
        pass


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0017_auto_20150722_1519'),
    ]

    operations = [
        migrations.RunSQL(
            "DROP INDEX IF EXISTS rsr_budgetitem_project_id_label_id;"
        ),
        migrations.AlterField(
            model_name='budgetitem',
            name='other_extra',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='Extra information about the exact nature of an "other" budget item.', max_length=30, null=True, verbose_name='"Other" labels extra info', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='budgetitemlabel',
            name='label',
            field=akvo.rsr.fields.ValidXMLCharField(unique=True, max_length=30, verbose_name='label', db_index=True),
            preserve_default=True,
        ),
        migrations.RunPython(
            edit_budget_items,
        ),
    ]
