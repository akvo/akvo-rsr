#!/usr/bin/env python3
"""
Outputs a valid python string from the given input

Only one parameter is accepted
"""

import shlex
import sys

quote = shlex.quote(sys.argv[1])
if not (quote.startswith("'") or quote.startswith('"')):
    quote = f"'{quote}'"

print(quote)
