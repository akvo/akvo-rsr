# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import copy
import csv
import re
from urllib.parse import urlparse

from django.core.management.base import BaseCommand
from django.db.utils import DataError
from django.utils.text import slugify
from django.utils.translation import ugettext as _

from akvo.rest.cache import delete_project_from_project_directory_cache
from akvo.rsr.iso3166 import ISO_3166_COUNTRIES
from akvo.rsr.models import (
    Keyword,
    Link,
    Organisation,
    OrganisationCustomField,
    PartnerSite,
    Project,
    ProjectCustomField,
    ProjectDocument,
    ProjectLocation,
)
from akvo.utils import custom_get_or_create_country

COUNTRY_NAME_TO_ISO_MAP = {name: code for code, name in ISO_3166_COUNTRIES}
UNEP_NAME_TO_ISO_CODE = {
    _("Bolivia"): "bo",
    _("Cabo Verde"): "cv",
    _("Central Africa Republic"): "cf",
    _("Cost Rica"): "cr",
    _("Cote D'Ivoire"): "ci",
    _("Democratic People's Republic of Korea"): "kp",
    _("Democratic Republic of Congo"): "cd",
    _("Dominca"): "dm",
    _("Eswatini"): "sz",
    _("Gambia (Republic of The)"): "gm",
    _("Guinea Bissau"): "gw",
    _("Iran (Islamic Republic of)"): "ir",
    _("Libya"): "ly",
    _("Mazambique"): "mz",
    _("Micronesia (Federated States of)"): "fm",
    _("Naura"): "nr",
    _("North Macedonia"): "mk",
    _("Republic of Korea"): "kr",
    _("Republic of Moldova"): "md",
    _("Sri lanka"): "lk",
    _("Tajikstan"): "tj",
    _("Timor-Leste"): "tl",
    _("United Kingdom of Great Britain and Northern Ireland"): "gb",
    _("United Republic of Tanzania"): "tz",
    _("United States of America"): "us",
    _("Viet Nam"): "vn",
}
FILTER_SHORT_NAMES = {
    "9": _("Type of action"),
    "11": _("Role organisation"),
    "12": _("Responsible actor"),
    "13": _("Reporting"),
    "15": _("Geography"),
    "17": _("Source to sea"),
    "18": _("Lifecycle of plastics"),
    "19": _("Target action"),
    "20": _("Impact"),
    "21": _("Pollutant targeted"),
    "22": _("Sector"),
    "27": _("Funding"),
    "28": _("Duration"),
}
HIDE_IN_SEARCHBAR = {"5", "6", "9.d.viii", "10", "13.a", "13.b", "14"}


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
        parser.add_argument(
            "--debug",
            action="store_true",
            default=False,
            help="Flag to print more debug information",
        )

    def handle(self, *args, **options):
        csv_file = options["UNEP_CSV"]
        delete_data = options["delete_data"]
        debug = options["debug"]
        data = csv.reader(csv_file, delimiter=',')
        headers = next(data)

        # Ignore lines until the specified start
        start = options["start_line"]
        for i in range(1, start):
            next(data)

        unep = self.setup_unep()
        unep_keyword = self.setup_unep_keyword()
        self.setup_partnersite(unep, unep_keyword)
        for i, csv_line in enumerate(data, start=1):
            if debug:
                print(f'Processing row: {i}')
            importer = CSVToProject(
                unep, unep_keyword, headers, csv_line, delete_data=delete_data
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

    def setup_unep_keyword(self):
        keyword, _ = Keyword.objects.get_or_create(label="UNEP Marine Litter Stocktake")
        return keyword

    def setup_partnersite(self, organisation, keyword):
        data = {
            "hostname": "unep",
            "password": "UNEP Demo",
            "tagline": "UNEP Demo",
            "partner_projects": False,
        }
        partnersite, _ = PartnerSite.objects.get_or_create(
            organisation=organisation, defaults=data
        )
        if keyword.pk not in set(partnersite.keywords.values_list('pk', flat=True)):
            partnersite.keywords.add(keyword)

        return partnersite


class CSVToProject(object):
    def __init__(self, organisation, keyword, headers, data, delete_data=False):
        self.organisation = organisation
        self.keyword = keyword
        self.headers = headers
        self.data = data
        self.responses = dict(zip(headers, data))
        self.delete_data = delete_data
        self.is_narrative_submission = False

    def run(self):
        if self.data[3].strip().lower().startswith("no"):
            print("Ignoring survey since answers are not to best of particpants' knowledge")
            return

        self.project = self.get_or_create_project()
        if not self.is_narrative_submission:
            self.import_survey_reporter()
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
        else:
            self.import_survey_reporter()
            self.import_countries()
            self.import_links()

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
        delete_project_from_project_directory_cache(self.project.pk)
        if self.delete_data:
            self.project.delete()

    def fake_unique_response_number(self, title):
        return slugify(title)

    def get_or_create_project(self):
        urn_field = "Unique Response Number"
        unique_response_number = self._get(urn_field)
        title = self._get("7. ")[:200]
        if not unique_response_number:
            unique_response_number = self.fake_unique_response_number(title)
            self.is_narrative_submission = True
        summary = self._get("8. ")
        custom_field = ProjectCustomField.objects.filter(name=urn_field, value=unique_response_number).first()
        if custom_field is not None:
            project = custom_field.project
            project.title = title
            project.project_plan_summary = summary
            project.save(update_fields=['title', 'project_plan_summary'])
            # Delete all existing custom fields, so they are created again.
            ProjectCustomField.objects.filter(project=project).exclude(id=custom_field.pk).delete()
            # Delete all existing locations
            ProjectLocation.objects.filter(location_target=project).delete()
        else:
            self.project = project = Project.objects.create(
                title=title, project_plan_summary=summary, is_public=True
            )
            defaults = {"section": 1, "order": 1, "type": "text"}
            self._create_custom_field(urn_field, defaults, unique_response_number, None)

        if self.keyword.pk not in project.keywords.all().values_list('pk', flat=True):
            project.keywords.add(self.keyword)

        project.publish()
        return project

    def import_survey_reporter(self):
        self._create_custom_text_field("4.d. ")
        fields = "5. ", "5.a. ", None
        dropdown_options = {
            "multiselect": False,
            "options": [
                {"name": _("On behalf of an organisation")},
                {"name": _("As an individual")},
                {"name": _("Other"), "allow_extra_text": True},
            ]
        }
        self._create_custom_dropdown_field(fields, dropdown_options)
        # FIXME: Could be a proper organisation if data is sanitized
        self._create_custom_text_field("5.b. ")

    def import_action_count(self):
        fields = "6. ", None, None
        dropdown_options = {
            "multiselect": False,
            "options": [
                {"name": _("Yes")},
                {"name": _("No, I am returning to the survey to report on additional actions/activities")},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)
        self._create_custom_text_field("6.a. ")

    def import_type_of_action(self):
        legislations_standards_rules = _("LEGISLATION, STANDARDS, RULES: e.g. agreeing new or changing rules or standards that others should comply with, new regulation, agreements, policies, economic instruments etc. including voluntary commitments.")
        working_with_people = _("WORKING WITH PEOPLE: Encouraging or enabling others (e.g., education, training, communication, awareness raising, behaviour change programmes")
        technology_and_processes = _("TECHNOLOGY and PROCESSES: New technical developments/innovation (e.g., research and development, new product design, new materials, processes etc.) changes in practice, operations, environmental management and planning.")
        monitoring_and_analysis = _("MONITORING and ANALYSIS: Collecting evidence around plastic discharge to the ocean/waterways? (e.g. monitoring, analysis)")
        awareness_raising = _("Awareness raising and Behaviour change")
        research_and_development = _("Research and Development")
        education = _("Education/Training")
        curriculum_development = _("Curriculum development")
        other = _("Other")
        sub_fields = {
            legislations_standards_rules: ("9.a. ", "9.a.i. ", None),
            working_with_people: (
                "9.b. ",
                "9.b.i. ",
                {
                    awareness_raising: ("9.b.ii. ", "9.b.ii.a. ", None),
                    education: (
                        "9.b.iii. ",
                        "9.b.iii.a. ",
                        {curriculum_development: ("9.b.iii.b. ", "9.b.iii.b.i. ", None)},
                    ),
                },
            ),
            technology_and_processes: (
                "9.c. ",
                "9.c.i. ",
                {research_and_development: ("9.c.ii. ", "9.c.ii.a. ", None)},
            ),
            monitoring_and_analysis: (
                "9.d. ",
                "9.d.i. ",
                None
            ),
        }
        fields = ("9. ", None, sub_fields)
        dropdown_options = {
            "multiselect": False,
            "options": [
                {
                    "name": legislations_standards_rules,
                    "multiselect": True,
                    "options": [
                        {"name": _("Official agreements")},
                        {"name": _("Policy change or development")},
                        {"name": _("High-level strategy")},
                        {"name": _("Legislation or regulations")},
                        {"name": _("Voluntary commitments")},
                        {"name": _("New standard(s) or guideline(s)")},
                        {"name": _("Change in Taxes/Subsidies")},
                        {"name": _("Subsidy/financial incentives")},
                        {"name": _("Ban(s)")},
                        {"name": _("Package of measures combining incentives and infrastructure (e.g. deposit reward schemes)")},
                        {"name": _("Other"), "allow_extra_text": True},
                    ],
                },
                {
                    "name": working_with_people,
                    "multiselect": True,
                    "options": [
                        {
                            "name": awareness_raising,
                            "multiselect": True,
                            "options": [
                                {"name": _("Information campaign")},
                                {"name": _("Behaviour change campaign/programme")},
                                {"name": _("Community Engagement")},
                                {"name": _("Stakeholder Engagement")},
                                {"name": _("Citizen Science")},
                                {"name": _("Creative/arts event; exhibition")},
                                {"name": _("Other"), "allow_extra_text": True},
                            ],
                        },
                        {
                            "name": education,
                            "multiselect": True,
                            "options": [
                                {
                                    "name": curriculum_development,
                                    "multiselect": True,
                                    "options": [
                                        {"name": _("Primary school")},
                                        {"name": _("Secondary school")},
                                        {"name": _("Tertiary higher education")},
                                        {"name": _("Other"), "allow_extra_text": True},
                                    ],
                                },
                                {"name": _("Professional skills training")},
                                {"name": _("Other training programmes")},
                                {"name": _("Life-long learning")},
                                {"name": _("Institutional development")},
                                {"name": _("Other"), "allow_extra_text": True},
                            ],
                        },
                        {"name": _("Workshops")},
                        {"name": _("Conferences")},
                        {"name": _("Other"), "allow_extra_text": True},
                    ],
                },
                {
                    "name": technology_and_processes,
                    "multiselect": True,
                    "options": [
                        {"name": _("New product design")},
                        {"name": _("Change in service provision")},
                        {"name": _("Environmental social planning")},
                        {"name": _("Change in practice")},
                        {"name": _("Change in operations")},
                        {"name": _("Industrial or production standard")},
                        {"name": _("Different environmental management of land based environments")},
                        {"name": _("Different environmental management of aquatic environments")},
                        {
                            "name": research_and_development,
                            "options": [
                                {"name": _("Reducing the environmental impact")},
                                {"name": _("Developing a new material")},
                                {"name": _("Developing a new process")},
                                {"name": _("Manufacturing and Production")},
                                {"name": _("Standards")},
                                {"name": _("Waste Management")},
                                {"name": _("Compostable plastic")},
                                {"name": _("Bio-based plastic")},
                                {"name": _("Bio-degradable plastic")},
                                {"name": _("Other"), "allow_extra_text": True},
                            ],
                        },
                        {"name": _("New infrastructure")},
                        {"name": _("The use of compostable plastic")},
                        {"name": _("The use of bio-based plastic")},
                        {"name": _("The use of biodegradable plastic")},
                        {"name": _("Other"), "allow_extra_text": True},
                    ],
                },
                {
                    "name": monitoring_and_analysis,
                    "multiselect": True,
                    "options": [
                        {"name": _("Monitoring: On or near ocean surface")},
                        {"name": _("Monitoring: Water column")},
                        {"name": _("Monitoring: On the seafloor")},
                        {"name": _("Monitoring: On the shoreline")},
                        {"name": _("Monitoring: In Biota")},
                        {"name": _("Monitoring: Air")},
                        {"name": _("Review and synthesis :Environmental")},
                        {"name": _("Review and synthesis: Economic")},
                        {"name": _("Review and synthesis: Materials")},
                        {"name": other, "allow_extra_text": True},
                    ],
                },
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options, required=True)
        survey_fields = (
            "9.d.ii. ",
            "9.d.iii. ",
            "9.d.iv. ",
            "9.d.v. ",
            "9.d.vi. ",
            "9.d.vii. ",
        )
        for survey_field in survey_fields:
            self._create_custom_text_field(survey_field)

        # Data access
        fields = "9.d.viii. ", None, None
        dropdown_options = {
            "multiselect": False,
            "options": [
                {"name": _("It is freely available and open source")},
                {"name": _("It is available on request")},
                {"name": _("It is not available")},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)
        survey_fields = (
            "9.d.viii.a. ",
            "9.d.viii.b. ",
        )
        for survey_field in survey_fields:
            self._create_custom_text_field(survey_field)

        # FIXME: Make these options the same as #9
        legislations_standards_rules2 = _('LEGISLATION, STANDARDS, RULES: e.g. agreeing new or changing rules or standards that others should comply with, new regulation, agreements, policies, economic instruments etc. including voluntary commitments')
        technology_and_processes2 = _('TECHNOLOGY and PROCESSES: New technical developments/innovation (e.g., research and development, new product design, new materials, processes etc.), changes in practice, operations, environmental management and planning')
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": legislations_standards_rules2},
                {"name": working_with_people + ")"},
                {"name": technology_and_processes2},
                {"name": monitoring_and_analysis},
            ],
        }
        fields = "10. ", None, None
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_organisation_role(self):
        fields = ("11. ", "11.a. ", None)
        dropdown_options = {
            "multiselect": False,
            "options": [
                {"name": _("We are only reporting it here")},
                {"name": _("I/We developed it")},
                {"name": _("I/We are implementing it")},
                {"name": _("We are the funding body")},
                {"name": _("Other"), "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_implementor(self):
        public_administration = _("PUBLIC ADMINISTRATION (organisations concerned with government policies and programmes)")
        private_sector = _("PRIVATE SECTOR ORGANISATION (for-profit organisations run by individuals and groups, free from government ownership).")
        third_sector = _("THIRD SECTOR (e.g. non-governmental and non-profit-making organisations, including charity groups, community groups etc).")
        sub_fields = {
            public_administration: ("12.b. ", "12.b.i. ", None),
            private_sector: ("12.c. ", "12.c.i. ", None),
            third_sector: ("12.d. ", "12.d.i. ", None),
        }
        fields = ("12. ", "12.a. ", sub_fields)
        dropdown_options = {
            "multiselect": True,
            "options": [
                {
                    "name": public_administration,
                    "multiselect": True,
                    "options": [
                        {"name": _("International body")},
                        {"name": _("National ministry/agency")},
                        {"name": _("Sub-national ministry/agency")},
                        {"name": _("Other"), "allow_extra_text": True},
                    ],
                },
                {
                    "name": private_sector,
                    "multiselect": True,
                    "options": [
                        {"name": _("Multinational Corporation")},
                        {"name": _("National Corporation")},
                        {"name": _("Small-medium sized enterprise")},
                        {"name": _("Other"), "allow_extra_text": True},
                    ],
                },
                {
                    "name": third_sector,
                    "options": [
                        {"name": _("Non-governmental organisation")},
                        {"name": _("Community based organisation")},
                        {"name": _("Educational sector")},
                        {"name": _("Other"), "allow_extra_text": True},
                    ],
                },
                {"name": _("Other"), "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options, required=True)

    def import_reporting(self):
        survey_field = ("13. ", None, None)
        dropdown_options = {
            "multiselect": False,
            "options": [
                {"name": _("Yes")},
                {"name": _("No")},
            ],
        }
        self._create_custom_dropdown_field(survey_field, dropdown_options)

        # Yes, reporting
        fields = ("13.a. ", "13.a.i. ", None)
        dropdown_options = {
            "multiselect": False,
            "options": [
                {"name": _("There is a mandatory reporting mechanism")},
                {"name": _("Reporting is voluntary")},
                {"name": _("Other"), "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

        # Yes, reporting
        fields = ("13.b. ", "13.b.i. ", None)
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": _("There is no reporting mechanism")},
                {"name": _("Reporting is voluntary")},
                {"name": _("There is not enough resource to support reporting")},
                {"name": _("Reporting is too effortful")},
                {"name": _("Other"), "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_impact_evaluation(self):
        fields = ("14. ", "14.a. ", None)
        dropdown_options = {
            "multiselect": False,
            "options": [
                {"name": _("Yes")},
                {"name": _("No")},
                {"name": _("Other"), "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_geographical_focus(self):
        fields = ("15. ", "15.a. ", None)
        dropdown_options = {
            "multiselect": False,
            "options": [
                {"name": _("Global (it covers the whole world)")},
                {"name": _("Regional (UN Regions)")},
                {"name": _("Transnational (several countries are involved, including bilateral)")},
                {"name": _("National (it covers one entire country)")},
                {"name": _("Sub-national (it covers parts of one country)")},
                {"name": _("Other"), "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)
        self.import_countries()

    def import_countries(self):
        # FIXME: Make sure the inconsistencies in the country names are resolved, with TC team
        field = "16. "
        countries = self._get(field)
        # FIXME: Not sure what to do with All and Other fields. The TC team is
        # also currently ignoring these fields, and not doing anything with
        # these values.
        # other_field = "16.a. "
        db_countries = []
        # Handle commas in the country names themselves
        countries = countries.replace(', ', '%%%')
        for name in countries.split(","):
            name = name.replace('%%%', ', ')
            if name in UNEP_NAME_TO_ISO_CODE:
                iso_code = UNEP_NAME_TO_ISO_CODE[name]
            elif name in COUNTRY_NAME_TO_ISO_MAP:
                iso_code = COUNTRY_NAME_TO_ISO_MAP[name]
            else:
                iso_code = None

            if iso_code is not None:
                country = custom_get_or_create_country(iso_code)
                db_countries.append(country)

        # Delete existing locations, before creating new ones
        ProjectLocation.objects.filter(location_target=self.project).delete()
        locations = [
            ProjectLocation(country=country, location_target=self.project)
            for country in db_countries
        ]
        ProjectLocation.objects.bulk_create(locations)

    def import_target_place(self):
        fields = ("17. ", "17.a. ", None)
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": _("Mountains and upland area")},
                {"name": _("Agricultural land/soils")},
                {"name": _("Entire water catchment")},
                {"name": _("Forests or Mangroves")},
                {"name": _("Freshwater rivers and lakes")},
                {"name": _("Urban environment")},
                {"name": _("Waste disposal sites")},
                {"name": _("Coastal zone")},
                {"name": _("Maritime area within national jurisdiction")},
                {"name": _("Areas beyond national jurisdiction")},
                {"name": _("Open ocean and high seas")},
                {"name": _("Air")},
                {"name": _("Other"), "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_target_lifecycle(self):
        fields = ("18. ", "18.a. ", None)
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": _("Raw materials")},
                {"name": _("Design")},
                {"name": _("Production / Manufacture")},
                {"name": _("Use / consumption")},
                {"name": _("Collection / sorting of plastics after use")},
                {"name": _("Management of collected plastics")},
                {"name": _("Clean-up of plastic from the environment")},
                {"name": _("Other"), "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_target_reduce_reuse_recycle(self):
        fields = ("19. ", "19.a. ", None)
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": _("Reducing plastics")},
                {"name": _("Reusing plastic")},
                {"name": _("Recycling plastics")},
                {"name": _("Other"), "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_impact(self):
        fields = ("20. ", "20.a. ", None)
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": _("Human health and wellbeing")},
                {"name": _("Biodiversity")},
                {"name": _("Marine organisms")},
                {"name": _("Ecosystem Services")},
                {"name": _("Food chain")},
                {"name": _("Economics and Trade")},
                {"name": _("Other"), "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_target_pollutant(self):
        survey_field = "21. "
        macroplastic = _("Macroplastic (large, more than 20 mm, e.g. plastic bottles)")
        microplastic = _("Microplastics (tiny plastic particles less than 5 mm in diameter, e.g., found in personal care products/synthetic textiles)")
        additives = _("Additives incorporated into plastic items")
        sub_fields = {
            macroplastic: ("21.b. ", "21.b.i. ", None),
            microplastic: ("21.c. ", "21.c.i. ", None),
        }
        fields = (survey_field, "21.a. ", sub_fields)
        dropdown_options = {
            "multiselect": True,
            "options": [
                {
                    "name": macroplastic,
                    "multiselect": True,
                    "options": [
                        {"name": _("Bottles")},
                        {"name": _("Plastic bags")},
                        {"name": _("Food packaging (containers, wrappers etc.)")},
                        {"name": _("Non-food packaging (containers, wrappers etc.)")},
                        {"name": _("Smoking related litter (cigarette butts and packets)")},
                        {"name": _("Fishing related items")},
                        {"name": _("Shipping related items")},
                        {"name": _("Cups (e.g., disposable coffee cups)")},
                        {"name": _("Plastic straws, stirrers, cutlery")},
                        {"name": _("Sewage-related items (this could include cotton bud sticks, feminine hygiene items and others disposed of via toilets)")},
                        {"name": _("Natural disaster/hazard related debris")},
                        {"name": _("Polystyrene items")},
                        {"name": _("Other"), "allow_extra_text": True},
                    ],
                },
                {
                    "name": microplastic,
                    "multiselect": True,
                    "options": [
                        {"name": _("Microbeads used in cosmetics")},
                        {"name": _("Microplastics used in other products e.g. paints")},
                        {"name": _("Other"), "allow_extra_text": True},
                    ],
                },
                {"name": additives, "options": []},
                {"name": _("Other"), "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_target_sector(self):
        fields = ("22. ", "22.a. ", None)
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": _("Packaging")},
                {"name": _("Textiles")},
                {"name": _("Transportation")},
                {"name": _("Building, Construction, Demolition")},
                {"name": _("Industrial Machinery")},
                {"name": _("Automotive")},
                {"name": _("Electrical and Electronics")},
                {"name": _("Agriculture")},
                {"name": _("Fisheries")},
                {"name": _("Aquaculture")},
                {"name": _("Food & Beverages")},
                {"name": _("Personal Healthcare")},
                {"name": _("Medical")},
                {"name": _("Retail")},
                {"name": _("Tourism")},
                {"name": _("Wastewater/Sewage management")},
                {"name": _("Other"), "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)

    def import_funding(self):
        # Funding source
        survey_fields = ("23. ", "24. ", "25. ", "26. ")
        for survey_field in survey_fields:
            self._create_custom_text_field(survey_field)

        # Funding source dropdown
        fields = ("27. ", "27.a. ", None)
        dropdown_options = {
            "multiselect": True,
            "options": [
                {"name": _("Crowdfunded")},
                {"name": _("Voluntary donations")},
                {"name": _("Public Financing")},
                {"name": _("Private Sector")},
                {"name": _("Mixed")},
                {"name": _("Other"), "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options)
        # Name of funding source
        self._create_custom_text_field("27.b. ")

    def import_duration(self):
        fields = ("28. ", "28.a. ", None)
        dropdown_options = {
            "multiselect": False,
            "options": [
                {"name": _("Single event")},
                {"name": _("Continuous activity less than one year")},
                {"name": _("Continuous activity 1-3 Years")},
                {"name": _("Continuous activity more than 3 Years long")},
                {"name": _("Not applicable")},
                {"name": _("Other"), "allow_extra_text": True},
            ],
        }
        self._create_custom_dropdown_field(fields, dropdown_options, required=True)

    def import_links(self):
        fields = ("29. ", "29.a. ", "29.b. ", "29.c. ", "29.d. ", "29.e. ")
        # Delete existing links on projects before creating new ones
        Link.objects.filter(project=self.project).delete()
        ProjectDocument.objects.filter(project=self.project).delete()
        for field in fields:
            link = self._get(field)
            if not link:
                continue
            try:
                parsed = urlparse(link)
                if parsed.path.endswith('.pdf'):
                    name = parsed.path.rsplit('/', 1)[-1].rsplit('.', 1)[0]
                    title = re.sub('[_-]+', ' ', name).split()
                    title = ' '.join((word.title() if word.islower() else word) for word in title)
                    ProjectDocument.objects.create(
                        project=self.project, url=link, format='application/pdf', title=title[:100])
                else:
                    Link.objects.create(project=self.project, url=link)
            except DataError:
                print('Could not save link: {}'.format(link))

    def _create_custom_field(self, name, defaults, value, selection):
        custom_field, _ = OrganisationCustomField.objects.update_or_create(
            organisation=self.organisation, name=name, defaults=defaults
        )
        try:
            project_custom_field = ProjectCustomField.objects.get(name=name, project=self.project)
        except ProjectCustomField.DoesNotExist:
            project_custom_field = custom_field.new_project_custom_field(
                self.project.pk
            )
        project_custom_field.dropdown_selection = selection
        project_custom_field.value = value
        project_custom_field.save()
        return project_custom_field

    def _create_custom_dropdown_field(self, fields, dropdown_options, required=False):
        survey_field, _, _ = fields
        name = self._get_custom_field_name(survey_field)
        question_number = self._get_question_number(survey_field)
        defaults = {
            "section": 1,
            "order": 1,
            "type": "dropdown",
            "show_in_searchbar": question_number not in HIDE_IN_SEARCHBAR,
            "dropdown_options": copy.deepcopy(dropdown_options),
        }
        selection = self._get_selection(fields, dropdown_options)
        if required:
            assert selection, f"Selection is empty for required question {survey_field}"
        self._create_custom_field(name, defaults, "", selection)

    def _create_custom_text_field(self, survey_field):
        name = self._get_custom_field_name(survey_field)
        value = self._get(survey_field)
        defaults = {"section": 1, "order": 1, "type": "text"}
        self._create_custom_field(name, defaults, value, None)

    def _get(self, key_substring):
        key = self._search_key(key_substring)
        return self.responses[key]

    def _get_custom_field_name(self, key_substring):
        question_number = self._get_question_number(key_substring)
        if question_number in FILTER_SHORT_NAMES:
            return FILTER_SHORT_NAMES[question_number]

        key = self._search_key(key_substring)
        n = len(key_substring)
        name = key[n:]
        return name

    def _get_question_number(self, key_substring):
        return key_substring.strip().strip('.')

    def _get_selection(self, fields, dropdown_options):
        survey_field, extra_field, sub_fields = fields
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

            if {"All", "All of the above"}.intersection(sub_values):
                selection = [
                    option
                    for option in dropdown_options["options"]
                    if not option["name"] == "Other"
                ]
            # FIXME: Should we make it an option instead? Does filtering work
            # correctly, if we ignore this?
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
                ), f"Some selections missing for {survey_field} with {value}: {sub_values} :: {selection}"

        for each in selection:
            allow_extra_text = each.pop("allow_extra_text", False)
            if allow_extra_text:
                assert (
                    extra_field
                ), "Field not specified for getting extra text"
                each["extra_text"] = self._get(extra_field)

        if isinstance(sub_fields, dict) and not sub_fields.get("extra_text"):
            self._get_sub_selection(selection, dropdown_options, sub_fields)

        return selection

    def _get_sub_selection(self, selection, dropdown_options, all_sub_fields):
        for each in selection:
            sub_dropdown_options = dict(each)
            sub_dropdown_options.setdefault("multiselect", dropdown_options["multiselect"])
            name = sub_dropdown_options.pop("name")
            sub_fields = all_sub_fields.get(name)
            if sub_fields is None:
                continue
            sub_selection = self._get_selection(sub_fields, sub_dropdown_options)
            each["options"] = sub_selection
            if sub_fields[2]:
                self._get_sub_selection(
                    sub_selection, sub_dropdown_options, sub_fields[2]
                )

    def _search_key(self, key_substring):
        for key in self.responses:
            if key.startswith(key_substring):
                return key
