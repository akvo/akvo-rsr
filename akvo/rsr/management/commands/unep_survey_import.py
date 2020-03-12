# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import copy
import csv

from django.core.management.base import BaseCommand
from django.db.utils import DataError

from akvo.rsr.models import (
    Link,
    Organisation,
    OrganisationCustomField,
    Partnership,
    PartnerSite,
    Project,
    ProjectContact,
)


class Command(BaseCommand):
    help = "Script to import UNEP survey data to RSR projects"

    def add_arguments(self, parser):
        parser.add_argument("UNEP_CSV", type=open, help="Path to the CSV file")
        parser.add_argument(
            "--start-line",
            type=int,
            default=1,
            help="Line to start importing from",
        )
        parser.add_argument(
            "--delete-data",
            action="store_true",
            default=False,
            help="Flag to indicate deleting the created data at the end of the run. Useful for developers",
        )

    def handle(self, *args, **options):
        csv_file = options["UNEP_CSV"]
        delete_data = options["delete_data"]
        data = csv.reader(csv_file)
        headers = next(data)

        # Ignore lines until the specified start
        start = options["start_line"]
        for i in range(1, start):
            next(data)

        unep = self.setup_unep()
        self.setup_partnersite(unep)
        for csv_line in data:
            importer = CSVToProject(
                unep, headers, csv_line, delete_data=delete_data
            )
            importer.run()

        if delete_data:
            OrganisationCustomField.objects.filter(
                organisation__name="UNEP"
            ).delete()

    def setup_unep(self):
        data = dict(long_name="UN Environment Programme")
        unep, _ = Organisation.objects.get_or_create(
            name="UNEP", defaults=data
        )
        return unep

    def setup_partnersite(self, organisation):
        data = {
            "hostname": "unep",
            "password": "UNEP Demo",
            "tagline": "UNEP Demo",
            "piwik_id": 0,
        }
        partnersite, _ = PartnerSite.objects.get_or_create(
            organisation=organisation, defaults=data
        )
        return partnersite


