import datetime
import logging

from abc import ABC, abstractmethod
from lxml import etree
from typing import Optional

from akvo.iati.exports.iati_export import IatiXML
from akvo.iati.exports.iati_org_export import IatiOrgXML
from akvo.iati.iati_validator import IATIValidatorAPI, IATIValidationResult, IATIValidatorException, IATIValidatorTimeoutException
from akvo.rsr.models import Project, Organisation
from akvo.rsr.models.iati_validation_job import IatiValidationJobMixin


logger = logging.getLogger(__name__)


def get_iati_activity_xml_doc(project: Project, utc_now: datetime.datetime) -> bytes:
    return etree.tostring(etree.ElementTree(IatiXML([project], utc_now=utc_now).iati_activities))


def get_iati_organisation_xml_doc(organisation: Organisation, utc_now: datetime.datetime) -> bytes:
    return etree.tostring(etree.ElementTree(IatiOrgXML([organisation], utc_now=utc_now).iati_organisations))


class IatiValidationJobRunner(ABC):

    def __init__(self, validator: IATIValidatorAPI, job: IatiValidationJobMixin):
        self.validator = validator
        self.job = job

    @abstractmethod
    def get_xml_document(self) -> bytes:
        pass

    @classmethod
    def get_utc_now(cls) -> datetime.datetime:
        return datetime.datetime.utcnow()

    def run(self) -> Optional[IATIValidationResult]:
        self.job.mark_started()
        try:
            result = self.validator.validate(self.get_xml_document())
            self.job.mark_finished()
            return result
        except IATIValidatorTimeoutException:
            pass  # retry on next round
        except IATIValidatorException:
            logger.exception(f'Failed to run IATI validator job for {str(self.job)}')


class IatiActivityValidationJobRunner(IatiValidationJobRunner):

    def get_xml_document(self) -> bytes:
        return get_iati_activity_xml_doc(self.job.project, self.get_utc_now())


class IatiOrganisationValidationJobRunner(IatiValidationJobRunner):

    def get_xml_document(self) -> bytes:
        return get_iati_organisation_xml_doc(self.job.organisation, self.get_utc_now())
