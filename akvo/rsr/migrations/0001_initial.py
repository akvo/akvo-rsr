# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'Country'
        db.create_table('rsr_country', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=50, db_index=True)),
            ('iso_code', self.gf('django.db.models.fields.CharField')(unique=True, max_length=2)),
            ('continent', self.gf('django.db.models.fields.CharField')(max_length=20, db_index=True)),
            ('continent_code', self.gf('django.db.models.fields.CharField')(max_length=2)),
        ))
        db.send_create_signal('rsr', ['Country'])

        # Adding model 'Location'
        db.create_table('rsr_location', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('latitude', self.gf('akvo.rsr.fields.LatitudeField')(default=0)),
            ('longitude', self.gf('akvo.rsr.fields.LongitudeField')(default=0)),
            ('city', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('state', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('country', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rsr.Country'])),
            ('address_1', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('address_2', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('postcode', self.gf('django.db.models.fields.CharField')(max_length=10, blank=True)),
            ('content_type', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['contenttypes.ContentType'])),
            ('object_id', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('primary', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal('rsr', ['Location'])

        # Adding model 'Organisation'
        db.create_table('rsr_organisation', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('field_partner', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('support_partner', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('funding_partner', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('sponsor_partner', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=25)),
            ('long_name', self.gf('django.db.models.fields.CharField')(max_length=75, blank=True)),
            ('organisation_type', self.gf('django.db.models.fields.CharField')(max_length=1)),
            ('logo', self.gf('django.db.models.fields.files.ImageField')(max_length=100, blank=True)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('phone', self.gf('django.db.models.fields.CharField')(max_length=20, blank=True)),
            ('mobile', self.gf('django.db.models.fields.CharField')(max_length=20, blank=True)),
            ('fax', self.gf('django.db.models.fields.CharField')(max_length=20, blank=True)),
            ('contact_person', self.gf('django.db.models.fields.CharField')(max_length=30, blank=True)),
            ('contact_email', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('rsr', ['Organisation'])

        # Adding model 'OrganisationAccount'
        db.create_table('rsr_organisationaccount', (
            ('organisation', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['rsr.Organisation'], unique=True, primary_key=True)),
            ('account_level', self.gf('django.db.models.fields.CharField')(default='free', max_length=12)),
        ))
        db.send_create_signal('rsr', ['OrganisationAccount'])

        # Adding model 'FocusArea'
        db.create_table('rsr_focusarea', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=50, db_index=True)),
            ('description', self.gf('django.db.models.fields.TextField')(max_length=500)),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('link_to', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
        ))
        db.send_create_signal('rsr', ['FocusArea'])

        # Adding model 'Benchmarkname'
        db.create_table('rsr_benchmarkname', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('order', self.gf('django.db.models.fields.IntegerField')(default=0)),
        ))
        db.send_create_signal('rsr', ['Benchmarkname'])

        # Adding model 'Category'
        db.create_table('rsr_category', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
        ))
        db.send_create_signal('rsr', ['Category'])

        # Adding M2M table for field focus_area on 'Category'
        db.create_table('rsr_category_focus_area', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('category', models.ForeignKey(orm['rsr.category'], null=False)),
            ('focusarea', models.ForeignKey(orm['rsr.focusarea'], null=False))
        ))
        db.create_unique('rsr_category_focus_area', ['category_id', 'focusarea_id'])

        # Adding M2M table for field benchmarknames on 'Category'
        db.create_table('rsr_category_benchmarknames', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('category', models.ForeignKey(orm['rsr.category'], null=False)),
            ('benchmarkname', models.ForeignKey(orm['rsr.benchmarkname'], null=False))
        ))
        db.create_unique('rsr_category_benchmarknames', ['category_id', 'benchmarkname_id'])

        # Adding model 'MiniCMS'
        db.create_table('rsr_minicms', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('label', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('feature_box', self.gf('django.db.models.fields.TextField')(max_length=350)),
            ('feature_image', self.gf('django.db.models.fields.files.ImageField')(max_length=100, blank=True)),
            ('top_right_box', self.gf('django.db.models.fields.TextField')(max_length=350)),
            ('lower_height', self.gf('django.db.models.fields.IntegerField')(default=500)),
            ('active', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('rsr', ['MiniCMS'])

        # Adding model 'Project'
        db.create_table('rsr_project', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=45)),
            ('subtitle', self.gf('django.db.models.fields.CharField')(max_length=75)),
            ('status', self.gf('django.db.models.fields.CharField')(default='N', max_length=1)),
            ('project_plan_summary', self.gf('django.db.models.fields.TextField')(max_length=220)),
            ('current_image', self.gf('django.db.models.fields.files.ImageField')(max_length=100, blank=True)),
            ('current_image_caption', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('goals_overview', self.gf('django.db.models.fields.TextField')(max_length=500)),
            ('goal_1', self.gf('django.db.models.fields.CharField')(max_length=60, blank=True)),
            ('goal_2', self.gf('django.db.models.fields.CharField')(max_length=60, blank=True)),
            ('goal_3', self.gf('django.db.models.fields.CharField')(max_length=60, blank=True)),
            ('goal_4', self.gf('django.db.models.fields.CharField')(max_length=60, blank=True)),
            ('goal_5', self.gf('django.db.models.fields.CharField')(max_length=60, blank=True)),
            ('current_status_detail', self.gf('django.db.models.fields.TextField')(max_length=600, blank=True)),
            ('project_plan_detail', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('sustainability', self.gf('django.db.models.fields.TextField')()),
            ('context', self.gf('django.db.models.fields.TextField')(max_length=500, blank=True)),
            ('project_rating', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('notes', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('currency', self.gf('django.db.models.fields.CharField')(default='EUR', max_length=3)),
            ('date_request_posted', self.gf('django.db.models.fields.DateField')(default=datetime.date.today)),
            ('date_complete', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
        ))
        db.send_create_signal('rsr', ['Project'])

        # Adding M2M table for field categories on 'Project'
        db.create_table('rsr_project_categories', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('project', models.ForeignKey(orm['rsr.project'], null=False)),
            ('category', models.ForeignKey(orm['rsr.category'], null=False))
        ))
        db.create_unique('rsr_project_categories', ['project_id', 'category_id'])

        # Adding model 'Benchmark'
        db.create_table('rsr_benchmark', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(related_name=u'benchmarks', to=orm['rsr.Project'])),
            ('category', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rsr.Category'])),
            ('name', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rsr.Benchmarkname'])),
            ('value', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal('rsr', ['Benchmark'])

        # Adding model 'BudgetItem'
        db.create_table('rsr_budgetitem', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rsr.Project'])),
            ('item', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('amount', self.gf('django.db.models.fields.DecimalField')(max_digits=10, decimal_places=2)),
        ))
        db.send_create_signal('rsr', ['BudgetItem'])

        # Adding unique constraint on 'BudgetItem', fields ['project', 'item']
        db.create_unique('rsr_budgetitem', ['project_id', 'item'])

        # Adding model 'PublishingStatus'
        db.create_table('rsr_publishingstatus', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('project', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['rsr.Project'], unique=True)),
            ('status', self.gf('django.db.models.fields.CharField')(default='unpublished', max_length=30)),
        ))
        db.send_create_signal('rsr', ['PublishingStatus'])

        # Adding model 'Link'
        db.create_table('rsr_link', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('kind', self.gf('django.db.models.fields.CharField')(max_length=1)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200)),
            ('caption', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(related_name='links', to=orm['rsr.Project'])),
        ))
        db.send_create_signal('rsr', ['Link'])

        # Adding model 'FundingPartner'
        db.create_table('rsr_fundingpartner', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('funding_organisation', self.gf('django.db.models.fields.related.ForeignKey')(related_name='funding_partners', to=orm['rsr.Organisation'])),
            ('funding_amount', self.gf('django.db.models.fields.DecimalField')(max_digits=10, decimal_places=2)),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rsr.Project'])),
        ))
        db.send_create_signal('rsr', ['FundingPartner'])

        # Adding model 'SponsorPartner'
        db.create_table('rsr_sponsorpartner', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('sponsor_organisation', self.gf('django.db.models.fields.related.ForeignKey')(related_name='sponsor_partners', to=orm['rsr.Organisation'])),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rsr.Project'])),
        ))
        db.send_create_signal('rsr', ['SponsorPartner'])

        # Adding model 'SupportPartner'
        db.create_table('rsr_supportpartner', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('support_organisation', self.gf('django.db.models.fields.related.ForeignKey')(related_name='support_partners', to=orm['rsr.Organisation'])),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rsr.Project'])),
        ))
        db.send_create_signal('rsr', ['SupportPartner'])

        # Adding model 'FieldPartner'
        db.create_table('rsr_fieldpartner', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('field_organisation', self.gf('django.db.models.fields.related.ForeignKey')(related_name='field_partners', to=orm['rsr.Organisation'])),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rsr.Project'])),
        ))
        db.send_create_signal('rsr', ['FieldPartner'])

        # Adding model 'UserProfile'
        db.create_table('rsr_userprofile', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['auth.User'], unique=True)),
            ('organisation', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rsr.Organisation'])),
            ('phone_number', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('validation', self.gf('django.db.models.fields.CharField')(max_length=20, blank=True)),
        ))
        db.send_create_signal('rsr', ['UserProfile'])

        # Adding model 'SmsReporter'
        db.create_table('rsr_smsreporter', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('userprofile', self.gf('django.db.models.fields.related.ForeignKey')(related_name='reporters', to=orm['rsr.UserProfile'])),
            ('gw_number', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['gateway.GatewayNumber'])),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rsr.Project'], null=True, blank=True)),
        ))
        db.send_create_signal('rsr', ['SmsReporter'])

        # Adding unique constraint on 'SmsReporter', fields ['userprofile', 'gw_number', 'project']
        db.create_unique('rsr_smsreporter', ['userprofile_id', 'gw_number_id', 'project_id'])

        # Adding model 'ProjectUpdate'
        db.create_table('rsr_projectupdate', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(related_name='project_updates', to=orm['rsr.Project'])),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('text', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('photo', self.gf('django.db.models.fields.files.ImageField')(max_length=100, blank=True)),
            ('photo_location', self.gf('django.db.models.fields.CharField')(max_length=1)),
            ('photo_caption', self.gf('django.db.models.fields.CharField')(max_length=75, blank=True)),
            ('photo_credit', self.gf('django.db.models.fields.CharField')(max_length=25, blank=True)),
            ('video', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('video_caption', self.gf('django.db.models.fields.CharField')(max_length=75, blank=True)),
            ('video_credit', self.gf('django.db.models.fields.CharField')(max_length=25, blank=True)),
            ('update_method', self.gf('django.db.models.fields.CharField')(default='W', max_length=1, blank=True)),
            ('time', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('time_last_updated', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('featured', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('rsr', ['ProjectUpdate'])

        # Adding model 'ProjectComment'
        db.create_table('rsr_projectcomment', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rsr.Project'])),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('comment', self.gf('django.db.models.fields.TextField')()),
            ('time', self.gf('django.db.models.fields.DateTimeField')()),
        ))
        db.send_create_signal('rsr', ['ProjectComment'])

        # Adding model 'PayPalGateway'
        db.create_table('rsr_paypalgateway', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('currency', self.gf('django.db.models.fields.CharField')(default='EUR', max_length=3)),
            ('notification_email', self.gf('django.db.models.fields.EmailField')(max_length=75)),
            ('account_email', self.gf('django.db.models.fields.EmailField')(max_length=75)),
            ('locale', self.gf('django.db.models.fields.CharField')(default='US', max_length=2)),
        ))
        db.send_create_signal('rsr', ['PayPalGateway'])

        # Adding model 'MollieGateway'
        db.create_table('rsr_molliegateway', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('currency', self.gf('django.db.models.fields.CharField')(default='EUR', max_length=3)),
            ('notification_email', self.gf('django.db.models.fields.EmailField')(max_length=75)),
            ('partner_id', self.gf('django.db.models.fields.CharField')(max_length=10)),
        ))
        db.send_create_signal('rsr', ['MollieGateway'])

        # Adding model 'PaymentGatewaySelector'
        db.create_table('rsr_paymentgatewayselector', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('project', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['rsr.Project'], unique=True)),
            ('paypal_gateway', self.gf('django.db.models.fields.related.ForeignKey')(default=1, to=orm['rsr.PayPalGateway'])),
            ('mollie_gateway', self.gf('django.db.models.fields.related.ForeignKey')(default=1, to=orm['rsr.MollieGateway'])),
        ))
        db.send_create_signal('rsr', ['PaymentGatewaySelector'])

        # Adding model 'Invoice'
        db.create_table('rsr_invoice', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('test', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('engine', self.gf('django.db.models.fields.CharField')(default='paypal', max_length=10)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'], null=True, blank=True)),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rsr.Project'])),
            ('amount', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('amount_received', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=10, decimal_places=2, blank=True)),
            ('time', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=75, null=True, blank=True)),
            ('email', self.gf('django.db.models.fields.EmailField')(max_length=75, null=True, blank=True)),
            ('status', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=1)),
            ('http_referer', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('campaign_code', self.gf('django.db.models.fields.CharField')(max_length=15, blank=True)),
            ('is_anonymous', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('ipn', self.gf('django.db.models.fields.CharField')(max_length=75, null=True, blank=True)),
            ('bank', self.gf('django.db.models.fields.CharField')(max_length=4, blank=True)),
            ('transaction_id', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
        ))
        db.send_create_signal('rsr', ['Invoice'])

        # Adding model 'PartnerSite'
        db.create_table('rsr_partnersite', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('organisation', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['rsr.Organisation'])),
            ('hostname', self.gf('django.db.models.fields.CharField')(unique=True, max_length=50)),
            ('cname', self.gf('akvo.rsr.fields.NullCharField')(max_length=100, unique=True, null=True, blank=True)),
            ('custom_return_url', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('custom_css', self.gf('django.db.models.fields.files.FileField')(max_length=100, blank=True)),
            ('custom_logo', self.gf('django.db.models.fields.files.FileField')(max_length=100, blank=True)),
            ('custom_favicon', self.gf('django.db.models.fields.files.FileField')(max_length=100, blank=True)),
            ('about_box', self.gf('django.db.models.fields.TextField')(max_length=500, blank=True)),
            ('about_image', self.gf('django.db.models.fields.files.ImageField')(max_length=100, blank=True)),
            ('enabled', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal('rsr', ['PartnerSite'])


    def backwards(self, orm):
        
        # Removing unique constraint on 'SmsReporter', fields ['userprofile', 'gw_number', 'project']
        db.delete_unique('rsr_smsreporter', ['userprofile_id', 'gw_number_id', 'project_id'])

        # Removing unique constraint on 'BudgetItem', fields ['project', 'item']
        db.delete_unique('rsr_budgetitem', ['project_id', 'item'])

        # Deleting model 'Country'
        db.delete_table('rsr_country')

        # Deleting model 'Location'
        db.delete_table('rsr_location')

        # Deleting model 'Organisation'
        db.delete_table('rsr_organisation')

        # Deleting model 'OrganisationAccount'
        db.delete_table('rsr_organisationaccount')

        # Deleting model 'FocusArea'
        db.delete_table('rsr_focusarea')

        # Deleting model 'Benchmarkname'
        db.delete_table('rsr_benchmarkname')

        # Deleting model 'Category'
        db.delete_table('rsr_category')

        # Removing M2M table for field focus_area on 'Category'
        db.delete_table('rsr_category_focus_area')

        # Removing M2M table for field benchmarknames on 'Category'
        db.delete_table('rsr_category_benchmarknames')

        # Deleting model 'MiniCMS'
        db.delete_table('rsr_minicms')

        # Deleting model 'Project'
        db.delete_table('rsr_project')

        # Removing M2M table for field categories on 'Project'
        db.delete_table('rsr_project_categories')

        # Deleting model 'Benchmark'
        db.delete_table('rsr_benchmark')

        # Deleting model 'BudgetItem'
        db.delete_table('rsr_budgetitem')

        # Deleting model 'PublishingStatus'
        db.delete_table('rsr_publishingstatus')

        # Deleting model 'Link'
        db.delete_table('rsr_link')

        # Deleting model 'FundingPartner'
        db.delete_table('rsr_fundingpartner')

        # Deleting model 'SponsorPartner'
        db.delete_table('rsr_sponsorpartner')

        # Deleting model 'SupportPartner'
        db.delete_table('rsr_supportpartner')

        # Deleting model 'FieldPartner'
        db.delete_table('rsr_fieldpartner')

        # Deleting model 'UserProfile'
        db.delete_table('rsr_userprofile')

        # Deleting model 'SmsReporter'
        db.delete_table('rsr_smsreporter')

        # Deleting model 'ProjectUpdate'
        db.delete_table('rsr_projectupdate')

        # Deleting model 'ProjectComment'
        db.delete_table('rsr_projectcomment')

        # Deleting model 'PayPalGateway'
        db.delete_table('rsr_paypalgateway')

        # Deleting model 'MollieGateway'
        db.delete_table('rsr_molliegateway')

        # Deleting model 'PaymentGatewaySelector'
        db.delete_table('rsr_paymentgatewayselector')

        # Deleting model 'Invoice'
        db.delete_table('rsr_invoice')

        # Deleting model 'PartnerSite'
        db.delete_table('rsr_partnersite')


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
            'Meta': {'ordering': "['category__name', 'name__order']", 'object_name': 'Benchmark'},
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
            'Meta': {'unique_together': "(('project', 'item'),)", 'object_name': 'BudgetItem'},
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '2'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'item': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Project']"})
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
        'rsr.fieldpartner': {
            'Meta': {'object_name': 'FieldPartner'},
            'field_organisation': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'field_partners'", 'to': "orm['rsr.Organisation']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Project']"})
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
        'rsr.fundingpartner': {
            'Meta': {'object_name': 'FundingPartner'},
            'funding_amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '2'}),
            'funding_organisation': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'funding_partners'", 'to': "orm['rsr.Organisation']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Project']"})
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
            'field_partner': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'funding_partner': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'logo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'long_name': ('django.db.models.fields.CharField', [], {'max_length': '75', 'blank': 'True'}),
            'mobile': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            'organisation_type': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'sponsor_partner': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'support_partner': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'})
        },
        'rsr.organisationaccount': {
            'Meta': {'object_name': 'OrganisationAccount'},
            'account_level': ('django.db.models.fields.CharField', [], {'default': "'free'", 'max_length': '12'}),
            'organisation': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['rsr.Organisation']", 'unique': 'True', 'primary_key': 'True'})
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
            'context': ('django.db.models.fields.TextField', [], {'max_length': '500', 'blank': 'True'}),
            'currency': ('django.db.models.fields.CharField', [], {'default': "'EUR'", 'max_length': '3'}),
            'current_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'current_image_caption': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'current_status_detail': ('django.db.models.fields.TextField', [], {'max_length': '600', 'blank': 'True'}),
            'date_complete': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'date_request_posted': ('django.db.models.fields.DateField', [], {'default': 'datetime.date.today'}),
            'goal_1': ('django.db.models.fields.CharField', [], {'max_length': '60', 'blank': 'True'}),
            'goal_2': ('django.db.models.fields.CharField', [], {'max_length': '60', 'blank': 'True'}),
            'goal_3': ('django.db.models.fields.CharField', [], {'max_length': '60', 'blank': 'True'}),
            'goal_4': ('django.db.models.fields.CharField', [], {'max_length': '60', 'blank': 'True'}),
            'goal_5': ('django.db.models.fields.CharField', [], {'max_length': '60', 'blank': 'True'}),
            'goals_overview': ('django.db.models.fields.TextField', [], {'max_length': '500'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '45'}),
            'notes': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'project_plan_detail': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'project_plan_summary': ('django.db.models.fields.TextField', [], {'max_length': '220'}),
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
        'rsr.sponsorpartner': {
            'Meta': {'object_name': 'SponsorPartner'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Project']"}),
            'sponsor_organisation': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'sponsor_partners'", 'to': "orm['rsr.Organisation']"})
        },
        'rsr.supportpartner': {
            'Meta': {'object_name': 'SupportPartner'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Project']"}),
            'support_organisation': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'support_partners'", 'to': "orm['rsr.Organisation']"})
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
