# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'ActivityDateType'
        db.create_table(u'codelists_activitydatetype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['ActivityDateType'])

        # Adding model 'ActivityScope'
        db.create_table(u'codelists_activityscope', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['ActivityScope'])

        # Adding model 'ActivityStatus'
        db.create_table(u'codelists_activitystatus', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('language', self.gf('django.db.models.fields.CharField')(max_length=2, blank=True)),
        ))
        db.send_create_signal('codelists', ['ActivityStatus'])

        # Adding model 'AidType'
        db.create_table(u'codelists_aidtype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('category', self.gf('django.db.models.fields.CharField')(max_length=2, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('language', self.gf('django.db.models.fields.CharField')(max_length=2, blank=True)),
            ('category_name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('category_description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['AidType'])

        # Adding model 'AidTypeCategory'
        db.create_table(u'codelists_aidtypecategory', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['AidTypeCategory'])

        # Adding model 'AidTypeFlag'
        db.create_table(u'codelists_aidtypeflag', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
        ))
        db.send_create_signal('codelists', ['AidTypeFlag'])

        # Adding model 'BudgetIdentifier'
        db.create_table(u'codelists_budgetidentifier', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('category', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('sector', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
        ))
        db.send_create_signal('codelists', ['BudgetIdentifier'])

        # Adding model 'BudgetIdentifierSector'
        db.create_table(u'codelists_budgetidentifiersector', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('category', self.gf('django.db.models.fields.CharField')(max_length=2, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
        ))
        db.send_create_signal('codelists', ['BudgetIdentifierSector'])

        # Adding model 'BudgetIdentifierSectorCategory'
        db.create_table(u'codelists_budgetidentifiersectorcategory', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
        ))
        db.send_create_signal('codelists', ['BudgetIdentifierSectorCategory'])

        # Adding model 'BudgetIdentifierVocabulary'
        db.create_table(u'codelists_budgetidentifiervocabulary', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['BudgetIdentifierVocabulary'])

        # Adding model 'BudgetType'
        db.create_table(u'codelists_budgettype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('language', self.gf('django.db.models.fields.CharField')(max_length=2, blank=True)),
        ))
        db.send_create_signal('codelists', ['BudgetType'])

        # Adding model 'CollaborationType'
        db.create_table(u'codelists_collaborationtype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('language', self.gf('django.db.models.fields.CharField')(max_length=2, blank=True)),
        ))
        db.send_create_signal('codelists', ['CollaborationType'])

        # Adding model 'ConditionType'
        db.create_table(u'codelists_conditiontype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('language', self.gf('django.db.models.fields.CharField')(max_length=2, blank=True)),
        ))
        db.send_create_signal('codelists', ['ConditionType'])

        # Adding model 'ContactType'
        db.create_table(u'codelists_contacttype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['ContactType'])

        # Adding model 'Country'
        db.create_table(u'codelists_country', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('language', self.gf('django.db.models.fields.CharField')(max_length=2, blank=True)),
        ))
        db.send_create_signal('codelists', ['Country'])

        # Adding model 'CRSAddOtherFlags'
        db.create_table(u'codelists_crsaddotherflags', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['CRSAddOtherFlags'])

        # Adding model 'Currency'
        db.create_table(u'codelists_currency', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('language', self.gf('django.db.models.fields.CharField')(max_length=2, blank=True)),
        ))
        db.send_create_signal('codelists', ['Currency'])

        # Adding model 'DescriptionType'
        db.create_table(u'codelists_descriptiontype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['DescriptionType'])

        # Adding model 'DisbursementChannel'
        db.create_table(u'codelists_disbursementchannel', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['DisbursementChannel'])

        # Adding model 'DocumentCategory'
        db.create_table(u'codelists_documentcategory', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('category', self.gf('django.db.models.fields.CharField')(max_length=2, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('category_name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
        ))
        db.send_create_signal('codelists', ['DocumentCategory'])

        # Adding model 'DocumentCategoryCategory'
        db.create_table(u'codelists_documentcategorycategory', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['DocumentCategoryCategory'])

        # Adding model 'FileFormat'
        db.create_table(u'codelists_fileformat', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('category', self.gf('django.db.models.fields.CharField')(max_length=20, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
        ))
        db.send_create_signal('codelists', ['FileFormat'])

        # Adding model 'FinanceType'
        db.create_table(u'codelists_financetype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('category', self.gf('django.db.models.fields.CharField')(max_length=3, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('category_name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('category_description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['FinanceType'])

        # Adding model 'FinanceTypeCategory'
        db.create_table(u'codelists_financetypecategory', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['FinanceTypeCategory'])

        # Adding model 'FlowType'
        db.create_table(u'codelists_flowtype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['FlowType'])

        # Adding model 'GazetteerAgency'
        db.create_table(u'codelists_gazetteeragency', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
        ))
        db.send_create_signal('codelists', ['GazetteerAgency'])

        # Adding model 'GeographicExactness'
        db.create_table(u'codelists_geographicexactness', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['GeographicExactness'])

        # Adding model 'GeographicLocationClass'
        db.create_table(u'codelists_geographiclocationclass', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['GeographicLocationClass'])

        # Adding model 'GeographicLocationReach'
        db.create_table(u'codelists_geographiclocationreach', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['GeographicLocationReach'])

        # Adding model 'GeographicVocabulary'
        db.create_table(u'codelists_geographicvocabulary', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
        ))
        db.send_create_signal('codelists', ['GeographicVocabulary'])

        # Adding model 'GeographicalPrecision'
        db.create_table(u'codelists_geographicalprecision', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['GeographicalPrecision'])

        # Adding model 'IndicatorMeasure'
        db.create_table(u'codelists_indicatormeasure', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['IndicatorMeasure'])

        # Adding model 'Language'
        db.create_table(u'codelists_language', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
        ))
        db.send_create_signal('codelists', ['Language'])

        # Adding model 'LoanRepaymentPeriod'
        db.create_table(u'codelists_loanrepaymentperiod', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['LoanRepaymentPeriod'])

        # Adding model 'LoanRepaymentType'
        db.create_table(u'codelists_loanrepaymenttype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['LoanRepaymentType'])

        # Adding model 'LocationType'
        db.create_table(u'codelists_locationtype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('category', self.gf('django.db.models.fields.CharField')(max_length=2, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['LocationType'])

        # Adding model 'LocationTypeCategory'
        db.create_table(u'codelists_locationtypecategory', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
        ))
        db.send_create_signal('codelists', ['LocationTypeCategory'])

        # Adding model 'OrganisationIdentifier'
        db.create_table(u'codelists_organisationidentifier', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('abbreviation', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
        ))
        db.send_create_signal('codelists', ['OrganisationIdentifier'])

        # Adding model 'OrganisationRegistrationAgency'
        db.create_table(u'codelists_organisationregistrationagency', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('category', self.gf('django.db.models.fields.CharField')(max_length=2, blank=True)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['OrganisationRegistrationAgency'])

        # Adding model 'OrganisationRole'
        db.create_table(u'codelists_organisationrole', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['OrganisationRole'])

        # Adding model 'OrganisationType'
        db.create_table(u'codelists_organisationtype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
        ))
        db.send_create_signal('codelists', ['OrganisationType'])

        # Adding model 'OtherIdentifierType'
        db.create_table(u'codelists_otheridentifiertype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['OtherIdentifierType'])

        # Adding model 'PolicyMarker'
        db.create_table(u'codelists_policymarker', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
        ))
        db.send_create_signal('codelists', ['PolicyMarker'])

        # Adding model 'PolicyMarkerVocabulary'
        db.create_table(u'codelists_policymarkervocabulary', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['PolicyMarkerVocabulary'])

        # Adding model 'PolicySignificance'
        db.create_table(u'codelists_policysignificance', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['PolicySignificance'])

        # Adding model 'PublisherType'
        db.create_table(u'codelists_publishertype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['PublisherType'])

        # Adding model 'Region'
        db.create_table(u'codelists_region', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
        ))
        db.send_create_signal('codelists', ['Region'])

        # Adding model 'RegionVocabulary'
        db.create_table(u'codelists_regionvocabulary', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['RegionVocabulary'])

        # Adding model 'RelatedActivityType'
        db.create_table(u'codelists_relatedactivitytype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['RelatedActivityType'])

        # Adding model 'ResultType'
        db.create_table(u'codelists_resulttype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['ResultType'])

        # Adding model 'Sector'
        db.create_table(u'codelists_sector', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('category', self.gf('django.db.models.fields.CharField')(max_length=3, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('category_name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('category_description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['Sector'])

        # Adding model 'SectorCategory'
        db.create_table(u'codelists_sectorcategory', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['SectorCategory'])

        # Adding model 'SectorVocabulary'
        db.create_table(u'codelists_sectorvocabulary', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['SectorVocabulary'])

        # Adding model 'TiedStatus'
        db.create_table(u'codelists_tiedstatus', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['TiedStatus'])

        # Adding model 'TransactionType'
        db.create_table(u'codelists_transactiontype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['TransactionType'])

        # Adding model 'ValueType'
        db.create_table(u'codelists_valuetype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['ValueType'])

        # Adding model 'VerificationStatus'
        db.create_table(u'codelists_verificationstatus', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('codelists', ['VerificationStatus'])

        # Adding model 'Version'
        db.create_table(u'codelists_version', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=4)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
        ))
        db.send_create_signal('codelists', ['Version'])

        # Adding model 'Vocabulary'
        db.create_table(u'codelists_vocabulary', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('version', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['codelists.Version'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
        ))
        db.send_create_signal('codelists', ['Vocabulary'])


    def backwards(self, orm):
        # Deleting model 'ActivityDateType'
        db.delete_table(u'codelists_activitydatetype')

        # Deleting model 'ActivityScope'
        db.delete_table(u'codelists_activityscope')

        # Deleting model 'ActivityStatus'
        db.delete_table(u'codelists_activitystatus')

        # Deleting model 'AidType'
        db.delete_table(u'codelists_aidtype')

        # Deleting model 'AidTypeCategory'
        db.delete_table(u'codelists_aidtypecategory')

        # Deleting model 'AidTypeFlag'
        db.delete_table(u'codelists_aidtypeflag')

        # Deleting model 'BudgetIdentifier'
        db.delete_table(u'codelists_budgetidentifier')

        # Deleting model 'BudgetIdentifierSector'
        db.delete_table(u'codelists_budgetidentifiersector')

        # Deleting model 'BudgetIdentifierSectorCategory'
        db.delete_table(u'codelists_budgetidentifiersectorcategory')

        # Deleting model 'BudgetIdentifierVocabulary'
        db.delete_table(u'codelists_budgetidentifiervocabulary')

        # Deleting model 'BudgetType'
        db.delete_table(u'codelists_budgettype')

        # Deleting model 'CollaborationType'
        db.delete_table(u'codelists_collaborationtype')

        # Deleting model 'ConditionType'
        db.delete_table(u'codelists_conditiontype')

        # Deleting model 'ContactType'
        db.delete_table(u'codelists_contacttype')

        # Deleting model 'Country'
        db.delete_table(u'codelists_country')

        # Deleting model 'CRSAddOtherFlags'
        db.delete_table(u'codelists_crsaddotherflags')

        # Deleting model 'Currency'
        db.delete_table(u'codelists_currency')

        # Deleting model 'DescriptionType'
        db.delete_table(u'codelists_descriptiontype')

        # Deleting model 'DisbursementChannel'
        db.delete_table(u'codelists_disbursementchannel')

        # Deleting model 'DocumentCategory'
        db.delete_table(u'codelists_documentcategory')

        # Deleting model 'DocumentCategoryCategory'
        db.delete_table(u'codelists_documentcategorycategory')

        # Deleting model 'FileFormat'
        db.delete_table(u'codelists_fileformat')

        # Deleting model 'FinanceType'
        db.delete_table(u'codelists_financetype')

        # Deleting model 'FinanceTypeCategory'
        db.delete_table(u'codelists_financetypecategory')

        # Deleting model 'FlowType'
        db.delete_table(u'codelists_flowtype')

        # Deleting model 'GazetteerAgency'
        db.delete_table(u'codelists_gazetteeragency')

        # Deleting model 'GeographicExactness'
        db.delete_table(u'codelists_geographicexactness')

        # Deleting model 'GeographicLocationClass'
        db.delete_table(u'codelists_geographiclocationclass')

        # Deleting model 'GeographicLocationReach'
        db.delete_table(u'codelists_geographiclocationreach')

        # Deleting model 'GeographicVocabulary'
        db.delete_table(u'codelists_geographicvocabulary')

        # Deleting model 'GeographicalPrecision'
        db.delete_table(u'codelists_geographicalprecision')

        # Deleting model 'IndicatorMeasure'
        db.delete_table(u'codelists_indicatormeasure')

        # Deleting model 'Language'
        db.delete_table(u'codelists_language')

        # Deleting model 'LoanRepaymentPeriod'
        db.delete_table(u'codelists_loanrepaymentperiod')

        # Deleting model 'LoanRepaymentType'
        db.delete_table(u'codelists_loanrepaymenttype')

        # Deleting model 'LocationType'
        db.delete_table(u'codelists_locationtype')

        # Deleting model 'LocationTypeCategory'
        db.delete_table(u'codelists_locationtypecategory')

        # Deleting model 'OrganisationIdentifier'
        db.delete_table(u'codelists_organisationidentifier')

        # Deleting model 'OrganisationRegistrationAgency'
        db.delete_table(u'codelists_organisationregistrationagency')

        # Deleting model 'OrganisationRole'
        db.delete_table(u'codelists_organisationrole')

        # Deleting model 'OrganisationType'
        db.delete_table(u'codelists_organisationtype')

        # Deleting model 'OtherIdentifierType'
        db.delete_table(u'codelists_otheridentifiertype')

        # Deleting model 'PolicyMarker'
        db.delete_table(u'codelists_policymarker')

        # Deleting model 'PolicyMarkerVocabulary'
        db.delete_table(u'codelists_policymarkervocabulary')

        # Deleting model 'PolicySignificance'
        db.delete_table(u'codelists_policysignificance')

        # Deleting model 'PublisherType'
        db.delete_table(u'codelists_publishertype')

        # Deleting model 'Region'
        db.delete_table(u'codelists_region')

        # Deleting model 'RegionVocabulary'
        db.delete_table(u'codelists_regionvocabulary')

        # Deleting model 'RelatedActivityType'
        db.delete_table(u'codelists_relatedactivitytype')

        # Deleting model 'ResultType'
        db.delete_table(u'codelists_resulttype')

        # Deleting model 'Sector'
        db.delete_table(u'codelists_sector')

        # Deleting model 'SectorCategory'
        db.delete_table(u'codelists_sectorcategory')

        # Deleting model 'SectorVocabulary'
        db.delete_table(u'codelists_sectorvocabulary')

        # Deleting model 'TiedStatus'
        db.delete_table(u'codelists_tiedstatus')

        # Deleting model 'TransactionType'
        db.delete_table(u'codelists_transactiontype')

        # Deleting model 'ValueType'
        db.delete_table(u'codelists_valuetype')

        # Deleting model 'VerificationStatus'
        db.delete_table(u'codelists_verificationstatus')

        # Deleting model 'Version'
        db.delete_table(u'codelists_version')

        # Deleting model 'Vocabulary'
        db.delete_table(u'codelists_vocabulary')


    models = {
        'codelists.activitydatetype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'ActivityDateType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.activityscope': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'ActivityScope'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.activitystatus': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'ActivityStatus'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.aidtype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'AidType'},
            'category': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'category_description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'category_name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.aidtypecategory': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'AidTypeCategory'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.aidtypeflag': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'AidTypeFlag'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.budgetidentifier': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'BudgetIdentifier'},
            'category': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'sector': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.budgetidentifiersector': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'BudgetIdentifierSector'},
            'category': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.budgetidentifiersectorcategory': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'BudgetIdentifierSectorCategory'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.budgetidentifiervocabulary': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'BudgetIdentifierVocabulary'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.budgettype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'BudgetType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.collaborationtype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'CollaborationType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.conditiontype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'ConditionType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.contacttype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'ContactType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.country': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'Country'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.crsaddotherflags': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'CRSAddOtherFlags'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.currency': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'Currency'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.descriptiontype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'DescriptionType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.disbursementchannel': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'DisbursementChannel'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.documentcategory': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'DocumentCategory'},
            'category': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'category_name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.documentcategorycategory': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'DocumentCategoryCategory'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.fileformat': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'FileFormat'},
            'category': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.financetype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'FinanceType'},
            'category': ('django.db.models.fields.CharField', [], {'max_length': '3', 'blank': 'True'}),
            'category_description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'category_name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.financetypecategory': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'FinanceTypeCategory'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.flowtype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'FlowType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.gazetteeragency': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'GazetteerAgency'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.geographicalprecision': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'GeographicalPrecision'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.geographicexactness': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'GeographicExactness'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.geographiclocationclass': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'GeographicLocationClass'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.geographiclocationreach': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'GeographicLocationReach'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.geographicvocabulary': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'GeographicVocabulary'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.indicatormeasure': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'IndicatorMeasure'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.language': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'Language'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.loanrepaymentperiod': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'LoanRepaymentPeriod'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.loanrepaymenttype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'LoanRepaymentType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.locationtype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'LocationType'},
            'category': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.locationtypecategory': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'LocationTypeCategory'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.organisationidentifier': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'OrganisationIdentifier'},
            'abbreviation': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.organisationregistrationagency': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'OrganisationRegistrationAgency'},
            'category': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.organisationrole': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'OrganisationRole'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.organisationtype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'OrganisationType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.otheridentifiertype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'OtherIdentifierType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.policymarker': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'PolicyMarker'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.policymarkervocabulary': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'PolicyMarkerVocabulary'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.policysignificance': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'PolicySignificance'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.publishertype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'PublisherType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.region': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'Region'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.regionvocabulary': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'RegionVocabulary'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.relatedactivitytype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'RelatedActivityType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.resulttype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'ResultType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.sector': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'Sector'},
            'category': ('django.db.models.fields.CharField', [], {'max_length': '3', 'blank': 'True'}),
            'category_description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'category_name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.sectorcategory': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'SectorCategory'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.sectorvocabulary': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'SectorVocabulary'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.tiedstatus': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'TiedStatus'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.transactiontype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'TransactionType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.valuetype': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'ValueType'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.verificationstatus': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'VerificationStatus'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        },
        'codelists.version': {
            'Meta': {'ordering': "('-code',)", 'object_name': 'Version'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '4'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'})
        },
        'codelists.vocabulary': {
            'Meta': {'ordering': "('-version', 'code')", 'object_name': 'Vocabulary'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'version': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['codelists.Version']"})
        }
    }

    complete_apps = ['codelists']