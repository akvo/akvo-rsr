#!/usr/bin/env python
"""A script to prepare the repo for a release from a PR

The PR would be from `develop` to `master` for a full-blown release, or from a
`hot-fix` branch to `master`.

The script automates the following tasks:

1. A new milestone is created for the Release with the title of the PR. The PR
title should contain the release number which is used to tag the release.

2. All the issues associated with commits in the PR are identified.

3. Any issues which don't already have a milestone attached are tagged with the
new milestone.

4. Release notes are prepared looking at the tags of the issues, and
categorizing fixes as new features, bugs or chores.

5. A new draft release is created with the tag specified in the PR title.

Usage:

    {executable} <PR_ID>

"""

from __future__ import print_function

import re
import os
import subprocess

import requests

OAUTH_TOKEN = os.getenv('GITHUB_TOKEN', '').strip()
if not OAUTH_TOKEN:
    OAUTH_TOKEN = subprocess.check_output(['git', 'config', '--global', 'github.oauth-token']).strip()
HEADERS = {"Authorization": "token {}".format(OAUTH_TOKEN)}
RELEASE_NOTES = u"""
## New and noteworthy

{features}

## Resolved issues

{bugs}

## Code maintenance

{chores}
"""

LABELS = [
    ('bugs', {'Bug'}),
    ('chores', {'Chore'}),
    ('features', {'Feature request'}),
]


def get_pull_request(pull_number):
    """Return the issues in the milestone."""
    pull_request_url = 'https://api.github.com/repos/akvo/akvo-rsr/pulls/{pull_number}'
    url = pull_request_url.format(pull_number=pull_number)
    response = requests.get(url, headers=HEADERS)
    return response.json()


def get_commits(pull_number):
    commits_url = (
        'https://api.github.com/repos/akvo/akvo-rsr/pulls/{pull_number}/commits'
        '?per_page=100&page={page}'
    )
    commits = []
    page = 1
    while True:
        url = commits_url.format(pull_number=pull_number, page=page)
        response = requests.get(url, headers=HEADERS)
        page_commits = response.json()
        if not page_commits:
            break
        page += 1
        commits.extend(page_commits)
    return commits


def create_milestone(title):
    milestones_url = 'https://api.github.com/repos/akvo/akvo-rsr/milestones'
    milestones = requests.get(milestones_url, headers=HEADERS).json()
    matching_milestones = [milestone for milestone in milestones if milestone['title'] == title]
    if matching_milestones:
        return matching_milestones[0]

    data = {'title': title}
    response = requests.post(milestones_url, json=data, headers=HEADERS)
    return response.json()


def is_merge_commit(commit):
    parents = commit['parents']
    return len(parents) > 1


def get_issue(commit):
    message = commit['commit']['message']
    match = re.match(r'^\[#(\d+)\].*', message)
    if not match:
        return
    issue_number = match.group(1)
    url = 'https://api.github.com/repos/akvo/akvo-rsr/issues/{}'.format(issue_number)
    return requests.get(url, headers=HEADERS).json()


def assign_milestone(issue, milestone_number):
    issue_number = issue['number']
    url = 'https://api.github.com/repos/akvo/akvo-rsr/issues/{}'.format(issue_number)
    data = {'milestone': milestone_number}
    return requests.patch(url, json=data, headers=HEADERS).json()


def make_release_notes(changes):
    processed_issues = set()
    notes = {key: [] for key, _ in LABELS}
    for commit, issue, milestone_number in changes:
        if issue is not None and issue['number'] in processed_issues:
            continue
        elif issue is None or issue['milestone']['number'] != milestone_number:
            type_, entry = make_release_note(commit, issue, True)
        else:
            type_, entry = make_release_note(commit, issue, False)
            processed_issues.add(issue['number'])
        notes[type_].append(entry)

    notes = {key: '\n\n'.join(value) for key, value in notes.iteritems()}
    notes = RELEASE_NOTES.format(**notes)
    return notes


def make_release_note(commit, issue, use_commit_message):
    if use_commit_message:
        message = commit['commit']['message']
        url = commit['html_url']
        link_text = commit['sha'][:7]
        entry = '- {} [{}]({})'.format(message, link_text, url)
        entry_type = release_note_type(issue) if issue else 'bugs'
    else:
        message = issue['title']
        link_text = '#{}'.format(issue['number'])
        url = issue['html_url']
        entry = '- {} [{}]({})'.format(message, link_text, url)
        entry_type = release_note_type(issue)
    return entry_type, entry


def release_note_type(issue):
    issue_labels = {label['name'] for label in issue['labels']}
    for type_, labels in LABELS:
        if labels.intersection(issue_labels):
            return type_
    return type_


def create_release(title, notes, pull_request_branch):
    url = 'https://api.github.com/repos/akvo/akvo-rsr/releases'
    releases = requests.get(url, headers=HEADERS).json()
    releases = [r for r in releases if r['draft'] and r['name'].strip() == title]
    tag_name = 'v' + re.search(r'([\d.]+)', title).group(1)
    data = {
        'draft': True, 'name': title, 'body': notes, 'tag_name': tag_name,
        'target_commitish': pull_request_branch}
    if releases:
        url = releases[0]['url']
        release = requests.post(url, json=data, headers=HEADERS).json()
    else:
        release = requests.post(url, json=data, headers=HEADERS).json()

    print(release['html_url'])
    return release


def main(pull_number):
    pull_request = get_pull_request(pull_number)
    assert pull_request['base']['ref'] == 'master', 'Pull request is not against master'
    pull_request_branch = pull_request['head']['ref']
    title = pull_request['title'].strip()
    print(title)
    commits = get_commits(pull_number)
    milestone = create_milestone(title)
    milestone_number = milestone['number']
    changes = []
    for commit in commits:
        if is_merge_commit(commit):
            continue
        issue = get_issue(commit)
        if issue is not None and issue['milestone'] is None:
            issue = assign_milestone(issue, milestone_number)

        changes.append((commit, issue, milestone_number))

    notes = make_release_notes(changes)
    print(notes)
    create_release(title, notes, pull_request_branch)


if __name__ == '__main__':
    import sys
    if len(sys.argv) != 2:
        sys.exit(__doc__.format(executable=sys.argv[0]))

    pull_number = sys.argv[1]
    main(pull_number)
