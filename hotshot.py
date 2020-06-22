import cProfile
import pstats
from pstats import SortKey
from io import StringIO
import logging
import os
import time

PROFILE_LIMIT = int(os.environ.get("PROFILE_LIMIT", 100))
PROFILER = bool(int(os.environ.get("PROFILER", 1)))

print("""
  # ** USAGE:
  $ PROFILE_LIMIT=100 gunicorn -c ./wsgi_profiler_conf.py wsgi
  # ** TIME MEASUREMENTS ONLY:
  $ PROFILER=0 gunicorn -c ./wsgi_profiler_conf.py wsgi
""")


def profiler_enable(worker, req):
    worker.profile = cProfile.Profile()
    worker.profile.enable()
    worker.log.info(f"PROFILING {worker.pid}: {req.uri}")


def profiler_summary(worker, req):
    s = StringIO()
    worker.profile.disable()
    ps = pstats.Stats(worker.profile, stream=s).sort_stats(SortKey.CUMULATIVE)
    ps.print_stats("rsr", PROFILE_LIMIT)

    logging.error(f"\n[{worker.pid}] [INFO] [{req.method}] URI {req.uri}")
    logging.error(f"[{worker.pid}] [INFO] {s.getvalue()}")


def pre_request(worker, req):
    worker.start_time = time.time()
    if PROFILER is True:
        profiler_enable(worker, req)


def post_request(worker, req, *args):
    total_time = time.time() - worker.start_time
    logging.error(f"\n[{worker.pid}] [INFO] [{req.method}] Load Time: {total_time}s\n")
    if PROFILER is True:
        profiler_summary(worker, req)