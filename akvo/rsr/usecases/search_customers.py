from dataclasses import dataclass
from datetime import datetime, time
from typing import Iterable, List, Optional, Set
from dateutil.relativedelta import relativedelta

from django.contrib.admin.models import LogEntry
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q, IntegerField, QuerySet
from django.db.models.functions import Cast
from django.utils import timezone

from akvo.rsr.models.login_log import LoginLog
from akvo.rsr.models import Project, Organisation, User
from akvo.utils.datetime import make_tz_aware

DEFAULT_ACTIVITY_MONTHS = 12


@dataclass(frozen=True)
class ProjectMainOrganisationAdmins:
    project: Project
    admins: QuerySet[User]


@dataclass(frozen=True)
class OrganisationAdmins:
    organisation: Organisation
    admins: QuerySet[User]


def get_organisation_admins_of_active_top_level_projects(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> List[ProjectMainOrganisationAdmins]:
    '''
    Find top level projects (projects that have no parent project) active in the last 12 months
    Find the main org for each of these projects
    Find the main user for each of these organizations
    '''
    end_date = make_tz_aware(datetime.combine(end_date if end_date else timezone.now(), time.max))
    start_date = make_tz_aware(datetime.combine(start_date if start_date else end_date - relativedelta(months=DEFAULT_ACTIVITY_MONTHS), time.min))

    active_projects = get_active_projects(start_date, end_date).select_related('primary_organisation')
    top_level_projects = get_top_level_projects(active_projects)
    return get_projects_main_organisation_admins(top_level_projects)


def get_organisation_admins_of_active_users(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> List[ProjectMainOrganisationAdmins]:
    '''
    Find the users that have been active in the last 12 months
    Find the projects these users have been contributing to (mostly for enumerator type actions or M&E Manager type actions)
    Find the top project for these projects
    Find the main org for each of these projects
    Find the main user for each of these organizations
    '''
    end_date = make_tz_aware(datetime.combine(end_date if end_date else timezone.now(), time.max))
    start_date = make_tz_aware(datetime.combine(start_date if start_date else end_date - relativedelta(months=DEFAULT_ACTIVITY_MONTHS), time.min))

    active_users = get_login_users(start_date, end_date)
    contributed_projects = get_projects_contributed_by_users(active_users, start_date, end_date)
    top_level_projects = get_top_level_projects(contributed_projects)
    return get_projects_main_organisation_admins(top_level_projects)


def get_paying_organisations_admins() -> List[OrganisationAdmins]:
    '''
    Find organizations that can create projects
    Find the main user for each of these organizations
    '''
    paying_organisations = Organisation.objects.filter(can_create_projects=True).exclude(name__icontains='akvo')
    result = []
    for org in paying_organisations:
        admins = get_organisation_admins(org)
        result.append(OrganisationAdmins(organisation=org, admins=admins))
    return result


def get_active_projects(date_start: datetime, date_end: datetime) -> QuerySet[Project]:
    projects_with_project_updates = Project.objects.filter(
        Q(project_updates__created_at__range=(date_start, date_end))
        | Q(project_updates__last_modified_at__range=(date_start, date_end))
    ).distinct()
    projects_with_indicator_updates = Project.objects.filter(
        Q(results__indicators__periods__data__created_at__range=(date_start, date_end))
        | Q(results__indicators__periods__data__last_modified_at__range=(date_start, date_end))
    ).distinct()
    project_ids = projects_with_project_updates.union(
        projects_with_indicator_updates
    ).values_list('id', flat=True)
    project_ids_with_log_entries = LogEntry.objects.filter(
        content_type=ContentType.objects.get_for_model(Project),
        action_time__range=(date_start, date_end)
    ).annotate(obj_pk=Cast('object_id', IntegerField())).values_list('obj_pk', flat=True).distinct()
    return Project.objects.filter(id__in=set(project_ids) | set(project_ids_with_log_entries))


def get_top_level_projects(projects: Iterable[Project]) -> List[Project]:
    top_levels = []
    for p in projects:
        root = p.get_root()
        if root in top_levels:
            continue
        top_levels.append(root)
    return top_levels


def get_projects_main_organisation_admins(projects: Iterable[Project]) -> List[ProjectMainOrganisationAdmins]:
    result = []
    for project in projects:
        primary_org = project.primary_organisation
        if not primary_org:
            continue
        admins = get_organisation_admins(primary_org)
        result.append(ProjectMainOrganisationAdmins(project=project, admins=admins))
    return result


def get_organisation_admins(org: Organisation) -> QuerySet[User]:
    return User.objects.filter(employers__organisation=org, employers__group__name='Admins', employers__is_approved=True)


def get_login_users(date_start: datetime, date_end: datetime) -> QuerySet[User]:
    login_emails = get_unique_login_emails(date_start, date_end)
    return User.objects.filter(email__in=login_emails)


def get_unique_login_emails(date_start, date_end) -> Set[str]:
    return set(LoginLog.objects.filter(success=True, created_at__range=(date_start, date_end)).values_list('email', flat=True).distinct())


def get_projects_contributed_by_users(users: QuerySet[User], date_start: datetime, date_end: datetime) -> QuerySet[Project]:
    project_ids = LogEntry.objects.filter(
        content_type=ContentType.objects.get_for_model(Project),
        action_time__range=(date_start, date_end),
        user__in=users
    ).annotate(obj_pk=Cast('object_id', IntegerField())).values_list('obj_pk', flat=True).distinct()
    return Project.objects.filter(id__in=project_ids)
