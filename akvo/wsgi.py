# Akvo RSR is covered by the GNU Affero General Public License. See more
# details in the license.txt file located at the root folder of the Akvo RSR
# module. For additional details on the GNU license please see
# <http://www.gnu.org/licenses/agpl.html>.

"""
WSGI config for akvo project.

This module contains the WSGI application used by Django's development server
and any production WSGI deployments. It should expose a module-level variable
named ``application``. Django's ``runserver`` and ``runfcgi`` commands discover
this application via the ``WSGI_APPLICATION`` setting.

Usually you will have the standard Django WSGI application here, but it also
might make sense to replace the whole Django WSGI application with a custom one
that later delegates to the Django one. For example, you could introduce WSGI
middleware here, or combine a Django application with an application of another
framework.

"""
import logging
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "akvo.settings")

# This application object is used by any WSGI server configured to use this
# file. This includes Django's development server, if the WSGI_APPLICATION
# setting points here.
application = get_wsgi_application()

# Apply WSGI middleware here.
# from helloworld.wsgi import HelloWorldApplication
# application = HelloWorldApplication(application)

# Django as a whole can now be imported after the apps have been populated
from django.conf import settings
from . import utils

logger = logging.getLogger(__name__)
# Use Google Cloud Profiler if enabled and installed
if utils.to_bool(os.environ.get("CLOUD_PROFILER_ENABLE")):
    # https://cloud.google.com/profiler/docs/profiling-python
    try:
        import googlecloudprofiler

        deploy_commit_id = getattr(settings, "DEPLOY_COMMIT_ID", None)
        if not deploy_commit_id:
            raise ValueError("Unknown commit ID")

        # We currently don't have a good way of determining which env RSR is running in
        domain_name = settings.RSR_DOMAIN
        service_version = f"{domain_name}-{deploy_commit_id}"

        logger.info("Starting cloud profiler for version: %s", service_version)
        googlecloudprofiler.start(
            service='akvo-rsr',
            service_version=service_version,
        )
    except ImportError:
        logger.warning("Google Cloud Profiler enabled, but not installed")
    except (ValueError, NotImplementedError) as exc:
        print(exc)  # Handle errors here
