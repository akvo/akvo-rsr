# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Deleting field 'Project.current_status_detail'
        db.delete_column('rsr_project', 'current_status_detail')

        # Deleting field 'Project.project_plan_detail'
        db.delete_column('rsr_project', 'project_plan_detail')

        # Adding field 'Project.current_status'
        db.add_column('rsr_project', 'current_status', self.gf('akvo.rsr.fields.ProjectLimitedTextField')(default='', blank=True), keep_default=False)

        # Adding field 'Project.project_plan'
        db.add_column('rsr_project', 'project_plan', self.gf('django.db.models.fields.TextField')(default='', blank=True), keep_default=False)

        # Changing field 'Project.project_plan_summary'
        db.alter_column('rsr_project', 'project_plan_summary', self.gf('akvo.rsr.fields.ProjectLimitedTextField')())

        # Changing field 'Project.context'
        db.alter_column('rsr_project', 'context', self.gf('akvo.rsr.fields.ProjectLimitedTextField')())

        # Changing field 'Project.goals_overview'
        db.alter_column('rsr_project', 'goals_overview', self.gf('akvo.rsr.fields.ProjectLimitedTextField')())

        # Adding unique constraint on 'BudgetItemLabel', fields ['label']
        db.create_unique('rsr_budgetitemlabel', ['label'])


    def backwards(self, orm):
        
        # Removing unique constraint on 'BudgetItemLabel', fields ['label']
        db.delete_unique('rsr_budgetitemlabel', ['label'])

        # Adding field 'Project.current_status_detail'
        db.add_column('rsr_project', 'current_status_detail', self.gf('django.db.models.fields.TextField')(default='', max_length=600, blank=True), keep_default=False)

        # Adding field 'Project.project_plan_detail'
        db.add_column('rsr_project', 'project_plan_detail', self.gf('django.db.models.fields.TextField')(default='', blank=True), keep_default=False)

        # Deleting field 'Project.current_status'
        db.delete_column('rsr_project', 'current_status')

        # Deleting field 'Project.project_plan'
        db.delete_column('rsr_project', 'project_plan')

        # Changing field 'Project.project_plan_summary'
        db.alter_column('rsr_project', 'project_plan_summary', self.gf('django.db.models.fields.TextField')(max_length=220))

        # Changing field 'Project.context'
        db.alter_column('rsr_project', 'context', self.gf('django.db.models.fields.TextField')(max_length=500))

        # Changing field 'Project.goals_overview'
        db.alter_column('rsr_project', 'goals_overview', self.gf('django.db.models.fields.TextField')(max_length=500))


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
            'name': ('django.db.models.fields.SlugField', [], {'max_length': '30', 'db_index': 'True'}),
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
            'label': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '20'})
        },
        'rsr.category': {
            'Meta': {'object_name': 'Category'},
            'benchmarknames': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['rsr.Benchmarkname']", 'symmetrical': 'False', 'blank': 'True'}),
            'focus_area': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'categories'", 'symmetrical': 'False', 'to': "orm['rsr.FocusArea']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'rsr.country': {
            'Meta': {'ordering': "['name']", 'object_name': 'Country'},
            'continent': ('django.db.models.fields.CharField', [], {'max_length': '20', 'db_index': 'True'}),
            'continent_code': ('django.db.models.fields.CharField', [], {'max_length': '2'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'iso_code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '2'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '50', 'db_index': 'True'})
        },
        'rsr.focusarea': {
            'Meta': {'object_name': 'FocusArea'},
            'description': ('django.db.models.fields.TextField', [], {'max_length': '500'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'link_to': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50', 'db_index': 'True'})
        },
        'rsr.invoice': {
            'Meta': {'object_name': 'Invoice'},
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
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Project']"}),
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
        'rsr.location': {
            'Meta': {'object_name': 'Location'},
            'address_1': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'address_2': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'city': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'country': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Country']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'latitude': ('akvo.rsr.fields.LatitudeField', [], {'default': '0'}),
            'longitude': ('akvo.rsr.fields.LongitudeField', [], {'default': '0'}),
            'object_id': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'postcode': ('django.db.models.fields.CharField', [], {'max_length': '10', 'blank': 'True'}),
            'primary': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        'rsr.minicms': {
            'Meta': {'object_name': 'MiniCMS'},
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
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'logo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'long_name': ('django.db.models.fields.CharField', [], {'max_length': '75', 'blank': 'True'}),
            'mobile': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            'organisation_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'})
        },
        'rsr.organisationaccount': {
            'Meta': {'object_name': 'OrganisationAccount'},
            'account_level': ('django.db.models.fields.CharField', [], {'default': "'free'", 'max_length': '12'}),
            'organisation': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['rsr.Organisation']", 'unique': 'True', 'primary_key': 'True'})
        },
        'rsr.partnership': {
            'Meta': {'ordering': "['partner_type']", 'object_name': 'Partnership'},
            'funding_amount': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '10', 'decimal_places': '2', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'organisation': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Organisation']"}),
            'partner_type': ('django.db.models.fields.CharField', [], {'max_length': '8'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Project']"})
        },
        'rsr.partnersite': {
            'Meta': {'object_name': 'PartnerSite'},
            'about_box': ('django.db.models.fields.TextField', [], {'max_length': '500', 'blank': 'True'}),
            'about_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'cname': ('akvo.rsr.fields.NullCharField', [], {'max_length': '100', 'unique': 'True', 'null': 'True', 'blank': 'True'}),
            'custom_css': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'blank': 'True'}),
            'custom_favicon': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'blank': 'True'}),
            'custom_logo': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'blank': 'True'}),
            'custom_return_url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
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
            'Meta': {'object_name': 'Project'},
            'categories': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'projects'", 'symmetrical': 'False', 'to': "orm['rsr.Category']"}),
            'context': ('akvo.rsr.fields.ProjectLimitedTextField', [], {'blank': 'True'}),
            'currency': ('django.db.models.fields.CharField', [], {'default': "'EUR'", 'max_length': '3'}),
            'current_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'current_image_caption': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'current_status': ('akvo.rsr.fields.ProjectLimitedTextField', [], {'blank': 'True'}),
            'date_complete': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'date_request_posted': ('django.db.models.fields.DateField', [], {'default': 'datetime.date.today'}),
            'goal_1': ('django.db.models.fields.CharField', [], {'max_length': '60', 'blank': 'True'}),
            'goal_2': ('django.db.models.fields.CharField', [], {'max_length': '60', 'blank': 'True'}),
            'goal_3': ('django.db.models.fields.CharField', [], {'max_length': '60', 'blank': 'True'}),
            'goal_4': ('django.db.models.fields.CharField', [], {'max_length': '60', 'blank': 'True'}),
            'goal_5': ('django.db.models.fields.CharField', [], {'max_length': '60', 'blank': 'True'}),
            'goals_overview': ('akvo.rsr.fields.ProjectLimitedTextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '45'}),
            'notes': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'partners': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'projects'", 'symmetrical': 'False', 'through': "orm['rsr.Partnership']", 'to': "orm['rsr.Organisation']"}),
            'project_plan': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'project_plan_summary': ('akvo.rsr.fields.ProjectLimitedTextField', [], {}),
            'project_rating': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'N'", 'max_length': '1'}),
            'subtitle': ('django.db.models.fields.CharField', [], {'max_length': '75'}),
            'sustainability': ('django.db.models.fields.TextField', [], {})
        },
        'rsr.projectcomment': {
            'Meta': {'object_name': 'ProjectComment'},
            'comment': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Project']"}),
            'time': ('django.db.models.fields.DateTimeField', [], {}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"})
        },
        'rsr.projectupdate': {
            'Meta': {'object_name': 'ProjectUpdate'},
            'featured': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'photo_caption': ('django.db.models.fields.CharField', [], {'max_length': '75', 'blank': 'True'}),
            'photo_credit': ('django.db.models.fields.CharField', [], {'max_length': '25', 'blank': 'True'}),
            'photo_location': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'project_updates'", 'to': "orm['rsr.Project']"}),
            'text': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'time': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'time_last_updated': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'update_method': ('django.db.models.fields.CharField', [], {'default': "'W'", 'max_length': '1', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"}),
            'video': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'video_caption': ('django.db.models.fields.CharField', [], {'max_length': '75', 'blank': 'True'}),
            'video_credit': ('django.db.models.fields.CharField', [], {'max_length': '25', 'blank': 'True'})
        },
        'rsr.publishingstatus': {
            'Meta': {'object_name': 'PublishingStatus'},
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
            'Meta': {'object_name': 'UserProfile'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'organisation': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Organisation']"}),
            'phone_number': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['auth.User']", 'unique': 'True'}),
            'validation': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'})
        }
    }

    complete_apps = ['rsr']