class CSVToProject(object):
    def __init__(self, organisation, headers, data, delete_data=False):
        self.organisation = organisation
        self.headers = headers
        self.data = data
        self.responses = dict(zip(headers, data))
        self.delete_data = delete_data

    def run(self):
        if self.data[3].strip().lower().startswith("no"):
            print("Ignoring survey since answers are not to best of particpants' knowledge")
            return

        self.project = self.create_project()
        self.import_contact()
        self.import_action_count()
        self.import_type_of_action()
        self.import_organisation_role()
        self.import_implementor()
        self.import_reporting()
        self.import_impact_evaluation()
        self.import_geographical_focus()
        self.import_target_place()
        self.import_target_lifecycle()
        self.import_target_reduce_reuse_recycle()
        self.import_impact()
        self.import_target_pollutant()
        self.import_target_sector()
        self.import_funding()
        self.import_duration()
        self.import_links()
        self.import_additional_comment()

        print("#" * 30)
        if not self.delete_data:
            print("Created project: {}".format(self.project.pk))
        print(self.project.title)
        print(self.project.subtitle)
        for cf in self.project.custom_fields.order_by("pk"):
            if cf.type == "dropdown":
                assert not cf.value
                print(cf.name)
                print("    ", cf.dropdown_selection)
            else:
                assert cf.dropdown_selection is None
                print(cf.name)
                print("    ", cf.value)
            print()
        print("#" * 30)
        if self.delete_data:
            self.project.delete()

    def create_project(self):
        # Reporting organisation is not yet set, to prevent the default custom
        # field creation. But, may be we should make use of that?
        title = self._get("7. ")[:200]
        summary = self._get("8. ")
        project = Project.objects.create(
            title=title, project_plan_summary=summary, is_public=False
        )
        # Create a UNEP partnership, so the project shows in their partner site
        Partnership.objects.create(
            project=project,
            organisation=self.organisation,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
        )
        project.publish()
        return project

    def import_contact(self):
        field_mapping = {
            "4. ": "person_name",
            "4.a. ": "job_title",
            # FIXME: Should this be email?
            "4.b. ": "email",
            "5. ": "organisation",
        }

        contact_data = {
            attribute: self._get(survey_field)
            for survey_field, attribute in field_mapping.items()
        }
        ProjectContact.objects.create(project=self.project, **contact_data)

    def import_action_count(self):
        self._create_custom_text_field("6. ")
        self._create_custom_text_field("6.a. ")

    def import_type_of_action(self):
        legislations_standards_rules = "LEGISLATION, STANDARDS, RULES: e.g. agreeing new or changing rules or standards that others should comply with, new regulation, agreements, policy, economic instrument etc."
        working_with_people = "WORKING WITH PEOPLE: Encouraging or enabling others (e.g., training, communication, awareness raising, behaviour change programmes)"
        technology_and_processes = "TECHNOLOGY and PROCESSES: (e.g. new technical developments, research and development, new product design, new materials, processes etc.) Changes in practice, operations, environmental management"
        monitoring_and_analysis = "MONITORING and ANALYSIS: Collecting evidence around plastic discharge to the ocean/waterways? (e.g. monitoring, analysis)"
        awareness_raising = "Awareness raising and Behaviour change"
        research_and_development = "Research and Development"
        education = "Education"
        curriculum_development = "Curriculum development"
        ocean_surface = "Monitoring: On or near ocean surface"
        water_column = "Monitoring: Water column"
        sea_floor = "Monitoring: On the seafloor"
        shoreline = "Monitoring:  One the shoreline"
        biota = "Monitoring: In Biota"
        air = "Monitoring: Air"
        other = "Other"
        sub_fields = {
            legislations_standards_rules: ("9.a. ", "9.a.i. "),
            working_with_people: (
                "9.b. ",
                "9.b.i. ",
                {
                    awareness_raising: ("9.b.ii. ", ""),
                    education: (
                        "9.b.iii. ",
                        "",
                        {curriculum_development: ("9.b.iii.a. ", "")},
                    ),
                },
            ),
            technology_and_processes: (
                "9.c. ",
                # FIXME: Should the other field be here? or under R&D below?
                "",
                {research_and_development: ("9.c.i. ", "9.c.ii. ")},
            ),
            monitoring_and_analysis: (
                "9.d. ",
                {
                    "extra_text": True,
                    other: "9.d.i. ",
                    ocean_surface: "9.d.ii. ",
                    water_column: "9.d.iii. ",
                    sea_floor: "9.d.iv. ",
                    shoreline: "9.d.v. ",
                    biota: "9.d.vi. ",
                    air: "9.d.vii. ",
                },
            ),
        }
        fields = ("9. ", sub_fields)
        dropdown_options = {
            "multiselect": True,
            "options": [
                {
                    "name": legislations_standards_rules,
                    "options": [
                        {"name": "Making new/revised agreements"},
                        {"name": "Policy change or development/strategy"},
                        {"name": "New/change to legislation or regulations"},
                        {"name": "Institutional development"},
                        {"name": "Voluntary commitments"},
                        {"name": "Developing new standards/guidelines"},
                        {"name": "Economic instrument : Taxes/Subsidies"},
                        {
                            "name": "Economic Instrument: Incentives (e.g. deposit reward schemes)"
                        },
                        {"name": "Other", "allow_extra_text": True},
                    ],
                },
                {
                    "name": working_with_people,
                    "options": [
                        {
                            "name": awareness_raising,
                            "options": [
                                {"name": "Information campaign (s)"},
                                {
                                    "name": "Behaviour change campaign/programmes"
                                },
                                {"name": "Community Engagement"},
                                {"name": "Stakeholder Engagement"},
                                {"name": "Citizen Science (LEVEL 2)"},
                            ],
                        },
                        {
                            "name": education,
                            "options": [
                                {
                                    "name": curriculum_development,
                                    "options": [
                                        {"name": "Primary school"},
                                        {"name": "Secondary school"},
                                        {
                                            "name": "Tertiary higher education e.g. university (LEVEL 3)"
                                        },
                                    ],
                                }
                            ],
                        },
                        {"name": "Skills and Life-long learning"},
                        {"name": "Other training programmes"},
                        {"name": "Workshops"},
                        {"name": "Conferences"},
                        {"name": "Other", "allow_extra_text": True},
                    ],
                },
                {
                    "name": technology_and_processes,
                    "options": [
                        {"name": "Product design"},
                        {"name": "Service provision"},
                        {"name": "Environmental social planning"},
                        {"name": "Change in practice"},
                        {"name": "Change in operations"},
                        {
                            "name": "Environmental Management of Land based environments"
                        },
                        {
                            "name": "Environmental Management of Aquatic environments"
                        },
                        {
                            "name": research_and_development,
                            "options": [
                                {"name": "Environment"},
                                {"name": "Developing a new material"},
                                {"name": "Developing a new process"},
                                {"name": "Manufacturing and Production"},
                                {"name": "Standards"},
                                {"name": "Waste Management"},
                                {"name": "Other", "allow_extra_text": True},
                            ],
                        },
                    ],
                },
                {
                    "name": monitoring_and_analysis,
                    "options": [
                        {"name": ocean_surface, "allow_extra_text": True},
                        {"name": water_column, "allow_extra_text": True},
                        {"name": sea_floor, "allow_extra_text": True},
                        {"name": shoreline, "allow_extra_text": True},
                        {"name": biota, "allow_extra_text": True},
                        {"name": air, "allow_extra_text": True},
                        {"name": other, "allow_extra_text": True},
                    ],
                },
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

        # Is this a monitoring programme?
        # FIXME: Yes/No questions should be booleans?
        survey_fields = (
            "9.d.viii. ",
            "9.d.viii.a. ",
            "9.d.ix. ",
            "9.d.ix.a. ",
        )
        for survey_field in survey_fields:
            self._create_custom_text_field(survey_field)

    def import_organisation_role(self):
        # FIXME: Should this be a proper partnership in RSR?
        fields = ("10. ", "10.a. ")
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": "Aware of it (i.e. only reporting it here)"},
                {"name": "I/we developed it;"},
                {"name": "I/we are implementing it;"},
                {"name": "We are the funding body"},
                {"name": "Other", "allow_extra_text": True},
            ],
        }

        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_implementor(self):
        public_administration = "PUBLIC ADMINISTRATION (organisations concerned with government policies and programmes)"
        private_sector = "PRIVATE SECTOR ORGANISATION (for-profit organisations run by individuals and groups, free from government ownership)."
        third_sector = "THIRD SECTOR (e.g. non-governmental and non-profit-making organisations, including charity groups, community groups etc)."
        sub_fields = {
            public_administration: ("12.b. ", "12.b.i. "),
            private_sector: ("12.c. ", "12.c.i. "),
            third_sector: ("12.d. ", "12.d.i. "),
        }
        fields = ("12. ", sub_fields)
        dropdown_options = {
            "multiselect": True,
            "options": [
                {
                    "name": public_administration,
                    "options": [
                        {"name": "International body"},
                        {"name": "National ministry/agency"},
                        {"name": "Sub-national ministry/agency"},
                        {"name": "Other", "allow_extra_text": True},
                    ],
                },
                {
                    "name": private_sector,
                    "options": [
                        {"name": "Multinational Corporation"},
                        {"name": "National Corporation"},
                        {"name": "Small-medium sized enterprise"},
                        {"name": "Other", "allow_extra_text": True},
                    ],
                },
                {
                    "name": third_sector,
                    "options": [
                        {"name": "Non-governmental organisation"},
                        {"name": "Community based organisation"},
                        {"name": "Educational sector"},
                        {"name": "Other", "allow_extra_text": True},
                    ],
                },
                # FIXME: The extra text is not parsed correctly!
                {"name": "Other", "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_reporting(self):
        survey_field = ("13. ", "")
        dropdown_options = {
            "multiselect": False,
            "options": [
                {"name": "Yes"},
                {"name": "No"},
            ],
        }
        self._create_custom_dropdown_field(survey_field, dropdown_options)

        # Yes, reporting
        fields = ("13.a. ", "13.a.i. ")
        dropdown_options = {
            "multiselect": False,
            "options": [
                {"name": "There is a mandatory reporting mechanism"},
                {"name": "Reporting is voluntary"},
                {"name": "Other", "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

        # Yes, reporting
        fields = ("13.b. ", "13.b.i. ")
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": "There is no reporting mechanism"},
                {"name": "Reporting is voluntary"},
                {"name": "There is not enough resource to support reporting"},
                {"name": "Reporting is too effortful"},
                {"name": "Other", "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_impact_evaluation(self):
        fields = ("14. ", "14.a. ")
        dropdown_options = {
            "multiselect": False,
            "options": [
                {"name": "Yes"},
                {"name": "No"},
                {"name": "Other", "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_geographical_focus(self):
        fields = ("15. ", "15.a. ")
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": "Global (it covers the whole world)"},
                {"name": "Regional (UN Regions)"},
                {"name": "Transnational (several countries are involved, including bilateral)"},
                {"name": "National (it covers one entire country)"},
                {"name": "Sub-national (it covers parts of one country)"},
                {"name": "Other", "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

        # FIXME: Import member states where the action takes place! 16, 16.a

    def import_target_place(self):
        fields = ("17. ", "17.a. ")
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": "Open ocean and high seas"},
                {"name": "Entire water catchment"},
                {"name": "Mountains and upland area"},
                {"name": "Urban environment"},
                {"name": "Agricultural land/soils"},
                {"name": "Freshwater rivers and lakes"},
                {"name": "Coastal zone"},
                {"name": "Forests or Mangroves"},
                {"name": "Maritime area within national jurisdiction"},
                {"name": "Areas beyond national jurisdiction"},
                {"name": "Waste disposal sites"},
                {"name": "Other", "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_target_lifecycle(self):
        fields = ("18. ", "18.a. ")
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": "Design"},
                {"name": "Production / Manufacture"},
                {"name": "Raw materials"},
                {"name": "Use / consumption"},
                {"name": "Collection / sorting of plastics after use"},
                {"name": "Management of collected plastics"},
                {"name": "Clean-up of plastic from the environment"},
                {"name": "Other", "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_target_reduce_reuse_recycle(self):
        fields = ("19. ", "19.a. ")
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": "Reducing plastics"},
                {"name": "Reusing plastic"},
                {"name": "Recycling plastics"},
                {"name": "Encouraging the use of compostable plastic"},
                {"name": "Encouraging the use of bio-based plastic"},
                {"name": "Encouraging the use of biodegradable plastic"},
                {"name": "Other", "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_impact(self):
        fields = "20. ", "20.a. "
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": "Human health and wellbeing"},
                {"name": "Biodiversity"},
                {"name": "Marine organisms"},
                {"name": "Ecosystem Services"},
                {"name": "Economics and Trade"},
                {"name": "Food chain"},
                {"name": "Other", "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_target_pollutant(self):
        survey_field = "21. "
        macroplastic = "Macroplastic (large, more than 20 mm, e.g. plastic bottles)"
        microplastic = "Microplastics (tiny plastic particles less than 5 mm in diameter, e.g., found in personal care products/synthetic textiles)"
        additives = "Additives incorporated into plastic items"
        sub_fields = {
            macroplastic: ("21.b. ", "21.b.i. "),
            microplastic: ("21.c. ", "21.c.i. "),
        }
        fields = (survey_field, sub_fields)
        dropdown_options = {
            "multiselect": True,
            "options": [
                {
                    "name": macroplastic,
                    "options": [
                        {"name": "Bottles"},
                        {"name": "Food packaging (containers, wrappers etc.)"},
                        {"name": "Cups (e.g., disposable coffee cups)"},
                        {"name": "Non-food packaging (containers, wrappers etc.)"},
                        {"name": "Smoking related litter (cigarette butts and packets)"},
                        {"name": "Plastic straws, stirrers, cutlery"},
                        {"name": "Plastic bags"},
                        {"name": "Polystyrene items"},
                        {"name": "Fishing related items"},
                        {"name": "Shipping related items"},
                        {"name": "Sewage-related items (this could include cotton bud sticks, feminine hygiene items and others disposed of via toilets)"},
                        {"name": "Natural disaster/hazard related debris"},
                        {"name": "Other", "allow_extra_text": True},
                    ],
                },
                {
                    "name": microplastic,
                    "options": [
                        {"name": "Microbeads used in cosmetics"},
                        {"name": "Microplastics used in other products e.g. paints"},
                        {"name": "Other", "allow_extra_text": True},
                    ],
                },
                {"name": additives, "options": []},
                {"name": "Other", "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_target_sector(self):
        # FIXME: Should this be an actual sector in RSR? Helps with search, but
        # currently RSR search only uses 1 IATI vocabulary.
        fields = ("22. ", "22.a. ")
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": "Packaging"},
                {"name": "Textiles"},
                {"name": "Consumer & Institutional products"},
                {"name": "Transportation"},
                {"name": "Electrical/electronics"},
                {"name": "Building, Construction, Demolition"},
                {"name": "Industrial Machinery"},
                {"name": "Automotive"},
                {"name": "Electrical and Electronics"},
                {"name": "Agriculture"},
                {"name": "Fisheries"},
                {"name": "Aquaculture"},
                {"name": "Food & Beverages"},
                {"name": "Personal Healthcare"},
                {"name": "Medical"},
                {"name": "Tourism"},
                {"name": "Wastewater/Sewage management"},
                {"name": "Hazard debris"},
                {"name": "Retail"},  # FIXME: Not present in the word document
                {"name": "Other", "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_funding(self):
        # Funding source
        survey_fields = ("23. ", "24. ", "25. ", "26. ")
        for survey_field in survey_fields:
            self._create_custom_text_field(survey_field)

        # Funding source dropdown
        fields = ("27. ", "27.a. ")
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": "Crowdfunded"},
                {"name": "Voluntary donations"},
                {"name": "Public Financing"},
                {"name": "Private Sector"},
                {"name": "In kind"},
                {"name": "Mixed"},
                {"name": "Other", "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)
        # Name of funding source
        self._create_custom_text_field("27.b. ")

    def import_duration(self):
        fields = ("28. ", "28.a. ")
        dropdown_options = {
            "multiselect": False,
            "options": [
                {"name": "Single event"},
                {"name": "Continuous activity less than one year"},
                {"name": "Continuous activity 1-3 Years"},
                {"name": "Continuous activity more than 3 Years long"},
                {"name": "Other", "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_links(self):
        fields = ("29. ", "29.a. ", "29.b. ", "29.c. ", "29.d. ", "29.e. ")
        for field in fields:
            link = self._get(field)
            if not link:
                continue
            try:
                link = Link.objects.create(project=self.project, url=link)
            except DataError:
                print('Could not save link: {}'.format(link))

    def import_additional_comment(self):
        self._create_custom_text_field("30. ")

    def _create_custom_field(self, name, defaults, value, selection):
        custom_field, _ = OrganisationCustomField.objects.get_or_create(
            organisation=self.organisation, name=name, defaults=defaults
        )
        project_custom_field = custom_field.new_project_custom_field(
            self.project.pk
        )
        project_custom_field.dropdown_selection = selection
        project_custom_field.value = value
        project_custom_field.save()
        return project_custom_field

    def _create_custom_dropdown_field(self, fields, dropdown_options):
        survey_field, _ = fields
        key = self._search_key(survey_field)
        n = len(survey_field)
        name = key[n:]
        defaults = {
            "section": 1,
            "order": 1,
            "type": "dropdown",
            "show_in_searchbar": True,
            "dropdown_options": copy.deepcopy(dropdown_options),
        }
        selection = self._get_selection(fields, dropdown_options)
        self._create_custom_field(name, defaults, "", selection)

    def _create_custom_text_field(self, survey_field):
        key = self._search_key(survey_field)
        n = len(survey_field)
        name = key[n:]
        value = self._get(key)
        defaults = {"section": 1, "order": 1, "type": "text"}
        self._create_custom_field(name, defaults, value, None)

    def _get(self, key_substring):
        key = self._search_key(key_substring)
        return self.responses[key]

    def _get_selection(self, fields, dropdown_options):
        survey_field, extra_field = fields
        value = self._get(survey_field)
        if not value:
            return None

        if not dropdown_options["multiselect"]:
            selection = [
                option
                for option in dropdown_options["options"]
                if option["name"] == value
            ]
        else:
            # Handle comma in options
            sub_values = [
                v.replace("%%%", ", ")
                for v in value.replace(", ", "%%%").split(",")
            ]

            if "All of the above" in sub_values:
                selection = [
                    option
                    for option in dropdown_options["options"]
                    if not option["name"] == "Other"
                ]
            elif {"not applicable"}.issubset({v.lower().strip() for v in sub_values}):
                selection = []

            else:
                selection = [
                    option
                    for option in dropdown_options["options"]
                    for sub_value in sub_values
                    if option["name"] == sub_value
                ]
                assert len(selection) == len(
                    sub_values
                ), "Some selections missing for {}: {} :: {}".format(
                    value, sub_values, selection
                )

        if isinstance(extra_field, dict) and not extra_field.get("extra_text"):
            self._get_sub_selection(selection, dropdown_options, extra_field)

        else:
            for each in selection:
                allow_extra_text = each.pop("allow_extra_text", False)
                if allow_extra_text:
                    assert (
                        extra_field
                    ), "Field not specified for getting extra text"
                    if not isinstance(extra_field, dict):
                        each["extra_text"] = self._get(extra_field)
                    else:
                        column = extra_field[each["name"]]
                        key = self._search_key(column)
                        n = len(column)
                        question = key[n:]
                        text = self._get(column)
                        each["extra_text"] = text
                        each["extra_question"] = question

        return selection

    def _get_sub_selection(self, selection, dropdown_options, extra_field):
        for each in selection:
            sub_dropdown_options = dict(each)
            sub_dropdown_options["multiselect"] = dropdown_options[
                "multiselect"
            ]
            name = sub_dropdown_options.pop("name")
            sub_fields = extra_field.get(name)
            if sub_fields is None:
                continue
            fields_ = sub_fields[:2]
            sub_selection = self._get_selection(fields_, sub_dropdown_options)
            each["options"] = sub_selection
            if len(sub_fields) > 2:
                self._get_sub_selection(
                    sub_selection, sub_dropdown_options, sub_fields[2]
                )

    def _search_key(self, key_substring):
        for key in self.responses:
            if key.startswith(key_substring):
                return key
