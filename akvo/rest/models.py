from django.db import models

from rest_framework.authentication import TokenAuthentication
from tastypie.models import ApiKey


class TastyTokenAuthentication(TokenAuthentication):
    """
    Override the model attribute to use Tastypie's token model

    Simple token based authentication.

    Clients should authenticate by passing the token key in the "Authorization"
    HTTP header, prepended with the string "Token ".  For example:

        Authorization: Token 401f7ac837da42b97f613d789819ff93537bee6a
    """

    model = ApiKey
    """
    A custom token model may be used, but must have the following properties.

    * key -- The string identifying the token
    * user -- The user to which the token belongs
    """
