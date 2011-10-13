#!/usr/bin/env python
# -*- coding: utf-8 -*-

from urlparse import urlparse

from django.core.management import setup_environ
import settings
setup_environ(settings)

from django.db.models import get_model


def get_new_url(url):
    """Converts old-style blip.tv URLs to new-style

    Example:

    http://akvo.blip.tv/12345 -> http://blip.tv/akvo/12345

    Returns a new-style URL string or None

    """
    parsed_url = urlparse(url)
    if parsed_url.netloc.endswith('.blip.tv'):  # matches *.blip.tv but not ^blip.tv
        user, video_id = parsed_url.netloc.split('.')[0], parsed_url.path
        return u'http://blip.tv/%s/%s' % (user, video_id)
    return


def convert():
    updates = get_model('rsr', 'projectupdate').objects.all()
    for update in updates:
        if 'blip.tv' in update.video:
            new_url = get_new_url(update.video)
            if new_url is not None:
                update.video = new_url
                update.save()
                print 'Converted project update %d to use new-style blip.tv URL' % update.id
    return


if __name__ == '__main__':
    convert()
