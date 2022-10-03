from typing import Generic, TypeVar

from django.db import ProgrammingError, connection
from django.db.models import Model
from django.db.models.base import ModelBase
from django.test import TestCase

Super_T = TypeVar("Super_T", bound=Model)


class ModelMixinTestCase(TestCase, Generic[Super_T]):
    """
    Base class for tests of model mixins. To use, subclass and specify the
    mixin class variable. A model using the mixin will be made available in
    self.model

    Adapted from from https://stackoverflow.com/a/51146819
    """
    model: Super_T
    mixin: Super_T

    @classmethod
    def setUpClass(cls):
        # Create a dummy model which extends the mixin
        cls.model = ModelBase(
            '__TestModel__' + cls.mixin.__name__,
            (cls.mixin,),
            {'__module__': cls.mixin.__module__}
        )

        # Create the schema for  our test model
        try:
            with connection.schema_editor() as schema_editor:
                schema_editor.create_model(cls.model)
        except ProgrammingError as error:
            # --keepdb leaves the existing table intact
            if "already exists" not in str(error):
                raise
        super(ModelMixinTestCase, cls).setUpClass()

    @classmethod
    def tearDownClass(cls):
        # Delete the schema for the test model
        with connection.schema_editor() as schema_editor:
            schema_editor.delete_model(cls.model)
        super(ModelMixinTestCase, cls).tearDownClass()
