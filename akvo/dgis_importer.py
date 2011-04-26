#!/usr/bin/env python
# -*- coding: utf-8 -*-

#to be run in the akvo rsr root folder.


from __future__ import with_statement

from django.core.management import setup_environ
import settings
setup_environ(settings)

from os.path import basename, splitext
import csv

from akvo.rsr.models import *

def foo():
    """
    Notes while implemeting the importer
    ====================================
    
    Problems/questions regarding data:
        DGIS is not consitently named:
        Ministry of Foreign Affairs (DGIS) or only DGIS
        The extending org Directie Milieu, Water, Klimaat en Energie has ID NL-1 Is this also DGIS?

        URLs to photos should be just that. Not URLs to web pages with photos or videos.
        
    The Activity location section:
        It is assumed that either all locations are in the same country or that there is
        one location per country. Multiple locs from multiple countries are not supported atm
    

    Org types
        How do we handle org types? Akvo defines 4 types:
            ORG_TYPE_NGO = 'N', _('NGO')
            ORG_TYPE_GOV = 'G', _('Governmental')
            ORG_TYPE_COM = 'C', _('Commercial')
            ORG_TYPE_KNO = 'K', _('Knowledge institution')
        IATI has the following list (based on DAC I think and used by DGIS I presume):
            10	Government
            15	Other Public Sector
            21	International NGO
            22	National NGO
            23	Regional NGO
            30	Public Private Partnership
            40	Multilateral
            60	Foundation
            70	Private Sector
            80	Academic, Training and Research
        How do we reconcile the two? I've made a simple mapping but the larger question is should we
        keep "our" types or migrate to the DAC? And if we migrate how do we handle the current data set?
    """
    pass


SECTIONS = [
    {
        'section': dict( # funding
            first_line='participating org',
            next_line='participating org',
        ),
        'object_info': dict(
            model=Organisation,
            map={
                'name:': 'name',
                'Org type:': 'organisation_type',
                'ID:': 'iati_id',
                'Role:': 'organisation_partnership'
            }
        )
    },
    {
        'section': dict( # extending
            first_line='participating org',
            next_line='participating org',
        ),
        'object_info': dict(
            model=Organisation,
            map={
                'name:': 'name',
                'Org type:': 'organisation_type',
                'ID:': 'iati_id',
                'Role:': 'organisation_partnership'
            }
        )
    },
    {
        'section': dict( # implementing
            first_line='participating org',
            next_line='activity location',
        ),
        'object_info': dict(
            model=Organisation,
            map={
                'name:': 'name',
                'Org type:': 'organisation_type',
                'ID:': 'iati_id',
                'Role:': 'organisation_partnership'
            }
        )
    },
    {
        'section': dict(
            first_line='activity location',
            next_line='websites'
        ),
        'object_info': dict(
            model=Location,
            map={
                'Country name:': 'country',
                'City/village:': 'city',
                'Latitude:': 'latitude',
                'Longitude:': 'longitude',
            }
        )
    },
    {
        'section': dict(
            first_line='websites',
            next_line='photos'
        ),
        'object_info': dict(
            model=Link,
            map={
                'Description:': 'caption',
                'URL:': 'url',
            }
        )
    },
    {
        'section': dict(
            first_line='photos',
            next_line='activity description'
        ),
        'object_info': dict(
            model=Project,
            map={
                'Description:': 'current_image_caption',
                'URL:': 'current_image',
            }
        )
    },
    {
        'section': dict(
            first_line='funding',
            next_line='indicators'
        ),
        'object_info': dict(
            model=FundingPartner,
            map={
                'Value:': 'funding_amount',
                'Provider:': 'funding_organisation',
            }
        )
    },
    {
        'section': dict(
            first_line='indicators',
            next_line='related activities'
        ),
        'object_info': dict(
            model=Benchmark,
            map={
                'Description:': 'name',
                'Target value:': 'value',
            }
        )
    },
    {
        'section': dict(
            first_line='related activities',
            next_line='extra project information'
        ),
        'object_info': dict(
            model=Link,
            map={
                'Type:': 'activity_type',
                'Identifier:': 'activity_id',
                'Title:': 'title',
            }
        )
    },
]

project_info = dict(
    model=Project,
    map={
        'Project number:': 'original_id', # NYI - Not Yet Implemented
        'Standard language:': 'default_language', # NYI
        'Standard currency:': 'default_currency', # NYI
        'Title:': 'name',
        'Expected Start date:': 'planned_start_date', # NYI
        'Expected End date:': 'planned_end_date', # NYI
        'Status code:': 'status',
        'Status text:': '', # Not used
        'Sector code:': 'sector_code', # NYI
        'Sector code text:': '', # Not used
        'IATI Identifier:': 'iati_activity_id', # NYI
        'Organisation ID:': 'other_iati_org_id', # NYI
        'Other Identifier:': 'other_original_id', # NYI
        'Collaboration type code': '', # Not used
        'Collaboration type text': '', # Not used
        'Flow type code': '', # Not used
        'Flow type text': '', # Not used
        'Finance type code:': '', # Not used
        'Finance type text:': '', # Not used
        'Identifier': '', # Not used - Akvo is reporting org
        'Type': '', # Not used - Akvo is reporting org
        'Name': '', # Not used - Akvo is reporting org
        'Summary:': 'project_plan_summary',
        'Objectives:': 'goals_overview',
        'Target group:': 'target_group', # NYI
        'Output 1:': 'goal_1',
        'Output 2:': 'goal_2',
        'Output 3:': 'goal_3',
        'Output 4:': 'goal_4',
        'Output 5:': 'goal_5',
        'Value:': 'budgetitem_set',
        'Activity plan details:': 'project_plan_detail',
        'Current status:': 'current_status_detail',
        'Sustainability:': 'sustainability',
        'Local context:': 'context',
    }
)

