#!/usr/bin/env python
"""A script to generate the initial draft of release notes for a milestone.

Usage:

    {executable} <MILESTONE_ID>

"""

import requests

URL = 'https://api.github.com/repos/akvo/akvo-rsr/issues?milestone={milestone}&state=closed'
RELEASE_NOTES = """
## New and noteworthy

{features}

## Resolved issues

{bugs}

## Code maintenance

{chores}
"""

LABELS = {
    'bugs': 'Bug',
    'chores': 'Chore',
    'features': None,
}


def get_issues(milestone):
    """Return the issues in the milestone."""
    url = URL.format(milestone=milestone)
    entries = requests.get(url).json()
    issues = [entry for entry in entries if 'pull_request' not in entry]
    return issues


def format_issue(issue):
    return '- {title} [#{number}]({html_url})'.format(**issue)


def format_issues(issues):
    return '\n\n'.join(map(format_issue, issues))


def issue_labels(issue):
    return set([label['name'] for label in issue['labels']])


def filter_issues(issues, label, labels):
    other_labels = set(labels) - {label}
    if label is None:
        issues_ = [
            issue for issue in issues
            if not other_labels.intersection(issue_labels(issue))
        ]
    else:
        issues_ = [
            issue for issue in issues
            if label in issue_labels(issue)
        ]

    return issues_


def release_notes(issues):
    grouped_issues = {
        key: format_issues(filter_issues(issues, label, LABELS.values()))
        for key, label in LABELS.items()
    }
    return RELEASE_NOTES.format(**grouped_issues)


def main(milestone):
    issues = get_issues(milestone)
    print(release_notes(issues))


if __name__ == '__main__':
    import sys
    if len(sys.argv) != 2:
        sys.exit(__doc__.format(executable=sys.argv[0]))

    milestone = sys.argv[1]
    main(milestone)
