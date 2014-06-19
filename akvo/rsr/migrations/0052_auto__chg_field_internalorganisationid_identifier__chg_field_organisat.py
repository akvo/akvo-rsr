# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'InternalOrganisationID.identifier'
        db.alter_column('rsr_internalorganisationid', 'identifier', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=200))

        # Changing field 'Organisation.fax'
        db.alter_column('rsr_organisation', 'fax', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=20))

        # Changing field 'Organisation.organisation_type'
        db.alter_column('rsr_organisation', 'organisation_type', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=1))

        # Changing field 'Organisation.name'
        db.alter_column('rsr_organisation', 'name', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=25))

        # Changing field 'Organisation.language'
        db.alter_column('rsr_organisation', 'language', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=2))

        # Changing field 'Organisation.long_name'
        db.alter_column('rsr_organisation', 'long_name', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=75))

        # Changing field 'Organisation.iati_org_id'
        db.alter_column('rsr_organisation', 'iati_org_id', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=75, unique=True, null=True))

        # Changing field 'Organisation.phone'
        db.alter_column('rsr_organisation', 'phone', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=20))

        # Changing field 'Organisation.contact_email'
        db.alter_column('rsr_organisation', 'contact_email', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=50))

        # Changing field 'Organisation.mobile'
        db.alter_column('rsr_organisation', 'mobile', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=20))

        # Changing field 'Organisation.contact_person'
        db.alter_column('rsr_organisation', 'contact_person', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=30))

        # Changing field 'Organisation.notes'
        db.alter_column('rsr_organisation', 'notes', self.gf('akvo.rsr.fields.ValidXMLTextField')())

        # Changing field 'Organisation.description'
        db.alter_column('rsr_organisation', 'description', self.gf('akvo.rsr.fields.ValidXMLTextField')())

        # Changing field 'MollieGateway.description'
        db.alter_column('rsr_molliegateway', 'description', self.gf('akvo.rsr.fields.ValidXMLTextField')())

        # Changing field 'MollieGateway.currency'
        db.alter_column('rsr_molliegateway', 'currency', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=3))

        # Changing field 'MollieGateway.partner_id'
        db.alter_column('rsr_molliegateway', 'partner_id', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=10))

        # Changing field 'MollieGateway.name'
        db.alter_column('rsr_molliegateway', 'name', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=255))

        # Changing field 'OrganisationAccount.account_level'
        db.alter_column('rsr_organisationaccount', 'account_level', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=12))

        # Changing field 'UserProfile.phone_number'
        db.alter_column('rsr_userprofile', 'phone_number', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=50))

        # Changing field 'UserProfile.validation'
        db.alter_column('rsr_userprofile', 'validation', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=20))

        # Changing field 'UserProfile.notes'
        db.alter_column('rsr_userprofile', 'notes', self.gf('akvo.rsr.fields.ValidXMLTextField')())

        # Changing field 'Category.name'
        db.alter_column('rsr_category', 'name', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=50))

        # Changing field 'Benchmarkname.name'
        db.alter_column('rsr_benchmarkname', 'name', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=80))

        # Changing field 'PublishingStatus.status'
        db.alter_column('rsr_publishingstatus', 'status', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=30))

        # Changing field 'Link.caption'
        db.alter_column('rsr_link', 'caption', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=50))

        # Changing field 'Link.kind'
        db.alter_column('rsr_link', 'kind', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=1))

        # Changing field 'Project.subtitle'
        db.alter_column('rsr_project', 'subtitle', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=75))

        # Changing field 'Project.current_image_caption'
        db.alter_column('rsr_project', 'current_image_caption', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=50))

        # Changing field 'Project.currency'
        db.alter_column('rsr_project', 'currency', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=3))

        # Changing field 'Project.title'
        db.alter_column('rsr_project', 'title', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=45))

        # Changing field 'Project.status'
        db.alter_column('rsr_project', 'status', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=1))

        # Changing field 'Project.sustainability'
        db.alter_column('rsr_project', 'sustainability', self.gf('akvo.rsr.fields.ValidXMLTextField')())

        # Changing field 'Project.language'
        db.alter_column('rsr_project', 'language', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=2))

        # Changing field 'Project.notes'
        db.alter_column('rsr_project', 'notes', self.gf('akvo.rsr.fields.ValidXMLTextField')())

        # Changing field 'Project.project_plan'
        db.alter_column('rsr_project', 'project_plan', self.gf('akvo.rsr.fields.ValidXMLTextField')())

        # Changing field 'Project.current_image_credit'
        db.alter_column('rsr_project', 'current_image_credit', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=50))

        # Changing field 'Partnership.iati_activity_id'
        db.alter_column('rsr_partnership', 'iati_activity_id', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=75, null=True))

        # Changing field 'Partnership.internal_id'
        db.alter_column('rsr_partnership', 'internal_id', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=75, null=True))

        # Changing field 'Partnership.partner_type'
        db.alter_column('rsr_partnership', 'partner_type', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=8))

        # Changing field 'Partnership.partner_type_extra'
        db.alter_column('rsr_partnership', 'partner_type_extra', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=30, null=True))

        # Changing field 'BudgetItem.other_extra'
        db.alter_column('rsr_budgetitem', 'other_extra', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=20, null=True))

        # Changing field 'BudgetItemLabel.label'
        db.alter_column('rsr_budgetitemlabel', 'label', self.gf('akvo.rsr.fields.ValidXMLCharField')(unique=True, max_length=20))

        # Changing field 'PayPalGateway.description'
        db.alter_column('rsr_paypalgateway', 'description', self.gf('akvo.rsr.fields.ValidXMLTextField')())

        # Changing field 'PayPalGateway.locale'
        db.alter_column('rsr_paypalgateway', 'locale', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=2))

        # Changing field 'PayPalGateway.currency'
        db.alter_column('rsr_paypalgateway', 'currency', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=3))

        # Changing field 'PayPalGateway.name'
        db.alter_column('rsr_paypalgateway', 'name', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=255))

        # Changing field 'MiniCMS.top_right_box'
        db.alter_column('rsr_minicms', 'top_right_box', self.gf('akvo.rsr.fields.ValidXMLTextField')(max_length=350))

        # Changing field 'MiniCMS.label'
        db.alter_column('rsr_minicms', 'label', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=50))

        # Changing field 'MiniCMS.feature_box'
        db.alter_column('rsr_minicms', 'feature_box', self.gf('akvo.rsr.fields.ValidXMLTextField')(max_length=350))

        # Changing field 'ProjectLocation.city'
        db.alter_column('rsr_projectlocation', 'city', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=255))

        # Changing field 'ProjectLocation.state'
        db.alter_column('rsr_projectlocation', 'state', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=255))

        # Changing field 'ProjectLocation.address_1'
        db.alter_column('rsr_projectlocation', 'address_1', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=255))

        # Changing field 'ProjectLocation.address_2'
        db.alter_column('rsr_projectlocation', 'address_2', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=255))

        # Changing field 'ProjectLocation.postcode'
        db.alter_column('rsr_projectlocation', 'postcode', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=10))

        # Changing field 'Country.iso_code'
        db.alter_column('rsr_country', 'iso_code', self.gf('akvo.rsr.fields.ValidXMLCharField')(unique=True, max_length=2))

        # Changing field 'Country.name'
        db.alter_column('rsr_country', 'name', self.gf('akvo.rsr.fields.ValidXMLCharField')(unique=True, max_length=50))

        # Changing field 'Country.continent'
        db.alter_column('rsr_country', 'continent', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=20))

        # Changing field 'Country.continent_code'
        db.alter_column('rsr_country', 'continent_code', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=2))

        # Changing field 'Invoice.engine'
        db.alter_column('rsr_invoice', 'engine', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=10))

        # Changing field 'Invoice.http_referer'
        db.alter_column('rsr_invoice', 'http_referer', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=255))

        # Changing field 'Invoice.notes'
        db.alter_column('rsr_invoice', 'notes', self.gf('akvo.rsr.fields.ValidXMLTextField')())

        # Changing field 'Invoice.ipn'
        db.alter_column('rsr_invoice', 'ipn', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=75, null=True))

        # Changing field 'Invoice.campaign_code'
        db.alter_column('rsr_invoice', 'campaign_code', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=15))

        # Changing field 'Invoice.bank'
        db.alter_column('rsr_invoice', 'bank', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=4))

        # Changing field 'Invoice.transaction_id'
        db.alter_column('rsr_invoice', 'transaction_id', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=100))

        # Changing field 'Invoice.name'
        db.alter_column('rsr_invoice', 'name', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=75, null=True))

        # Changing field 'PartnerType.id'
        db.alter_column('rsr_partnertype', 'id', self.gf('akvo.rsr.fields.ValidXMLCharField')(unique=True, max_length=8, primary_key=True))

        # Changing field 'PartnerType.label'
        db.alter_column('rsr_partnertype', 'label', self.gf('akvo.rsr.fields.ValidXMLCharField')(unique=True, max_length=30))

        # Changing field 'Goal.text'
        db.alter_column('rsr_goal', 'text', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=100))

        # Changing field 'OrganisationLocation.city'
        db.alter_column('rsr_organisationlocation', 'city', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=255))

        # Changing field 'OrganisationLocation.state'
        db.alter_column('rsr_organisationlocation', 'state', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=255))

        # Changing field 'OrganisationLocation.address_1'
        db.alter_column('rsr_organisationlocation', 'address_1', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=255))

        # Changing field 'OrganisationLocation.address_2'
        db.alter_column('rsr_organisationlocation', 'address_2', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=255))

        # Changing field 'OrganisationLocation.postcode'
        db.alter_column('rsr_organisationlocation', 'postcode', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=10))
        # Deleting field 'ProjectUpdate.photo_location'
        db.delete_column('rsr_projectupdate', 'photo_location')


        # Changing field 'ProjectUpdate.user_agent'
        db.alter_column('rsr_projectupdate', 'user_agent', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=200))

        # Changing field 'ProjectUpdate.photo_credit'
        db.alter_column('rsr_projectupdate', 'photo_credit', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=25))

        # Changing field 'ProjectUpdate.photo_caption'
        db.alter_column('rsr_projectupdate', 'photo_caption', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=75))

        # Changing field 'ProjectUpdate.language'
        db.alter_column('rsr_projectupdate', 'language', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=2))

        # Changing field 'ProjectUpdate.title'
        db.alter_column('rsr_projectupdate', 'title', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=50))

        # Changing field 'ProjectUpdate.text'
        db.alter_column('rsr_projectupdate', 'text', self.gf('akvo.rsr.fields.ValidXMLTextField')())

        # Changing field 'ProjectUpdate.notes'
        db.alter_column('rsr_projectupdate', 'notes', self.gf('akvo.rsr.fields.ValidXMLTextField')())

        # Changing field 'ProjectUpdate.video_credit'
        db.alter_column('rsr_projectupdate', 'video_credit', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=25))

        # Changing field 'ProjectUpdate.video_caption'
        db.alter_column('rsr_projectupdate', 'video_caption', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=75))

        # Changing field 'ProjectUpdate.update_method'
        db.alter_column('rsr_projectupdate', 'update_method', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=1))

        # Changing field 'ProjectUpdate.uuid'
        db.alter_column('rsr_projectupdate', 'uuid', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=40))

        # Changing field 'PartnerSite.about_box'
        db.alter_column('rsr_partnersite', 'about_box', self.gf('akvo.rsr.fields.ValidXMLTextField')(max_length=500))

        # Changing field 'PartnerSite.custom_return_url_text'
        db.alter_column('rsr_partnersite', 'custom_return_url_text', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=50))

        # Changing field 'PartnerSite.hostname'
        db.alter_column('rsr_partnersite', 'hostname', self.gf('akvo.rsr.fields.ValidXMLCharField')(unique=True, max_length=50))

        # Changing field 'PartnerSite.default_language'
        db.alter_column('rsr_partnersite', 'default_language', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=5))

        # Changing field 'PartnerSite.notes'
        db.alter_column('rsr_partnersite', 'notes', self.gf('akvo.rsr.fields.ValidXMLTextField')())

        # Changing field 'PartnerSite.facebook_app_id'
        db.alter_column('rsr_partnersite', 'facebook_app_id', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=40, null=True))

        # Changing field 'FocusArea.name'
        db.alter_column('rsr_focusarea', 'name', self.gf('akvo.rsr.fields.ValidXMLCharField')(max_length=50))

        # Changing field 'FocusArea.description'
        db.alter_column('rsr_focusarea', 'description', self.gf('akvo.rsr.fields.ValidXMLTextField')(max_length=500))

        # Changing field 'ProjectComment.comment'
        db.alter_column('rsr_projectcomment', 'comment', self.gf('akvo.rsr.fields.ValidXMLTextField')())

    def backwards(self, orm):

        # Changing field 'InternalOrganisationID.identifier'
        db.alter_column('rsr_internalorganisationid', 'identifier', self.gf('django.db.models.fields.CharField')(max_length=200))

        # Changing field 'Organisation.fax'
        db.alter_column('rsr_organisation', 'fax', self.gf('django.db.models.fields.CharField')(max_length=20))

        # Changing field 'Organisation.organisation_type'
        db.alter_column('rsr_organisation', 'organisation_type', self.gf('django.db.models.fields.CharField')(max_length=1))

        # Changing field 'Organisation.name'
        db.alter_column('rsr_organisation', 'name', self.gf('django.db.models.fields.CharField')(max_length=25))

        # Changing field 'Organisation.language'
        db.alter_column('rsr_organisation', 'language', self.gf('django.db.models.fields.CharField')(max_length=2))

        # Changing field 'Organisation.long_name'
        db.alter_column('rsr_organisation', 'long_name', self.gf('django.db.models.fields.CharField')(max_length=75))

        # Changing field 'Organisation.iati_org_id'
        db.alter_column('rsr_organisation', 'iati_org_id', self.gf('django.db.models.fields.CharField')(unique=True, max_length=75, null=True))

        # Changing field 'Organisation.phone'
        db.alter_column('rsr_organisation', 'phone', self.gf('django.db.models.fields.CharField')(max_length=20))

        # Changing field 'Organisation.contact_email'
        db.alter_column('rsr_organisation', 'contact_email', self.gf('django.db.models.fields.CharField')(max_length=50))

        # Changing field 'Organisation.mobile'
        db.alter_column('rsr_organisation', 'mobile', self.gf('django.db.models.fields.CharField')(max_length=20))

        # Changing field 'Organisation.contact_person'
        db.alter_column('rsr_organisation', 'contact_person', self.gf('django.db.models.fields.CharField')(max_length=30))

        # Changing field 'Organisation.notes'
        db.alter_column('rsr_organisation', 'notes', self.gf('django.db.models.fields.TextField')())

        # Changing field 'Organisation.description'
        db.alter_column('rsr_organisation', 'description', self.gf('django.db.models.fields.TextField')())

        # Changing field 'MollieGateway.description'
        db.alter_column('rsr_molliegateway', 'description', self.gf('django.db.models.fields.TextField')())

        # Changing field 'MollieGateway.currency'
        db.alter_column('rsr_molliegateway', 'currency', self.gf('django.db.models.fields.CharField')(max_length=3))

        # Changing field 'MollieGateway.partner_id'
        db.alter_column('rsr_molliegateway', 'partner_id', self.gf('django.db.models.fields.CharField')(max_length=10))

        # Changing field 'MollieGateway.name'
        db.alter_column('rsr_molliegateway', 'name', self.gf('django.db.models.fields.CharField')(max_length=255))

        # Changing field 'OrganisationAccount.account_level'
        db.alter_column('rsr_organisationaccount', 'account_level', self.gf('django.db.models.fields.CharField')(max_length=12))

        # Changing field 'UserProfile.phone_number'
        db.alter_column('rsr_userprofile', 'phone_number', self.gf('django.db.models.fields.CharField')(max_length=50))

        # Changing field 'UserProfile.validation'
        db.alter_column('rsr_userprofile', 'validation', self.gf('django.db.models.fields.CharField')(max_length=20))

        # Changing field 'UserProfile.notes'
        db.alter_column('rsr_userprofile', 'notes', self.gf('django.db.models.fields.TextField')())

        # Changing field 'Category.name'
        db.alter_column('rsr_category', 'name', self.gf('django.db.models.fields.CharField')(max_length=50))

        # Changing field 'Benchmarkname.name'
        db.alter_column('rsr_benchmarkname', 'name', self.gf('django.db.models.fields.CharField')(max_length=80))

        # Changing field 'PublishingStatus.status'
        db.alter_column('rsr_publishingstatus', 'status', self.gf('django.db.models.fields.CharField')(max_length=30))

        # Changing field 'Link.caption'
        db.alter_column('rsr_link', 'caption', self.gf('django.db.models.fields.CharField')(max_length=50))

        # Changing field 'Link.kind'
        db.alter_column('rsr_link', 'kind', self.gf('django.db.models.fields.CharField')(max_length=1))

        # Changing field 'Project.subtitle'
        db.alter_column('rsr_project', 'subtitle', self.gf('django.db.models.fields.CharField')(max_length=75))

        # Changing field 'Project.current_image_caption'
        db.alter_column('rsr_project', 'current_image_caption', self.gf('django.db.models.fields.CharField')(max_length=50))

        # Changing field 'Project.currency'
        db.alter_column('rsr_project', 'currency', self.gf('django.db.models.fields.CharField')(max_length=3))

        # Changing field 'Project.title'
        db.alter_column('rsr_project', 'title', self.gf('django.db.models.fields.CharField')(max_length=45))

        # Changing field 'Project.status'
        db.alter_column('rsr_project', 'status', self.gf('django.db.models.fields.CharField')(max_length=1))

        # Changing field 'Project.sustainability'
        db.alter_column('rsr_project', 'sustainability', self.gf('django.db.models.fields.TextField')())

        # Changing field 'Project.language'
        db.alter_column('rsr_project', 'language', self.gf('django.db.models.fields.CharField')(max_length=2))

        # Changing field 'Project.notes'
        db.alter_column('rsr_project', 'notes', self.gf('django.db.models.fields.TextField')())

        # Changing field 'Project.project_plan'
        db.alter_column('rsr_project', 'project_plan', self.gf('django.db.models.fields.TextField')())

        # Changing field 'Project.current_image_credit'
        db.alter_column('rsr_project', 'current_image_credit', self.gf('django.db.models.fields.CharField')(max_length=50))

        # Changing field 'Partnership.iati_activity_id'
        db.alter_column('rsr_partnership', 'iati_activity_id', self.gf('django.db.models.fields.CharField')(max_length=75, null=True))

        # Changing field 'Partnership.internal_id'
        db.alter_column('rsr_partnership', 'internal_id', self.gf('django.db.models.fields.CharField')(max_length=75, null=True))

        # Changing field 'Partnership.partner_type'
        db.alter_column('rsr_partnership', 'partner_type', self.gf('django.db.models.fields.CharField')(max_length=8))

        # Changing field 'Partnership.partner_type_extra'
        db.alter_column('rsr_partnership', 'partner_type_extra', self.gf('django.db.models.fields.CharField')(max_length=30, null=True))

        # Changing field 'BudgetItem.other_extra'
        db.alter_column('rsr_budgetitem', 'other_extra', self.gf('django.db.models.fields.CharField')(max_length=20, null=True))

        # Changing field 'BudgetItemLabel.label'
        db.alter_column('rsr_budgetitemlabel', 'label', self.gf('django.db.models.fields.CharField')(max_length=20, unique=True))

        # Changing field 'PayPalGateway.description'
        db.alter_column('rsr_paypalgateway', 'description', self.gf('django.db.models.fields.TextField')())

        # Changing field 'PayPalGateway.locale'
        db.alter_column('rsr_paypalgateway', 'locale', self.gf('django.db.models.fields.CharField')(max_length=2))

        # Changing field 'PayPalGateway.currency'
        db.alter_column('rsr_paypalgateway', 'currency', self.gf('django.db.models.fields.CharField')(max_length=3))

        # Changing field 'PayPalGateway.name'
        db.alter_column('rsr_paypalgateway', 'name', self.gf('django.db.models.fields.CharField')(max_length=255))

        # Changing field 'MiniCMS.top_right_box'
        db.alter_column('rsr_minicms', 'top_right_box', self.gf('django.db.models.fields.TextField')(max_length=350))

        # Changing field 'MiniCMS.label'
        db.alter_column('rsr_minicms', 'label', self.gf('django.db.models.fields.CharField')(max_length=50))

        # Changing field 'MiniCMS.feature_box'
        db.alter_column('rsr_minicms', 'feature_box', self.gf('django.db.models.fields.TextField')(max_length=350))

        # Changing field 'ProjectLocation.city'
        db.alter_column('rsr_projectlocation', 'city', self.gf('django.db.models.fields.CharField')(max_length=255))

        # Changing field 'ProjectLocation.state'
        db.alter_column('rsr_projectlocation', 'state', self.gf('django.db.models.fields.CharField')(max_length=255))

        # Changing field 'ProjectLocation.address_1'
        db.alter_column('rsr_projectlocation', 'address_1', self.gf('django.db.models.fields.CharField')(max_length=255))

        # Changing field 'ProjectLocation.address_2'
        db.alter_column('rsr_projectlocation', 'address_2', self.gf('django.db.models.fields.CharField')(max_length=255))

        # Changing field 'ProjectLocation.postcode'
        db.alter_column('rsr_projectlocation', 'postcode', self.gf('django.db.models.fields.CharField')(max_length=10))

        # Changing field 'Country.iso_code'
        db.alter_column('rsr_country', 'iso_code', self.gf('django.db.models.fields.CharField')(max_length=2, unique=True))

        # Changing field 'Country.name'
        db.alter_column('rsr_country', 'name', self.gf('django.db.models.fields.CharField')(max_length=50, unique=True))

        # Changing field 'Country.continent'
        db.alter_column('rsr_country', 'continent', self.gf('django.db.models.fields.CharField')(max_length=20))

        # Changing field 'Country.continent_code'
        db.alter_column('rsr_country', 'continent_code', self.gf('django.db.models.fields.CharField')(max_length=2))

        # Changing field 'Invoice.engine'
        db.alter_column('rsr_invoice', 'engine', self.gf('django.db.models.fields.CharField')(max_length=10))

        # Changing field 'Invoice.http_referer'
        db.alter_column('rsr_invoice', 'http_referer', self.gf('django.db.models.fields.CharField')(max_length=255))

        # Changing field 'Invoice.notes'
        db.alter_column('rsr_invoice', 'notes', self.gf('django.db.models.fields.TextField')())

        # Changing field 'Invoice.ipn'
        db.alter_column('rsr_invoice', 'ipn', self.gf('django.db.models.fields.CharField')(max_length=75, null=True))

        # Changing field 'Invoice.campaign_code'
        db.alter_column('rsr_invoice', 'campaign_code', self.gf('django.db.models.fields.CharField')(max_length=15))

        # Changing field 'Invoice.bank'
        db.alter_column('rsr_invoice', 'bank', self.gf('django.db.models.fields.CharField')(max_length=4))

        # Changing field 'Invoice.transaction_id'
        db.alter_column('rsr_invoice', 'transaction_id', self.gf('django.db.models.fields.CharField')(max_length=100))

        # Changing field 'Invoice.name'
        db.alter_column('rsr_invoice', 'name', self.gf('django.db.models.fields.CharField')(max_length=75, null=True))

        # Changing field 'PartnerType.id'
        db.alter_column('rsr_partnertype', 'id', self.gf('django.db.models.fields.CharField')(max_length=8, unique=True, primary_key=True))

        # Changing field 'PartnerType.label'
        db.alter_column('rsr_partnertype', 'label', self.gf('django.db.models.fields.CharField')(max_length=30, unique=True))

        # Changing field 'Goal.text'
        db.alter_column('rsr_goal', 'text', self.gf('django.db.models.fields.CharField')(max_length=100))

        # Changing field 'OrganisationLocation.city'
        db.alter_column('rsr_organisationlocation', 'city', self.gf('django.db.models.fields.CharField')(max_length=255))

        # Changing field 'OrganisationLocation.state'
        db.alter_column('rsr_organisationlocation', 'state', self.gf('django.db.models.fields.CharField')(max_length=255))

        # Changing field 'OrganisationLocation.address_1'
        db.alter_column('rsr_organisationlocation', 'address_1', self.gf('django.db.models.fields.CharField')(max_length=255))

        # Changing field 'OrganisationLocation.address_2'
        db.alter_column('rsr_organisationlocation', 'address_2', self.gf('django.db.models.fields.CharField')(max_length=255))

        # Changing field 'OrganisationLocation.postcode'
        db.alter_column('rsr_organisationlocation', 'postcode', self.gf('django.db.models.fields.CharField')(max_length=10))
        # Adding field 'ProjectUpdate.photo_location'
        db.add_column('rsr_projectupdate', 'photo_location',
                      self.gf('django.db.models.fields.CharField')(default='B', max_length=1),
                      keep_default=False)


        # Changing field 'ProjectUpdate.user_agent'
        db.alter_column('rsr_projectupdate', 'user_agent', self.gf('django.db.models.fields.CharField')(max_length=200))

        # Changing field 'ProjectUpdate.photo_credit'
        db.alter_column('rsr_projectupdate', 'photo_credit', self.gf('django.db.models.fields.CharField')(max_length=25))

        # Changing field 'ProjectUpdate.photo_caption'
        db.alter_column('rsr_projectupdate', 'photo_caption', self.gf('django.db.models.fields.CharField')(max_length=75))

        # Changing field 'ProjectUpdate.language'
        db.alter_column('rsr_projectupdate', 'language', self.gf('django.db.models.fields.CharField')(max_length=2))

        # Changing field 'ProjectUpdate.title'
        db.alter_column('rsr_projectupdate', 'title', self.gf('django.db.models.fields.CharField')(max_length=50))

        # Changing field 'ProjectUpdate.text'
        db.alter_column('rsr_projectupdate', 'text', self.gf('django.db.models.fields.TextField')())

        # Changing field 'ProjectUpdate.notes'
        db.alter_column('rsr_projectupdate', 'notes', self.gf('django.db.models.fields.TextField')())

        # Changing field 'ProjectUpdate.video_credit'
        db.alter_column('rsr_projectupdate', 'video_credit', self.gf('django.db.models.fields.CharField')(max_length=25))

        # Changing field 'ProjectUpdate.video_caption'
        db.alter_column('rsr_projectupdate', 'video_caption', self.gf('django.db.models.fields.CharField')(max_length=75))

        # Changing field 'ProjectUpdate.update_method'
        db.alter_column('rsr_projectupdate', 'update_method', self.gf('django.db.models.fields.CharField')(max_length=1))

        # Changing field 'ProjectUpdate.uuid'
        db.alter_column('rsr_projectupdate', 'uuid', self.gf('django.db.models.fields.CharField')(max_length=40))

        # Changing field 'PartnerSite.about_box'
        db.alter_column('rsr_partnersite', 'about_box', self.gf('django.db.models.fields.TextField')(max_length=500))

        # Changing field 'PartnerSite.custom_return_url_text'
        db.alter_column('rsr_partnersite', 'custom_return_url_text', self.gf('django.db.models.fields.CharField')(max_length=50))

        # Changing field 'PartnerSite.hostname'
        db.alter_column('rsr_partnersite', 'hostname', self.gf('django.db.models.fields.CharField')(max_length=50, unique=True))

        # Changing field 'PartnerSite.default_language'
        db.alter_column('rsr_partnersite', 'default_language', self.gf('django.db.models.fields.CharField')(max_length=5))

        # Changing field 'PartnerSite.notes'
        db.alter_column('rsr_partnersite', 'notes', self.gf('django.db.models.fields.TextField')())

        # Changing field 'PartnerSite.facebook_app_id'
        db.alter_column('rsr_partnersite', 'facebook_app_id', self.gf('django.db.models.fields.CharField')(max_length=40, null=True))

        # Changing field 'FocusArea.name'
        db.alter_column('rsr_focusarea', 'name', self.gf('django.db.models.fields.CharField')(max_length=50))

        # Changing field 'FocusArea.description'
        db.alter_column('rsr_focusarea', 'description', self.gf('django.db.models.fields.TextField')(max_length=500))

        # Changing field 'ProjectComment.comment'
        db.alter_column('rsr_projectcomment', 'comment', self.gf('django.db.models.fields.TextField')())

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
            'name': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '80'}),
            'order': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        },
        'rsr.budgetitem': {
            'Meta': {'ordering': "('label',)", 'unique_together': "(('project', 'label'),)", 'object_name': 'BudgetItem'},
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '2'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'label': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.BudgetItemLabel']"}),
            'other_extra': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'budget_items'", 'to': "orm['rsr.Project']"})
        },
        'rsr.budgetitemlabel': {
            'Meta': {'ordering': "('label',)", 'object_name': 'BudgetItemLabel'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'label': ('akvo.rsr.fields.ValidXMLCharField', [], {'unique': 'True', 'max_length': '20', 'db_index': 'True'})
        },
        'rsr.category': {
            'Meta': {'ordering': "['name']", 'object_name': 'Category'},
            'benchmarknames': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['rsr.Benchmarkname']", 'symmetrical': 'False', 'blank': 'True'}),
            'focus_area': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'categories'", 'symmetrical': 'False', 'to': "orm['rsr.FocusArea']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '50', 'db_index': 'True'})
        },
        'rsr.country': {
            'Meta': {'ordering': "['name']", 'object_name': 'Country'},
            'continent': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '20', 'db_index': 'True'}),
            'continent_code': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '2', 'db_index': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'iso_code': ('akvo.rsr.fields.ValidXMLCharField', [], {'unique': 'True', 'max_length': '2', 'db_index': 'True'}),
            'name': ('akvo.rsr.fields.ValidXMLCharField', [], {'unique': 'True', 'max_length': '50', 'db_index': 'True'})
        },
        'rsr.focusarea': {
            'Meta': {'ordering': "['name']", 'object_name': 'FocusArea'},
            'description': ('akvo.rsr.fields.ValidXMLTextField', [], {'max_length': '500'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'link_to': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'name': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '50'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'})
        },
        'rsr.goal': {
            'Meta': {'object_name': 'Goal'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'goals'", 'to': "orm['rsr.Project']"}),
            'text': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '100', 'blank': 'True'})
        },
        'rsr.internalorganisationid': {
            'Meta': {'unique_together': "(('recording_org', 'referenced_org'),)", 'object_name': 'InternalOrganisationID'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'identifier': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '200'}),
            'recording_org': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'internal_ids'", 'to': "orm['rsr.Organisation']"}),
            'referenced_org': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'reference_ids'", 'to': "orm['rsr.Organisation']"})
        },
        'rsr.invoice': {
            'Meta': {'ordering': "['-id']", 'object_name': 'Invoice'},
            'amount': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'amount_received': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '10', 'decimal_places': '2', 'blank': 'True'}),
            'bank': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '4', 'blank': 'True'}),
            'campaign_code': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '15', 'blank': 'True'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'null': 'True', 'blank': 'True'}),
            'engine': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "'paypal'", 'max_length': '10'}),
            'http_referer': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '255', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ipn': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '75', 'null': 'True', 'blank': 'True'}),
            'is_anonymous': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '75', 'null': 'True', 'blank': 'True'}),
            'notes': ('akvo.rsr.fields.ValidXMLTextField', [], {'default': "''", 'blank': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'invoices'", 'to': "orm['rsr.Project']"}),
            'status': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '1'}),
            'test': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'time': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'transaction_id': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '100', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']", 'null': 'True', 'blank': 'True'})
        },
        'rsr.link': {
            'Meta': {'object_name': 'Link'},
            'caption': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '50'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'kind': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '1'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'links'", 'to': "orm['rsr.Project']"}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        'rsr.minicms': {
            'Meta': {'ordering': "['-active', '-id']", 'object_name': 'MiniCMS'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'feature_box': ('akvo.rsr.fields.ValidXMLTextField', [], {'max_length': '350'}),
            'feature_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'label': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '50'}),
            'lower_height': ('django.db.models.fields.IntegerField', [], {'default': '500'}),
            'top_right_box': ('akvo.rsr.fields.ValidXMLTextField', [], {'max_length': '350'})
        },
        'rsr.molliegateway': {
            'Meta': {'object_name': 'MollieGateway'},
            'currency': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "'EUR'", 'max_length': '3'}),
            'description': ('akvo.rsr.fields.ValidXMLTextField', [], {'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '255'}),
            'notification_email': ('django.db.models.fields.EmailField', [], {'max_length': '75'}),
            'partner_id': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '10'})
        },
        'rsr.organisation': {
            'Meta': {'ordering': "['name']", 'object_name': 'Organisation'},
            'allow_edit': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'contact_email': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '50', 'blank': 'True'}),
            'contact_person': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '30', 'blank': 'True'}),
            'content_owner': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Organisation']", 'null': 'True', 'on_delete': 'models.SET_NULL', 'blank': 'True'}),
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'db_index': 'True', 'blank': 'True'}),
            'description': ('akvo.rsr.fields.ValidXMLTextField', [], {'blank': 'True'}),
            'fax': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '20', 'blank': 'True'}),
            'iati_org_id': ('akvo.rsr.fields.ValidXMLCharField', [], {'db_index': 'True', 'max_length': '75', 'unique': 'True', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'internal_org_ids': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'recording_organisation'", 'symmetrical': 'False', 'through': "orm['rsr.InternalOrganisationID']", 'to': "orm['rsr.Organisation']"}),
            'language': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "'en'", 'max_length': '2'}),
            'last_modified_at': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'db_index': 'True', 'blank': 'True'}),
            'logo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'long_name': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '75', 'blank': 'True'}),
            'mobile': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '20', 'blank': 'True'}),
            'name': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '25', 'db_index': 'True'}),
            'new_organisation_type': ('django.db.models.fields.IntegerField', [], {'default': '22', 'db_index': 'True'}),
            'notes': ('akvo.rsr.fields.ValidXMLTextField', [], {'default': "''", 'blank': 'True'}),
            'organisation_type': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '1', 'db_index': 'True'}),
            'partner_types': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['rsr.PartnerType']", 'symmetrical': 'False'}),
            'phone': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '20', 'blank': 'True'}),
            'primary_location': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.OrganisationLocation']", 'null': 'True', 'on_delete': 'models.SET_NULL'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'})
        },
        'rsr.organisationaccount': {
            'Meta': {'object_name': 'OrganisationAccount'},
            'account_level': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "'free'", 'max_length': '12'}),
            'organisation': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['rsr.Organisation']", 'unique': 'True', 'primary_key': 'True'})
        },
        'rsr.organisationlocation': {
            'Meta': {'ordering': "['-primary']", 'object_name': 'OrganisationLocation'},
            'address_1': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '255', 'blank': 'True'}),
            'address_2': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '255', 'blank': 'True'}),
            'city': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '255', 'blank': 'True'}),
            'country': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Country']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'latitude': ('akvo.rsr.fields.LatitudeField', [], {'default': '0', 'db_index': 'True'}),
            'location_target': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'locations'", 'null': 'True', 'to': "orm['rsr.Organisation']"}),
            'longitude': ('akvo.rsr.fields.LongitudeField', [], {'default': '0', 'db_index': 'True'}),
            'postcode': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '10', 'blank': 'True'}),
            'primary': ('django.db.models.fields.BooleanField', [], {'default': 'True', 'db_index': 'True'}),
            'state': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '255', 'blank': 'True'})
        },
        'rsr.partnership': {
            'Meta': {'ordering': "['partner_type']", 'object_name': 'Partnership'},
            'funding_amount': ('django.db.models.fields.DecimalField', [], {'db_index': 'True', 'null': 'True', 'max_digits': '10', 'decimal_places': '2', 'blank': 'True'}),
            'iati_activity_id': ('akvo.rsr.fields.ValidXMLCharField', [], {'db_index': 'True', 'max_length': '75', 'null': 'True', 'blank': 'True'}),
            'iati_url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'internal_id': ('akvo.rsr.fields.ValidXMLCharField', [], {'db_index': 'True', 'max_length': '75', 'null': 'True', 'blank': 'True'}),
            'organisation': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'partnerships'", 'to': "orm['rsr.Organisation']"}),
            'partner_type': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '8', 'db_index': 'True'}),
            'partner_type_extra': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '30', 'null': 'True', 'blank': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'partnerships'", 'to': "orm['rsr.Project']"})
        },
        'rsr.partnersite': {
            'Meta': {'ordering': "('organisation__name',)", 'object_name': 'PartnerSite'},
            'about_box': ('akvo.rsr.fields.ValidXMLTextField', [], {'max_length': '500', 'blank': 'True'}),
            'about_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'cname': ('akvo.rsr.fields.NullCharField', [], {'max_length': '100', 'unique': 'True', 'null': 'True', 'blank': 'True'}),
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'db_index': 'True', 'blank': 'True'}),
            'custom_css': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'blank': 'True'}),
            'custom_favicon': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'blank': 'True'}),
            'custom_logo': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'blank': 'True'}),
            'custom_return_url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'custom_return_url_text': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "''", 'max_length': '50', 'blank': 'True'}),
            'default_language': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "'en'", 'max_length': '5'}),
            'enabled': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'facebook_app_id': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '40', 'null': 'True', 'blank': 'True'}),
            'facebook_button': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'google_translation': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'hostname': ('akvo.rsr.fields.ValidXMLCharField', [], {'unique': 'True', 'max_length': '50'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_modified_at': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'db_index': 'True', 'blank': 'True'}),
            'notes': ('akvo.rsr.fields.ValidXMLTextField', [], {'default': "''", 'blank': 'True'}),
            'organisation': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Organisation']"}),
            'twitter_button': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'ui_translation': ('django.db.models.fields.BooleanField', [], {'default': 'False'})
        },
        'rsr.partnertype': {
            'Meta': {'ordering': "('label',)", 'object_name': 'PartnerType'},
            'id': ('akvo.rsr.fields.ValidXMLCharField', [], {'unique': 'True', 'max_length': '8', 'primary_key': 'True'}),
            'label': ('akvo.rsr.fields.ValidXMLCharField', [], {'unique': 'True', 'max_length': '30'})
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
            'currency': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "'EUR'", 'max_length': '3'}),
            'description': ('akvo.rsr.fields.ValidXMLTextField', [], {'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locale': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "'US'", 'max_length': '2'}),
            'name': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '255'}),
            'notification_email': ('django.db.models.fields.EmailField', [], {'max_length': '75'})
        },
        'rsr.project': {
            'Meta': {'ordering': "['-id']", 'object_name': 'Project'},
            'background': ('akvo.rsr.fields.ProjectLimitedTextField', [], {'blank': 'True'}),
            'budget': ('django.db.models.fields.DecimalField', [], {'decimal_places': '2', 'default': '0', 'max_digits': '10', 'blank': 'True', 'null': 'True', 'db_index': 'True'}),
            'categories': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'projects'", 'symmetrical': 'False', 'to': "orm['rsr.Category']"}),
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'db_index': 'True', 'blank': 'True'}),
            'currency': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "'EUR'", 'max_length': '3'}),
            'current_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'current_image_caption': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '50', 'blank': 'True'}),
            'current_image_credit': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '50', 'blank': 'True'}),
            'current_status': ('akvo.rsr.fields.ProjectLimitedTextField', [], {'blank': 'True'}),
            'date_complete': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'date_request_posted': ('django.db.models.fields.DateField', [], {'default': 'datetime.date.today'}),
            'donate_button': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'funds': ('django.db.models.fields.DecimalField', [], {'decimal_places': '2', 'default': '0', 'max_digits': '10', 'blank': 'True', 'null': 'True', 'db_index': 'True'}),
            'funds_needed': ('django.db.models.fields.DecimalField', [], {'decimal_places': '2', 'default': '0', 'max_digits': '10', 'blank': 'True', 'null': 'True', 'db_index': 'True'}),
            'goals_overview': ('akvo.rsr.fields.ProjectLimitedTextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "'en'", 'max_length': '2'}),
            'last_modified_at': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'db_index': 'True', 'blank': 'True'}),
            'notes': ('akvo.rsr.fields.ValidXMLTextField', [], {'default': "''", 'blank': 'True'}),
            'partners': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'projects'", 'symmetrical': 'False', 'through': "orm['rsr.Partnership']", 'to': "orm['rsr.Organisation']"}),
            'primary_location': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.ProjectLocation']", 'null': 'True', 'on_delete': 'models.SET_NULL'}),
            'project_plan': ('akvo.rsr.fields.ValidXMLTextField', [], {'blank': 'True'}),
            'project_plan_summary': ('akvo.rsr.fields.ProjectLimitedTextField', [], {}),
            'project_rating': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'status': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "'N'", 'max_length': '1', 'db_index': 'True'}),
            'subtitle': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '75'}),
            'sustainability': ('akvo.rsr.fields.ValidXMLTextField', [], {}),
            'sync_owner': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Organisation']", 'null': 'True', 'on_delete': 'models.SET_NULL'}),
            'target_group': ('akvo.rsr.fields.ProjectLimitedTextField', [], {'blank': 'True'}),
            'title': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '45', 'db_index': 'True'})
        },
        'rsr.projectcomment': {
            'Meta': {'ordering': "('-id',)", 'object_name': 'ProjectComment'},
            'comment': ('akvo.rsr.fields.ValidXMLTextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'comments'", 'to': "orm['rsr.Project']"}),
            'time': ('django.db.models.fields.DateTimeField', [], {'db_index': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"})
        },
        'rsr.projectlocation': {
            'Meta': {'ordering': "['-primary']", 'object_name': 'ProjectLocation'},
            'address_1': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '255', 'blank': 'True'}),
            'address_2': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '255', 'blank': 'True'}),
            'city': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '255', 'blank': 'True'}),
            'country': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Country']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'latitude': ('akvo.rsr.fields.LatitudeField', [], {'default': '0', 'db_index': 'True'}),
            'location_target': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'locations'", 'null': 'True', 'to': "orm['rsr.Project']"}),
            'longitude': ('akvo.rsr.fields.LongitudeField', [], {'default': '0', 'db_index': 'True'}),
            'postcode': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '10', 'blank': 'True'}),
            'primary': ('django.db.models.fields.BooleanField', [], {'default': 'True', 'db_index': 'True'}),
            'state': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '255', 'blank': 'True'})
        },
        'rsr.projectupdate': {
            'Meta': {'ordering': "['-id']", 'object_name': 'ProjectUpdate'},
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'db_index': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "'en'", 'max_length': '2'}),
            'last_modified_at': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'db_index': 'True', 'blank': 'True'}),
            'notes': ('akvo.rsr.fields.ValidXMLTextField', [], {'default': "''", 'blank': 'True'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'photo_caption': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '75', 'blank': 'True'}),
            'photo_credit': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '25', 'blank': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'project_updates'", 'to': "orm['rsr.Project']"}),
            'text': ('akvo.rsr.fields.ValidXMLTextField', [], {'blank': 'True'}),
            'title': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '50', 'db_index': 'True'}),
            'update_method': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "'W'", 'max_length': '1', 'db_index': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"}),
            'user_agent': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "''", 'max_length': '200', 'blank': 'True'}),
            'uuid': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "''", 'max_length': '40', 'db_index': 'True', 'blank': 'True'}),
            'video': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'video_caption': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '75', 'blank': 'True'}),
            'video_credit': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '25', 'blank': 'True'})
        },
        'rsr.publishingstatus': {
            'Meta': {'ordering': "('-status', 'project')", 'object_name': 'PublishingStatus'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['rsr.Project']", 'unique': 'True'}),
            'status': ('akvo.rsr.fields.ValidXMLCharField', [], {'default': "'unpublished'", 'max_length': '30'})
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
            'notes': ('akvo.rsr.fields.ValidXMLTextField', [], {'default': "''", 'blank': 'True'}),
            'organisation': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['rsr.Organisation']"}),
            'phone_number': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '50', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['auth.User']", 'unique': 'True'}),
            'validation': ('akvo.rsr.fields.ValidXMLCharField', [], {'max_length': '20', 'blank': 'True'})
        }
    }

    complete_apps = ['rsr']