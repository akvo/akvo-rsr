# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.tests.base import BaseTestCase


class FeedsTestCase(BaseTestCase):
    """Tests for the RSS feeds"""

    def test_updates_feed(self):
        user = self.create_user('foo@example.com')
        project_title = 'Projet de d\xc3\xa9veloppement'
        project = self.create_project(project_title)
        title = 'Update de développement'
        text = 'What an amazing update!'
        self.create_project_update(project, user, title, text)
        empty_title = ''
        self.create_project_update(project, user, empty_title, text)

        response = self.c.get('/rss/updates/{}'.format(project.pk), follow=True)

        self.assertEqual(response.status_code, 200)
        content = response.content.decode('utf8')
        self.assertIn(project_title.decode('utf8'), content)
        self.assertIn(title, content)
        self.assertIn(text.decode('utf8'), content)

    def test_org_updates_feed(self):
        user = self.create_user('foo@example.com')
        org = self.create_organisation('Akvo Org')
        self.make_employment(user, org, 'Users')
        project_title_fmt = 'Projet de d\xc3\xa9veloppement - {}'
        update_title_fmt = 'Update de développement - {}'
        update_text_fmt = 'What an amazing update! - {}'
        for num in range(6):
            project_title = project_title_fmt.format(num)
            project = self.create_project(project_title)
            title = update_title_fmt.format(num)
            text = update_text_fmt.format(num)
            self.create_project_update(project, user, title, text)
            if num % 2 == 0:
                self.make_partner(project, org)

        response = self.c.get('/rss/org-updates/{}'.format(org.pk), follow=True)

        self.assertEqual(response.status_code, 200)
        content = response.content.decode('utf8')
        for num in range(6):
            project_title = project_title_fmt.format(num)
            title = update_title_fmt.format(num)
            text = update_text_fmt.format(num)
            assertion = self.assertIn if num % 2 == 0 else self.assertNotIn
            assertion(project_title.decode('utf8'), content)
            assertion(title, content)
            assertion(text.decode('utf8'), content)

    def test_all_updates_feed(self):
        user = self.create_user('foo@example.com')
        project_title_fmt = 'Projet de d\xc3\xa9veloppement - {}'
        update_title_fmt = 'Update de développement - {}'
        update_text_fmt = 'What an amazing update! - {}'
        for num in range(6):
            project_title = project_title_fmt.format(num)
            project = self.create_project(project_title)
            title = update_title_fmt.format(num)
            text = update_text_fmt.format(num)
            self.create_project_update(project, user, title, text)

        response = self.c.get('/rss/all-updates/', follow=True)

        self.assertEqual(response.status_code, 200)
        content = response.content.decode('utf8')
        for num in range(6):
            project_title = project_title_fmt.format(num)
            title = update_title_fmt.format(num)
            text = update_text_fmt.format(num)
            self.assertIn(project_title.decode('utf8'), content)
            self.assertIn(title, content)
            self.assertIn(text.decode('utf8'), content)
