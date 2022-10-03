from typing import Union
from uuid import UUID


def uuid_to_label(string: Union[str, UUID]) -> str:
    """
    Converts a UUID to a valid ltree label

    Labels may not have dashes so they are converted to underscores
    """
    return str(string).replace("-", "_")


def label_to_uuid(string: str) -> UUID:
    """
    Converts a label to a UUID str

    Labels have underscores instead of the dashes that UUIDs have,
     so those have to be reconverted
    """
    return UUID(str(string).replace("_", "-"))
