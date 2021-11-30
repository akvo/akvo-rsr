# Generated by Django 3.2.8 on 2021-11-30 10:59

from django.db import migrations, models
import django_ltree.fields
import uuid


def project_path_forward(apps, schema_editor):
    Project = apps.get_model("rsr", "Project")
    projects = list(Project.objects.all())
    for project in projects:
        project.uuid = uuid.uuid4()
        project.path = str(project.uuid).replace("-", "_")
    Project.objects.bulk_update(projects, ["path", "uuid"])


class Migration(migrations.Migration):
    dependencies = [
        ('rsr', '0216_django_3_2_upgrade'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='uuid',
            field=models.UUIDField(null=True, editable=False),
        ),
        migrations.AddField(
            model_name='project',
            name='path',
            field=django_ltree.fields.PathField(null=True),
            preserve_default=False,
        ),
        migrations.RunPython(project_path_forward),
        migrations.AlterField(
            model_name='project',
            name='uuid',
            field=models.UUIDField(null=False, unique=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='project',
            name='path',
            field=django_ltree.fields.PathField(null=False, unique=True),
            preserve_default=False,
        ),
    ]
