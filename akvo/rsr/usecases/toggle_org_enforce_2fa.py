from __future__ import annotations
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from akvo.rsr.models import Organisation


def toggle_enfore_2fa(org: Organisation):
    print('toggle to: ', org.enforce_2fa, ', from', not org.enforce_2fa)
