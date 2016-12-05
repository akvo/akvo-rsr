# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import glob
import os

from datetime import timedelta, datetime
from importlib import import_module

from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _

from akvo.utils import who_am_i, who_is_parent
from .iati_import_job import IatiImportJob
from .iati_import_log import LOG_ENTRY_TYPE


def get_subpackages(module):
    dir = os.path.dirname(module.__file__)

    def is_package(d):
        d = os.path.join(dir, d)
        return os.path.isdir(d) and glob.glob(os.path.join(d, '__init__.py*'))

    return filter(is_package, os.listdir(dir))


def custom_mappers():
    "Create a list of available custom mapper, for use in the admin"
    from ...iati.imports import mappers
    subs = sorted(get_subpackages(mappers))
    return [(sub, sub) for sub in subs]

import logging
from inspect import currentframe, getframeinfo

logger = logging.getLogger(__name__)


def debug_enter(func_or_meth, parent, line_no):
    "Use at start of function/method to log that it is called and from where"
    logger.debug("L{} Calling {}() from {}()".format(line_no, func_or_meth, parent))


def debug_exit(func_or_meth, line_no):
    "Use at end of function/method"
    logger.debug("L{} Exiting {}()".format(line_no, func_or_meth))


def debug_message(msg, *args):
    "Use to log info"
    logger.debug(msg.format(*args))


