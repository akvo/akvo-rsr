# -*- coding: utf-8 -*-

"""
Tests for the cleanup_deletion_tracker management command.
"""

from io import StringIO
from unittest.mock import patch
from django.core.management import call_command
from django.test import TestCase

from akvo.rsr.models.project import DELETION_SET


class CleanupDeletionTrackerCommandTestCase(TestCase):
    """Tests for the cleanup_deletion_tracker management command"""

    def setUp(self):
        # Ensure deletion tracker is completely clean before each test
        DELETION_SET.clear_all()

    def tearDown(self):
        # Clean up after each test
        DELETION_SET.clear_all()

    def test_stats_command(self):
        """Test the --stats option shows current tracker statistics"""
        # Add some test data
        DELETION_SET.add(123)
        DELETION_SET.add(456)

        out = StringIO()
        call_command('cleanup_deletion_tracker', '--stats', stdout=out)
        output = out.getvalue()

        self.assertIn('Deletion tracker stats:', output)
        self.assertIn('Active deletions: 2', output)
        self.assertIn('Tracked timestamps: 2', output)
        self.assertIn('Cleanup threshold:', output)

        # Clean up
        DELETION_SET.discard(123)
        DELETION_SET.discard(456)

    def test_dry_run_no_stale_entries(self):
        """Test dry run when there are no stale entries"""
        out = StringIO()
        call_command('cleanup_deletion_tracker', '--dry-run', stdout=out)
        output = out.getvalue()

        self.assertIn('No stale entries found - deletion tracker is clean', output)

    @patch('time.time')
    def test_dry_run_with_stale_entries(self, mock_time):
        """Test dry run when there are stale entries"""
        # Mock time to control staleness
        mock_time.return_value = 1000.0

        # Add entry that will become stale
        DELETION_SET.add(789)

        # Advance time beyond cleanup threshold
        mock_time.return_value = 1000.0 + DELETION_SET._cleanup_threshold + 1

        out = StringIO()
        call_command('cleanup_deletion_tracker', '--dry-run', stdout=out)
        output = out.getvalue()

        self.assertIn('Would clean up 1 stale deletion tracker entries', output)
        self.assertIn('Project IDs: 789', output)

        # Entry should still be present (dry run doesn't actually clean)
        self.assertIn(789, DELETION_SET)

        # Clean up
        DELETION_SET.discard(789)

    def test_cleanup_no_stale_entries(self):
        """Test actual cleanup when there are no stale entries"""
        out = StringIO()
        call_command('cleanup_deletion_tracker', stdout=out)
        output = out.getvalue()

        self.assertIn('No stale entries found - deletion tracker is clean', output)

    @patch('time.time')
    def test_cleanup_with_stale_entries(self, mock_time):
        """Test actual cleanup when there are stale entries"""
        # Mock time to control staleness
        mock_time.return_value = 2000.0

        # Add entries - one fresh, one stale
        DELETION_SET.add(111)  # This will be stale

        # Advance time and add fresh entry
        mock_time.return_value = 2000.0 + DELETION_SET._cleanup_threshold + 1
        DELETION_SET.add(222)  # This will be fresh

        out = StringIO()
        call_command('cleanup_deletion_tracker', stdout=out)
        output = out.getvalue()

        self.assertIn('Successfully cleaned up 1 stale deletion tracker entries', output)

        # Stale entry should be removed, fresh entry should remain
        self.assertNotIn(111, DELETION_SET)
        self.assertIn(222, DELETION_SET)

        # Clean up remaining entry
        DELETION_SET.discard(222)

    def test_command_with_no_arguments(self):
        """Test command with no arguments defaults to cleanup"""
        out = StringIO()
        call_command('cleanup_deletion_tracker', stdout=out)
        output = out.getvalue()

        # Should show cleanup result
        self.assertIn('deletion tracker', output)

    def test_command_help(self):
        """Test that command help works (just test it doesn't crash)"""
        # Test that the command can be imported without errors
        from akvo.rsr.management.commands.cleanup_deletion_tracker import Command
        command = Command()

        # Verify the help text is set
        self.assertIn('Cleanup stale entries', command.help)

        # Test that parser can be created without errors
        parser = command.create_parser('manage.py', 'cleanup_deletion_tracker')
        self.assertIsNotNone(parser)
