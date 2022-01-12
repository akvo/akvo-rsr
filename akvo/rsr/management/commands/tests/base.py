from io import StringIO
from typing import Generic, Type, TypeVar
from unittest.mock import patch

from django.core.management import BaseCommand

from akvo.rsr.tests.base import BaseTestCase

C = TypeVar("C", bound=BaseCommand)


class BaseCommandTestCase(BaseTestCase, Generic[C]):
    """
    A helper class to test custom django commands
    """

    command_class: Type[C]

    def setUp(self):
        super().setUp()

        # Commands allow replacing the stdout+stderr which we use later to check their contents
        self.stdout = StringIO()
        self.stderr = StringIO()
        self.command = self.command_class(
            stdout=self.stdout,
            stderr=self.stderr,
        )

    def run_command(self, *argv: str):
        """
        Emulate running the command of our command_class from the command line

        :param argv: command line args
        """
        # The commands try to close all connections, but we need those for the test
        with patch("django.db.connections.close_all"):
            self.command.run_from_argv(["manage.py", str(self.command_class)] + list(argv))
