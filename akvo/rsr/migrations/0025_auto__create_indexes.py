# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    # some indices may be already be created, use try:except to avoid explosions
    def forwards(self, orm):
        try:
            # Adding index on 'Organisation', fields ['organisation_type']
            db.create_index('rsr_organisation', ['organisation_type'])
        except:
            pass

        try:
            # Adding index on 'Organisation', fields ['name']
            db.create_index('rsr_organisation', ['name'])
        except:
            pass

        try:
            # Adding index on 'Organisation', fields ['iati_org_id']
            db.create_index('rsr_organisation', ['iati_org_id'])
        except:
            pass

        try:
            # Adding index on 'Category', fields ['name']
            db.create_index('rsr_category', ['name'])
        except:
            pass

        try:
            # Adding index on 'Project', fields ['status']
            db.create_index('rsr_project', ['status'])
        except:
            pass

        try:
            # Adding index on 'Project', fields ['title']
            db.create_index('rsr_project', ['title'])
        except:
            pass

        try:
            # Adding index on 'Project', fields ['funds']
            db.create_index('rsr_project', ['funds'])
        except:
            pass

        try:
            # Adding index on 'Project', fields ['funds_needed']
            db.create_index('rsr_project', ['funds_needed'])
        except:
            pass

        try:
            # Adding index on 'Project', fields ['budget']
            db.create_index('rsr_project', ['budget'])
        except:
            pass

        try:
            # Adding index on 'Partnership', fields ['iati_activity_id']
            db.create_index('rsr_partnership', ['iati_activity_id'])
        except:
            pass

        try:
            # Adding index on 'Partnership', fields ['internal_id']
            db.create_index('rsr_partnership', ['internal_id'])
        except:
            pass

        try:
            # Adding index on 'Partnership', fields ['partner_type']
            db.create_index('rsr_partnership', ['partner_type'])
        except:
            pass

        try:
            # Adding index on 'Partnership', fields ['funding_amount']
            db.create_index('rsr_partnership', ['funding_amount'])
        except:
            pass

        try:
            # Adding index on 'BudgetItemLabel', fields ['label']
            db.create_index('rsr_budgetitemlabel', ['label'])
        except:
            pass

        try:
            # Adding index on 'ProjectLocation', fields ['primary']
            db.create_index('rsr_projectlocation', ['primary'])
        except:
            pass

        try:
            # Adding index on 'ProjectLocation', fields ['longitude']
            db.create_index('rsr_projectlocation', ['longitude'])
        except:
            pass

        try:
            # Adding index on 'ProjectLocation', fields ['latitude']
            db.create_index('rsr_projectlocation', ['latitude'])
        except:
            pass

        try:
            # Adding index on 'Country', fields ['iso_code']
            db.create_index('rsr_country', ['iso_code'])
        except:
            pass

        try:
            # Adding index on 'Country', fields ['continent_code']
            db.create_index('rsr_country', ['continent_code'])
        except:
            pass

        try:
            # Adding index on 'OrganisationLocation', fields ['primary']
            db.create_index('rsr_organisationlocation', ['primary'])
        except:
            pass

        try:
            # Adding index on 'OrganisationLocation', fields ['longitude']
            db.create_index('rsr_organisationlocation', ['longitude'])
        except:
            pass

        try:
            # Adding index on 'OrganisationLocation', fields ['latitude']
            db.create_index('rsr_organisationlocation', ['latitude'])
        except:
            pass

        try:
            # Adding index on 'ProjectUpdate', fields ['update_method']
            db.create_index('rsr_projectupdate', ['update_method'])
        except:
            pass

        try:
            # Adding index on 'ProjectUpdate', fields ['title']
            db.create_index('rsr_projectupdate', ['title'])
        except:
            pass

        try:
            # Adding index on 'ProjectUpdate', fields ['time']
            db.create_index('rsr_projectupdate', ['time'])
        except:
            pass

        try:
            # Adding index on 'ProjectUpdate', fields ['time_last_updated']
            db.create_index('rsr_projectupdate', ['time_last_updated'])
        except:
            pass

        try:
            # Adding index on 'ProjectComment', fields ['time']
            db.create_index('rsr_projectcomment', ['time'])
        except:
            pass


    def backwards(self, orm):
        # Removing index on 'ProjectComment', fields ['time']
        db.delete_index('rsr_projectcomment', ['time'])

        # Removing index on 'ProjectUpdate', fields ['time_last_updated']
        db.delete_index('rsr_projectupdate', ['time_last_updated'])

        # Removing index on 'ProjectUpdate', fields ['time']
        db.delete_index('rsr_projectupdate', ['time'])

        # Removing index on 'ProjectUpdate', fields ['title']
        db.delete_index('rsr_projectupdate', ['title'])

        # Removing index on 'ProjectUpdate', fields ['update_method']
        db.delete_index('rsr_projectupdate', ['update_method'])

        # Removing index on 'OrganisationLocation', fields ['latitude']
        db.delete_index('rsr_organisationlocation', ['latitude'])

        # Removing index on 'OrganisationLocation', fields ['longitude']
        db.delete_index('rsr_organisationlocation', ['longitude'])

        # Removing index on 'OrganisationLocation', fields ['primary']
        db.delete_index('rsr_organisationlocation', ['primary'])

        # Removing index on 'Country', fields ['continent_code']
        db.delete_index('rsr_country', ['continent_code'])

        # Removing index on 'Country', fields ['iso_code']
        db.delete_index('rsr_country', ['iso_code'])

        # Removing index on 'ProjectLocation', fields ['latitude']
        db.delete_index('rsr_projectlocation', ['latitude'])

        # Removing index on 'ProjectLocation', fields ['longitude']
        db.delete_index('rsr_projectlocation', ['longitude'])

        # Removing index on 'ProjectLocation', fields ['primary']
        db.delete_index('rsr_projectlocation', ['primary'])

        # Removing index on 'BudgetItemLabel', fields ['label']
        db.delete_index('rsr_budgetitemlabel', ['label'])

        # Removing index on 'Partnership', fields ['funding_amount']
        db.delete_index('rsr_partnership', ['funding_amount'])

        # Removing index on 'Partnership', fields ['partner_type']
        db.delete_index('rsr_partnership', ['partner_type'])

        # Removing index on 'Partnership', fields ['internal_id']
        db.delete_index('rsr_partnership', ['internal_id'])

        # Removing index on 'Partnership', fields ['iati_activity_id']
        db.delete_index('rsr_partnership', ['iati_activity_id'])

        # Removing index on 'Project', fields ['budget']
        db.delete_index('rsr_project', ['budget'])

        # Removing index on 'Project', fields ['funds_needed']
        db.delete_index('rsr_project', ['funds_needed'])

        # Removing index on 'Project', fields ['funds']
        db.delete_index('rsr_project', ['funds'])

        # Removing index on 'Project', fields ['title']
        db.delete_index('rsr_project', ['title'])

        # Removing index on 'Project', fields ['status']
        db.delete_index('rsr_project', ['status'])

        # Removing index on 'Category', fields ['name']
        db.delete_index('rsr_category', ['name'])

        # Removing index on 'Organisation', fields ['iati_org_id']
        db.delete_index('rsr_organisation', ['iati_org_id'])

        # Removing index on 'Organisation', fields ['name']
        db.delete_index('rsr_organisation', ['name'])

        # Removing index on 'Organisation', fields ['organisation_type']
        db.delete_index('rsr_organisation', ['organisation_type'])


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'gateway.gateway': {
            'Meta': {'object_name': 'Gateway'},
            'host_name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'message': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'msg_id': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'name': ('django.db.models.fields.SlugField', [], {'max_length': '30'}),
            'receiver': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'send_path': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'sender': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'timestamp': ('django.db.models.fields.CharField', [], {'max_length': '30'})
        },
        'gateway.gatewaynumber': {
            'Meta': {'object_name': 'GatewayNumber'},
            'gateway': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['gateway.Gateway']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'number': ('django.db.models.fields.CharField', [], {'max_length': '30'})
        },
        'rsr.benchmark': {
            'Meta': {'ordering': "('category__name', 'name__order')", 'object_name': 'Benchmark'},
            'category': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Category']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Benchmarkname']"}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'benchmarks'", 'to': "orm['rsr.Project']"}),
            'value': ('django.db.models.fields.IntegerField', [], {})
        },
        'rsr.benchmarkname': {
            'Meta': {'ordering': "['order', 'name']", 'object_name': 'Benchmarkname'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'order': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        },
        'rsr.budgetitem': {
            'Meta': {'ordering': "('label',)", 'unique_together': "(('project', 'label'),)", 'object_name': 'BudgetItem'},
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '2'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'label': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.BudgetItemLabel']"}),
            'other_extra': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'budget_items'", 'to': "orm['rsr.Project']"})
        },
        'rsr.budgetitemlabel': {
            'Meta': {'ordering': "('label',)", 'object_name': 'BudgetItemLabel'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'label': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '20', 'db_index': 'True'})
        },
        'rsr.category': {
            'Meta': {'ordering': "['name']", 'object_name': 'Category'},
            'benchmarknames': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['rsr.Benchmarkname']", 'symmetrical': 'False', 'blank': 'True'}),
            'focus_area': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'categories'", 'symmetrical': 'False', 'to': "orm['rsr.FocusArea']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'db_index': 'True'})
        },
        'rsr.country': {
            'Meta': {'ordering': "['name']", 'object_name': 'Country'},
            'continent': ('django.db.models.fields.CharField', [], {'max_length': '20', 'db_index': 'True'}),
            'continent_code': ('django.db.models.fields.CharField', [], {'max_length': '2', 'db_index': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'iso_code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '2', 'db_index': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '50', 'db_index': 'True'})
        },
        'rsr.focusarea': {
            'Meta': {'ordering': "['name']", 'object_name': 'FocusArea'},
            'description': ('django.db.models.fields.TextField', [], {'max_length': '500'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'link_to': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'})
        },
        'rsr.goal': {
            'Meta': {'object_name': 'Goal'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'goals'", 'to': "orm['rsr.Project']"}),
            'text': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'})
        },
        'rsr.invoice': {
            'Meta': {'ordering': "['-id']", 'object_name': 'Invoice'},
            'amount': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'amount_received': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '10', 'decimal_places': '2', 'blank': 'True'}),
            'bank': ('django.db.models.fields.CharField', [], {'max_length': '4', 'blank': 'True'}),
            'campaign_code': ('django.db.models.fields.CharField', [], {'max_length': '15', 'blank': 'True'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'null': 'True', 'blank': 'True'}),
            'engine': ('django.db.models.fields.CharField', [], {'default': "'paypal'", 'max_length': '10'}),
            'http_referer': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ipn': ('django.db.models.fields.CharField', [], {'max_length': '75', 'null': 'True', 'blank': 'True'}),
            'is_anonymous': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '75', 'null': 'True', 'blank': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'invoices'", 'to': "orm['rsr.Project']"}),
            'status': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '1'}),
            'test': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'time': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'transaction_id': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']", 'null': 'True', 'blank': 'True'})
        },
        'rsr.link': {
            'Meta': {'object_name': 'Link'},
            'caption': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'kind': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'links'", 'to': "orm['rsr.Project']"}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        'rsr.minicms': {
            'Meta': {'ordering': "['-active', '-id']", 'object_name': 'MiniCMS'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'feature_box': ('django.db.models.fields.TextField', [], {'max_length': '350'}),
            'feature_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'label': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'lower_height': ('django.db.models.fields.IntegerField', [], {'default': '500'}),
            'top_right_box': ('django.db.models.fields.TextField', [], {'max_length': '350'})
        },
        'rsr.molliegateway': {
            'Meta': {'object_name': 'MollieGateway'},
            'currency': ('django.db.models.fields.CharField', [], {'default': "'EUR'", 'max_length': '3'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'notification_email': ('django.db.models.fields.EmailField', [], {'max_length': '75'}),
            'partner_id': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        'rsr.organisation': {
            'Meta': {'ordering': "['name']", 'object_name': 'Organisation'},
            'contact_email': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'contact_person': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'fax': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'iati_org_id': ('django.db.models.fields.CharField', [], {'db_index': 'True', 'max_length': '75', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'logo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'long_name': ('django.db.models.fields.CharField', [], {'max_length': '75', 'blank': 'True'}),
            'mobile': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '25', 'db_index': 'True'}),
            'organisation_type': ('django.db.models.fields.CharField', [], {'max_length': '1', 'db_index': 'True'}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'primary_location': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.OrganisationLocation']", 'null': 'True', 'on_delete': 'models.SET_NULL'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'})
        },
        'rsr.organisationaccount': {
            'Meta': {'object_name': 'OrganisationAccount'},
            'account_level': ('django.db.models.fields.CharField', [], {'default': "'free'", 'max_length': '12'}),
            'organisation': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['rsr.Organisation']", 'unique': 'True', 'primary_key': 'True'})
        },
        'rsr.organisationlocation': {
            'Meta': {'ordering': "['-primary']", 'object_name': 'OrganisationLocation'},
            'address_1': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'address_2': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'city': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'country': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Country']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'latitude': ('akvo.rsr.fields.LatitudeField', [], {'default': '0', 'db_index': 'True'}),
            'location_target': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'locations'", 'null': 'True', 'to': "orm['rsr.Organisation']"}),
            'longitude': ('akvo.rsr.fields.LongitudeField', [], {'default': '0', 'db_index': 'True'}),
            'postcode': ('django.db.models.fields.CharField', [], {'max_length': '10', 'blank': 'True'}),
            'primary': ('django.db.models.fields.BooleanField', [], {'default': 'True', 'db_index': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        'rsr.partnership': {
            'Meta': {'ordering': "['partner_type']", 'object_name': 'Partnership'},
            'funding_amount': ('django.db.models.fields.DecimalField', [], {'db_index': 'True', 'null': 'True', 'max_digits': '10', 'decimal_places': '2', 'blank': 'True'}),
            'iati_activity_id': ('django.db.models.fields.CharField', [], {'db_index': 'True', 'max_length': '75', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'internal_id': ('django.db.models.fields.CharField', [], {'db_index': 'True', 'max_length': '75', 'null': 'True', 'blank': 'True'}),
            'organisation': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'partnerships'", 'to': "orm['rsr.Organisation']"}),
            'partner_type': ('django.db.models.fields.CharField', [], {'max_length': '8', 'db_index': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'partnerships'", 'to': "orm['rsr.Project']"})
        },
        'rsr.partnersite': {
            'Meta': {'ordering': "('organisation__name',)", 'object_name': 'PartnerSite'},
            'about_box': ('django.db.models.fields.TextField', [], {'max_length': '500', 'blank': 'True'}),
            'about_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'cname': ('akvo.rsr.fields.NullCharField', [], {'max_length': '100', 'unique': 'True', 'null': 'True', 'blank': 'True'}),
            'custom_css': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'blank': 'True'}),
            'custom_favicon': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'blank': 'True'}),
            'custom_logo': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'blank': 'True'}),
            'custom_return_url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'default_language': ('django.db.models.fields.CharField', [], {'default': "'en'", 'max_length': '5'}),
            'enabled': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'hostname': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '50'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'organisation': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Organisation']"})
        },
        'rsr.paymentgatewayselector': {
            'Meta': {'object_name': 'PaymentGatewaySelector'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mollie_gateway': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'to': "orm['rsr.MollieGateway']"}),
            'paypal_gateway': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'to': "orm['rsr.PayPalGateway']"}),
            'project': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['rsr.Project']", 'unique': 'True'})
        },
        'rsr.paypalgateway': {
            'Meta': {'object_name': 'PayPalGateway'},
            'account_email': ('django.db.models.fields.EmailField', [], {'max_length': '75'}),
            'currency': ('django.db.models.fields.CharField', [], {'default': "'EUR'", 'max_length': '3'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locale': ('django.db.models.fields.CharField', [], {'default': "'US'", 'max_length': '2'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'notification_email': ('django.db.models.fields.EmailField', [], {'max_length': '75'})
        },
        'rsr.project': {
            'Meta': {'ordering': "['-id']", 'object_name': 'Project'},
            'background': ('akvo.rsr.fields.ProjectLimitedTextField', [], {'blank': 'True'}),
            'budget': ('django.db.models.fields.DecimalField', [], {'decimal_places': '2', 'default': '0', 'max_digits': '10', 'blank': 'True', 'null': 'True', 'db_index': 'True'}),
            'categories': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'projects'", 'symmetrical': 'False', 'to': "orm['rsr.Category']"}),
            'currency': ('django.db.models.fields.CharField', [], {'default': "'EUR'", 'max_length': '3'}),
            'current_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'current_image_caption': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'current_status': ('akvo.rsr.fields.ProjectLimitedTextField', [], {'blank': 'True'}),
            'date_complete': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'date_request_posted': ('django.db.models.fields.DateField', [], {'default': 'datetime.date.today'}),
            'funds': ('django.db.models.fields.DecimalField', [], {'decimal_places': '2', 'default': '0', 'max_digits': '10', 'blank': 'True', 'null': 'True', 'db_index': 'True'}),
            'funds_needed': ('django.db.models.fields.DecimalField', [], {'decimal_places': '2', 'default': '0', 'max_digits': '10', 'blank': 'True', 'null': 'True', 'db_index': 'True'}),
            'goals_overview': ('akvo.rsr.fields.ProjectLimitedTextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'notes': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'partners': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'projects'", 'symmetrical': 'False', 'through': "orm['rsr.Partnership']", 'to': "orm['rsr.Organisation']"}),
            'primary_location': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.ProjectLocation']", 'null': 'True', 'on_delete': 'models.SET_NULL'}),
            'project_plan': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'project_plan_summary': ('akvo.rsr.fields.ProjectLimitedTextField', [], {}),
            'project_rating': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'N'", 'max_length': '1', 'db_index': 'True'}),
            'subtitle': ('django.db.models.fields.CharField', [], {'max_length': '75'}),
            'sustainability': ('django.db.models.fields.TextField', [], {}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '45', 'db_index': 'True'})
        },
        'rsr.projectcomment': {
            'Meta': {'ordering': "('-id',)", 'object_name': 'ProjectComment'},
            'comment': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'comments'", 'to': "orm['rsr.Project']"}),
            'time': ('django.db.models.fields.DateTimeField', [], {'db_index': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"})
        },
        'rsr.projectlocation': {
            'Meta': {'ordering': "['-primary']", 'object_name': 'ProjectLocation'},
            'address_1': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'address_2': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'city': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'country': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Country']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'latitude': ('akvo.rsr.fields.LatitudeField', [], {'default': '0', 'db_index': 'True'}),
            'location_target': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'locations'", 'null': 'True', 'to': "orm['rsr.Project']"}),
            'longitude': ('akvo.rsr.fields.LongitudeField', [], {'default': '0', 'db_index': 'True'}),
            'postcode': ('django.db.models.fields.CharField', [], {'max_length': '10', 'blank': 'True'}),
            'primary': ('django.db.models.fields.BooleanField', [], {'default': 'True', 'db_index': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        'rsr.projectupdate': {
            'Meta': {'ordering': "['-id']", 'object_name': 'ProjectUpdate'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'photo_caption': ('django.db.models.fields.CharField', [], {'max_length': '75', 'blank': 'True'}),
            'photo_credit': ('django.db.models.fields.CharField', [], {'max_length': '25', 'blank': 'True'}),
            'photo_location': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'project_updates'", 'to': "orm['rsr.Project']"}),
            'text': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'time': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'db_index': 'True', 'blank': 'True'}),
            'time_last_updated': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'db_index': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '50', 'db_index': 'True'}),
            'update_method': ('django.db.models.fields.CharField', [], {'default': "'W'", 'max_length': '1', 'db_index': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"}),
            'video': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'video_caption': ('django.db.models.fields.CharField', [], {'max_length': '75', 'blank': 'True'}),
            'video_credit': ('django.db.models.fields.CharField', [], {'max_length': '25', 'blank': 'True'})
        },
        'rsr.publishingstatus': {
            'Meta': {'ordering': "('-status', 'project')", 'object_name': 'PublishingStatus'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['rsr.Project']", 'unique': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'unpublished'", 'max_length': '30'})
        },
        'rsr.smsreporter': {
            'Meta': {'unique_together': "(('userprofile', 'gw_number', 'project'),)", 'object_name': 'SmsReporter'},
            'gw_number': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['gateway.GatewayNumber']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Project']", 'null': 'True', 'blank': 'True'}),
            'userprofile': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'reporters'", 'to': "orm['rsr.UserProfile']"})
        },
        'rsr.userprofile': {
            'Meta': {'ordering': "['user__username']", 'object_name': 'UserProfile'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'organisation': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Organisation']"}),
            'phone_number': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['auth.User']", 'unique': 'True'}),
            'validation': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'})
        }
    }

    complete_apps = ['rsr']