class IatiImport(models.Model):
    """
    This model sets up the running of an import of an IATI XML file into RSR on a regular basis.
    Here we manage the URL from where the XML is fetched, as well as the User running the imports,
    the frequency the imports are run at and any special code needed to run the import.

    For each running of the import an IatiImportJob object is created and associated with the parent
    IatiImport object. Running the job in turn creates a number of IatiActivityImport objects as
    well as IatiImportLog objects, both types of objects recording the progress of the import.

    Notable methods
    ===============

    model_mappers()
    Here we assemble the mapper classes used to map the XML data to the various RSR
    models. model_mappers() checks IatiImport.mapper_prefix to determine if there are custom sub-
    classes of the base mapper classes to use in lieu of the parents, this way managing custom needs
    for the XML in question.

    set_next_execution()
    Sets the next time the import is to be run. This is done just as an import job is started, so
    the actual frequency is as close to the actual value of IatiImport.frequency as possible.

    check_execution()
    Checks if we should run an import job. This can be triggered by it either being a manually
    started job, typically run from the Django admin, or if it time for a scheduled import.

    execute_import()
    An actual import is managed by an IatiImportJob object which is either crated in execute_import
    or supplied to the method when calling it. execute_import() is also responsible for setting the
    next time a scheduled import is to occur
    """

    HOURLY = 1
    EVERY_SIX_HOURS = 2
    DAILY = 3
    EVERY_THREE_DAYS = 4
    WEEKLY = 5
    BI_WEEKLY = 6
    EVERY_FOUR_WEEKS = 7
    EVERY_TWO_MINUTES = 8 # used for testing
    FREQUENCIES = (
        (HOURLY, _('hourly'),),
        (EVERY_SIX_HOURS, _('every six hours'),),
        (DAILY, _('daily'),),
        (EVERY_THREE_DAYS, _('every three days'),),
        (WEEKLY, _('weekly'),),
        (BI_WEEKLY, _('bi-weekly'),),
        (EVERY_FOUR_WEEKS, _('every four weeks'),),
        (EVERY_TWO_MINUTES, _('every two minutes'),), # used for testing
    )

    label = models.CharField(max_length=50, verbose_name=_(u'label'), unique=True)
    next_execution = models.DateTimeField(
            verbose_name=_(u'next time the import is run'), null=True, blank=True)
    frequency = models.PositiveIntegerField(choices=FREQUENCIES, null=True, blank=True,
                                            help_text='Set the frequency interval of the import')
    user = models.ForeignKey(
            settings.AUTH_USER_MODEL, verbose_name=_(u'user'), related_name='iati_imports',)
    url = models.URLField(_(u'url'), blank=True)
    mapper_prefix = models.CharField(
            max_length=30, verbose_name=_(u'Custom mappers'), blank=True, choices=custom_mappers(),
            help_text='Choose a custom mapper to invoke custom behaviour for this import')
    enabled = models.BooleanField(verbose_name=_(u'importing enabled'), default=False,
                                  help_text='Set to enable running of this import.')
    run_immediately = models.BooleanField(verbose_name=_(u'run immediately'), default=False,
                                  help_text='Run the job immediately.')
    running = models.BooleanField(verbose_name=_(u'import currently running'), default=False,
            help_text='Running is set while the import executes. This is to guarantee that the same '
                      'import never runs twice (or more) in parallel.')


    def __unicode__(self):
        return unicode(_(u'IATI import (ID {}): {}'.format(self.pk, self.label)))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'IATI import')
        verbose_name_plural = _(u'IATI imports')

    def  model_mappers(self):
        """
        Import the ImportMapper subclasses for this IatiImport instance.
        See ImportMapper docstring for more info.
        :return: list of classes to use in IatiActivityImport.do_import()
        """

        from ...iati.imports import mappers
        klasses = []

        # "_only" mappers will only use the classes listed in module.__all__
        if self.mapper_prefix and self.mapper_prefix[-5:] == "_only":
            module = import_module(
                'akvo.iati.imports.mappers.{}'.format(self.mapper_prefix))
            mapper_class_names = module.__all__

        else:
            # assign all base class names to mapper_class_names
            from ...iati.imports.mappers import __all__ as mapper_class_names

        # For each class name get it from the base mappers
        for class_name in mapper_class_names:
            klass = getattr(mappers, class_name)
            # if a prefix is set for this import, look for a submodule with that name and replace
            # with classes we find in the submodule
            if self.mapper_prefix:
                module = import_module(
                        'akvo.iati.imports.mappers.{}'.format(self.mapper_prefix))
                if getattr(module, class_name, None):
                    klass = getattr(module, class_name)
            klasses.append(klass)

        return klasses

    def job_model(self):
        """
        Look for a proxy model for IatiImportJob based on the mapper_prefix
        """
        model_name = "{}IatiImportJob".format(self.mapper_prefix)
        module = import_module('akvo.rsr.models.iati_import_job')
        return getattr(module, model_name, IatiImportJob)

    def set_next_execution(self):
        """
        Set self.next_execution to the next time the import is going to be run. If run_immediately
        is set, time is set to now()
        """
        debug_enter(who_am_i(), who_is_parent(), getframeinfo(currentframe()).lineno)
        time_adds = {
            self.EVERY_TWO_MINUTES: timedelta(seconds=120), # used for testing
            self.HOURLY: timedelta(hours=1),
            self.EVERY_SIX_HOURS: timedelta(hours=6),
            self.DAILY: timedelta(days=1),
            self.EVERY_THREE_DAYS: timedelta(days=3),
            self.WEEKLY: timedelta(weeks=1),
            self.BI_WEEKLY: timedelta(weeks=2),
            self.EVERY_FOUR_WEEKS: timedelta(weeks=4),
        }
        if self.frequency:
            if not self.next_execution:
                self.next_execution = datetime.now() + time_adds[self.frequency]
            else:
                self.next_execution += time_adds[self.frequency]
        else:
            self.next_execution = None
        self.save()
        debug_exit(who_am_i(), getframeinfo(currentframe()).lineno)

    def save(self, *args, **kwargs):
        if self.run_immediately or self.frequency and not self.next_execution:
            self.run_immediately = False
            self.next_execution = datetime.now()
        super(IatiImport, self).save(*args, **kwargs)

    def it_is_time_to_execute(self):
        debug_enter(who_am_i(), who_is_parent(), getframeinfo(currentframe()).lineno)
        return self.enabled and self.next_execution and self.next_execution < datetime.now()

    def check_execution(self):
        """
        Checks if we should run a job on this import. This is true if either:
            1) we find a job object with pending status, in that case this is a manual run initiated
               in the admin
            2) if no job is present we check if it's time for a scheduled execution of the import
        :param job: an IatiImportJob object
        :return:
        """
        debug_enter(who_am_i(), who_is_parent(), getframeinfo(currentframe()).lineno)

        from .iati_import_log import IatiImportLog

        if not self.enabled:
            return
        job_model = self.job_model()
        try:
            job = job_model.objects.get(iati_import=self, status=LOG_ENTRY_TYPE.STATUS_PENDING)
        except job_model.DoesNotExist:
            job = None
        except job_model.MultipleObjectsReturned:
            for job in job_model.objects.filter(
                    iati_import=self, status=LOG_ENTRY_TYPE.STATUS_PENDING):
                IatiImportLog.objects.create(
                    iati_import_job=job,
                    text="Fatal error executing import. Multiple pending jobs found.",
                    created_at=datetime.now()
                )
            return
        if self.run_immediately or self.it_is_time_to_execute():
            self.execute_import(job)

    def execute_import(self, job=None):
        """
        Execute the import by instantiating and running an IatiImportJob. The job may already exist,
        or it can be created in this method.
        :param job: IatiImportJob object; if present this is a manually initiated execution
        :return:
        """
        from .iati_import_log import IatiImportLog

        # safe-guard against running the same import in parallel
        # TODO: this only records that a job is running, we should check for this before starting a
        # new job too!
        self.running = True
        self.save()

        try:
            self.set_next_execution()
            if not job:
                job_model = self.job_model()
                job = job_model(iati_import=self)
                job.save()
            job.run()
            job.save()
        except Exception as e:
            IatiImportLog.objects.create(
                iati_import_job=job,
                text="Fatal error executing import. Error message:\n{}".format(e.message),
                created_at=datetime.now()
            )
        finally:
            self.running = False
            self.save()