class CSV_List():
    def __init__(self, data=None, section=None):
        self.data = data or []
        self.section = section or []
    
    def get_rows(self, first_line, next_line=None):
        first = next = -1
        for i in range(len(self.data)):
            if first < 0 and self.data[i][0].strip().lower() == first_line:
                first = i
                if next_line == None:
                    next = first + 1
            elif first > -1 and self.data[i][0].strip().lower() == next_line:
                next = i
            if first  > -1 and next and next > first:
                self.section = self.data[first:next]
                self.data = self.data[:first] + self.data[next:]
                return self.section

    def create_mappings(self, csv_to_oject_map):
        """creates a dics for each set of data that is to be iported as an RSR object
        """
        max_len = max([len(item) for item in self.section]) - 1 # first item is DGIS "field name"
        mappings = [{'_model': csv_to_oject_map.get('model')} for i in range(max_len)]
        for line in self.section:
            field = csv_to_oject_map['map'].get(line[0], None)
            if field:
                for i in range(max_len):
                    try:
                        mappings[i][field] = line[i+1]
                    except:
                        if len(line) > 1:
                            mappings[i][field] = line[len(line)-1]
                        else:
                            mappings[i][field] = ''
        return mappings

class DGIS_Importer():
    def __init__(self, filename='DGIS_data_short_16635.csv'):
        self.filename = filename
        self.list = CSV_List()
        self.mappings = []
    
    def create_organisation(self, mapping):
        org_type_mapping = {
            '10': Organisation.ORG_TYPE_GOV,
            '15': Organisation.ORG_TYPE_GOV,
            '21': Organisation.ORG_TYPE_NGO,
            '22': Organisation.ORG_TYPE_NGO,
            '23': Organisation.ORG_TYPE_NGO,
            '30': Organisation.ORG_TYPE_NGO,
            '40': Organisation.ORG_TYPE_COM,
            '60': Organisation.ORG_TYPE_COM,
            '70': Organisation.ORG_TYPE_COM,
            '80': Organisation.ORG_TYPE_KNO,
        }
        obj = mapping.pop('_model', False)
        for k, v in mapping.iteritems():
            if k == 'organisation_type':
                mapping[k] = org_type_mapping[v]
        import pdb
        pdb.set_trace()
        name = mapping.pop('name')
        organisation_partnership = mapping.pop('organisation_partnership')
        iati_id = mapping.pop('iati_id')
        
        new_obj, created = obj.objects.get_or_create(name=name, defaults=mapping)
        print new_obj, created

    def create_objects(self):
        for mapping in self.mappings:
            model = mapping.get('_model', '')
            if model:
                method = getattr(self, "create_%s" % model.__name__.lower(), False)
                if method:
                    method(mapping)

        #new_fa, created = FocusArea.objects.get_or_create(name=focus_area['name'], defaults={'slug': focus_area['slug']})

    
    def parse_dgis_sheet(self):
        with open(self.filename, 'r') as file:
            csv_data = csv.reader(file)
            # create a list of each non-empty row in the csv,
            # each element in the list is one item from the csv
            for row in csv_data:
                if len(row) > 0:
                    self.list.data.append(row)
            
            # using SECTIONS, grab a bunch of rows delimited by first_line and next_line
            # that comprise data for one RSR object
            for section in SECTIONS:                
                self.list.get_rows(**section['section'])
                #create a dict with RSR field names (sorta) mapping the grabbed data
                self.mappings.extend(self.list.create_mappings(section['object_info']))                
            # what's left is "raw" project data
            self.list.section = self.list.data
            self.mappings.extend(self.list.create_mappings(project_info))
            self.create_objects()

            #for row in csv_data:
            #    if len(row) > 1:
            #        if data.get(row[0].lower().strip(': '), False):
            #            data[row[0]].extend(row[1:])
            #        else:
            #            data[row[0]] = row[1:]    
            #print unicode(data)


if __name__ == '__main__':
    #while test_data:
    #    try:
    #        test_data, extracted = get_rows(test_data[0][0], test_data[1][0], test_data)
    #        print test_data
    #        print extracted
    #    except IndexError:
    #        pass
    imp = DGIS_Importer()
    imp.parse_dgis_sheet()
