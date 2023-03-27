#!/usr/bin/env python3

import os

from pdoc.cli import *

OUTPUT_DIR = "./public"

# Programmatically provide settings module
SETTINGS_MODULE = "akvo.settings"
os.environ.setdefault('DJANGO_SETTINGS_MODULE', SETTINGS_MODULE)

# Setup Django
import django
django.setup()

cmdline_args = [
    "--html",
    "-o" , OUTPUT_DIR,
    "--skip-errors",
    "--force",
    "akvo",
]

if __name__ == "__main__":
    main(parser.parse_args(cmdline_args))
