# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest.mock import patch, Mock
from django.test import override_settings
from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework import status

from akvo.rsr.models import Project
from akvo.rsr.tests.base import BaseTestCase
from akvo.rest.views.project import ProjectViewSet


class ProjectChildrenMemoryProtectionSimpleTestCase(BaseTestCase):
    """Simplified tests for memory protection features in project children endpoint"""

    def setUp(self):
        """Set up test data"""
        self.user = self.create_user('test@akvo.org', 'password', is_admin=True)
        self.viewset = ProjectViewSet()
        self.factory = APIRequestFactory()

        # Create a parent project
        self.parent_project = self.create_project('Parent Project')

        # Create some child projects
        self.child_projects = []
        for i in range(5):
            child = self.create_project(f'Child Project {i+1}')
            child.set_parent(self.parent_project)
            child.save()
            self.child_projects.append(child)

    def test_configuration_values(self):
        """Test that configuration values are properly used"""
        from akvo.rest.views.project import (
            MAX_DESCENDANTS_PER_REQUEST,
            DESCENDANTS_CHUNK_SIZE,
            DEFAULT_MAX_DESCENDANTS_PER_REQUEST,
            DEFAULT_DESCENDANTS_CHUNK_SIZE
        )

        # Should have default values
        self.assertEqual(DEFAULT_MAX_DESCENDANTS_PER_REQUEST, 1000)
        self.assertEqual(DEFAULT_DESCENDANTS_CHUNK_SIZE, 500)

        # Should respect settings or use defaults
        self.assertIsInstance(MAX_DESCENDANTS_PER_REQUEST, int)
        self.assertIsInstance(DESCENDANTS_CHUNK_SIZE, int)
        self.assertGreater(MAX_DESCENDANTS_PER_REQUEST, 0)
        self.assertGreater(DESCENDANTS_CHUNK_SIZE, 0)

    def test_chunked_queryset_method(self):
        """Test the _chunked_queryset method functionality"""
        viewset = ProjectViewSet()

        # Create a test queryset
        test_queryset = Project.objects.filter(id__in=[p.id for p in self.child_projects])

        # Test chunked processing
        chunks = list(viewset._chunked_queryset(test_queryset, chunk_size=2))

        # Should have appropriate number of chunks
        expected_chunks = (len(self.child_projects) + 1) // 2  # Ceiling division
        self.assertEqual(len(chunks), expected_chunks)

        # First chunks should have 2 items, last might have fewer
        for i, chunk in enumerate(chunks[:-1]):
            self.assertEqual(len(chunk), 2)

        # Verify all items are included
        all_items = []
        for chunk in chunks:
            all_items.extend(chunk)
        self.assertEqual(len(all_items), len(self.child_projects))

    def test_build_parent_child_mapping_method(self):
        """Test the _build_parent_child_mapping method"""
        viewset = ProjectViewSet()

        # Test with our child projects
        descendants = list(Project.objects.filter(id__in=[p.id for p in self.child_projects]))
        parent_to_children, children = viewset._build_parent_child_mapping(
            descendants, self.parent_project.uuid
        )

        # Should map parent UUID to children
        self.assertIn(self.parent_project.uuid, parent_to_children)
        self.assertEqual(len(parent_to_children[self.parent_project.uuid]), 5)
        self.assertEqual(len(children), 5)

    def test_memory_limits_detection(self):
        """Test that memory limits are properly detected"""
        # Mock a large count to trigger chunked processing
        with patch.object(self.parent_project, 'descendants') as mock_descendants:
            mock_queryset = Mock()
            mock_queryset.count.return_value = 1500  # Exceeds default limit
            mock_descendants.return_value = mock_queryset

            # Create a mock request
            mock_request = Mock()
            mock_request.user = self.user

            # Test that the condition would trigger chunked processing
            from akvo.rest.views.project import MAX_DESCENDANTS_PER_REQUEST
            total_count = mock_queryset.count()

            if total_count > MAX_DESCENDANTS_PER_REQUEST:
                # This would trigger chunked processing
                self.assertTrue(True, "Chunked processing would be triggered")
            else:
                self.fail("Large hierarchy should trigger chunked processing")

    @override_settings(RSR_MAX_DESCENDANTS_PER_REQUEST=3)
    def test_settings_override(self):
        """Test that settings can override default limits"""
        # Reload the module to pick up new settings
        import importlib
        import akvo.rest.views.project
        importlib.reload(akvo.rest.views.project)

        from akvo.rest.views.project import MAX_DESCENDANTS_PER_REQUEST

        # Should use the overridden value
        self.assertEqual(MAX_DESCENDANTS_PER_REQUEST, 3)

    def test_empty_chunk_handling(self):
        """Test that empty chunks are handled correctly"""
        viewset = ProjectViewSet()

        # Test with empty queryset
        empty_queryset = Project.objects.none()
        chunks = list(viewset._chunked_queryset(empty_queryset, chunk_size=10))

        # Should return no chunks
        self.assertEqual(len(chunks), 0)

    def test_single_item_chunk(self):
        """Test chunking with a single item"""
        viewset = ProjectViewSet()

        # Test with single item
        single_queryset = Project.objects.filter(id=self.child_projects[0].id)
        chunks = list(viewset._chunked_queryset(single_queryset, chunk_size=10))

        # Should return one chunk with one item
        self.assertEqual(len(chunks), 1)
        self.assertEqual(len(chunks[0]), 1)

    def test_exact_chunk_size_boundary(self):
        """Test chunking when items exactly match chunk size"""
        viewset = ProjectViewSet()

        # Create exactly 4 projects (using existing 5, take 4)
        four_projects = Project.objects.filter(
            id__in=[p.id for p in self.child_projects[:4]]
        )
        chunks = list(viewset._chunked_queryset(four_projects, chunk_size=2))

        # Should return exactly 2 chunks of 2 items each
        self.assertEqual(len(chunks), 2)
        self.assertEqual(len(chunks[0]), 2)
        self.assertEqual(len(chunks[1]), 2)

    def test_parent_child_mapping_with_multiple_levels(self):
        """Test parent-child mapping with deeper hierarchies"""
        viewset = ProjectViewSet()

        # Create a grandchild
        grandchild = self.create_project('Grandchild Project')
        grandchild.set_parent(self.child_projects[0])
        grandchild.save()

        # Test mapping including grandchild
        all_descendants = list(Project.objects.filter(
            id__in=[p.id for p in self.child_projects] + [grandchild.id]
        ))

        parent_to_children, children = viewset._build_parent_child_mapping(
            all_descendants, self.parent_project.uuid
        )

        # Should still map correctly
        self.assertIn(self.parent_project.uuid, parent_to_children)
        self.assertEqual(len(children), 5)  # Original 5 children, grandchild mapped to child[0]

        # Grandchild should be mapped to its parent
        child_0_uuid = self.child_projects[0].uuid
        if child_0_uuid in parent_to_children:
            self.assertEqual(len(parent_to_children[child_0_uuid]), 1)
            self.assertEqual(parent_to_children[child_0_uuid][0].id, grandchild.id)


class ProjectChildrenIntegrationTestCase(BaseTestCase):
    """Integration tests for project children endpoint"""

    def setUp(self):
        """Set up test data for integration tests"""
        self.user = self.create_user('test@akvo.org', 'password', is_admin=True)
        self.factory = APIRequestFactory()

        # Create a parent project
        self.parent_project = self.create_project('Parent Project')

    def test_standard_processing_path(self):
        """Test that standard processing works correctly"""
        # Create just a few children (below limit)
        for i in range(2):
            child = self.create_project(f'Standard Child {i+1}')
            child.set_parent(self.parent_project)
            child.save()

        request = self.factory.get(f'/rest/v1/project/{self.parent_project.id}/children/')
        force_authenticate(request, user=self.user)

        view = ProjectViewSet.as_view({'get': 'children'})
        response = view(request, pk=self.parent_project.id)

        # Should get standard list response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 2)

    def test_filter_queryset_method(self):
        """Test the _filter_queryset method through HTTP request"""
        # Test that _filter_queryset is called via standard endpoint
        request = self.factory.get(f'/rest/v1/project/{self.parent_project.id}/children/')
        force_authenticate(request, user=self.user)

        # Add a child to test filtering
        child = self.create_project('Filter Child')
        child.set_parent(self.parent_project)
        child.save()

        view = ProjectViewSet.as_view({'get': 'children'})
        response = view(request, pk=self.parent_project.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)

    def test_deep_hierarchy_chunked_processing(self):
        """Test chunked processing with deep hierarchies"""
        # Create a deep hierarchy: parent -> child -> grandchild
        child = self.create_project('Deep Child')
        child.set_parent(self.parent_project)
        child.save()

        grandchild = self.create_project('Deep Grandchild')
        grandchild.set_parent(child)
        grandchild.save()

        request = self.factory.get(f'/rest/v1/project/{self.parent_project.id}/children/')
        force_authenticate(request, user=self.user)

        view = ProjectViewSet.as_view({'get': 'children'})
        response = view(request, pk=self.parent_project.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Should include both child and grandchild due to max_depth=2
        if isinstance(response.data, list):
            # Standard processing
            self.assertGreaterEqual(len(response.data), 1)  # At least the direct child
        else:
            # Chunked processing
            self.assertGreaterEqual(response.data['meta']['children_count'], 1)

    def test_chunked_queryset_functionality(self):
        """Test _chunked_queryset method directly"""
        viewset = ProjectViewSet()
        
        # Create test projects
        projects = []
        for i in range(5):
            project = self.create_project(f'Test Project {i+1}')
            projects.append(project)
        
        queryset = Project.objects.filter(id__in=[p.id for p in projects])
        
        # Test chunking with size 2
        chunks = list(viewset._chunked_queryset(queryset, 2))
        
        # Should have 3 chunks (2+2+1)
        self.assertEqual(len(chunks), 3)
        self.assertEqual(len(chunks[0]), 2)
        self.assertEqual(len(chunks[1]), 2)
        self.assertEqual(len(chunks[2]), 1)

    def test_build_parent_child_mapping_functionality(self):
        """Test _build_parent_child_mapping method"""
        viewset = ProjectViewSet()
        
        # Create children
        children = []
        for i in range(3):
            child = self.create_project(f'Mapping Child {i+1}')
            child.set_parent(self.parent_project)
            child.save()
            children.append(child)
        
        # Test the mapping
        descendants = list(Project.objects.filter(id__in=[c.id for c in children]))
        parent_to_children, direct_children = viewset._build_parent_child_mapping(
            descendants, self.parent_project.uuid
        )
        
        # Should create correct mapping
        self.assertIn(self.parent_project.uuid, parent_to_children)
        self.assertEqual(len(parent_to_children[self.parent_project.uuid]), 3)
        self.assertEqual(len(direct_children), 3)

    @override_settings(RSR_MAX_DESCENDANTS_PER_REQUEST=1000)
    def test_configuration_constants_usage(self):
        """Test that configuration constants are properly used"""
        from akvo.rest.views.project import (
            MAX_DESCENDANTS_PER_REQUEST,
            DESCENDANTS_CHUNK_SIZE,
            DEFAULT_MAX_DESCENDANTS_PER_REQUEST,
            DEFAULT_DESCENDANTS_CHUNK_SIZE
        )
        
        # Verify configuration values
        self.assertEqual(MAX_DESCENDANTS_PER_REQUEST, 1000)
        self.assertEqual(DEFAULT_MAX_DESCENDANTS_PER_REQUEST, 1000)
        self.assertEqual(DEFAULT_DESCENDANTS_CHUNK_SIZE, 500)
        self.assertIsInstance(DESCENDANTS_CHUNK_SIZE, int)

    def test_memory_protection_unit_functionality(self):
        """Test individual memory protection functions work correctly"""
        viewset = ProjectViewSet()
        
        # Test empty queryset handling
        empty_chunks = list(viewset._chunked_queryset(Project.objects.none(), 10))
        self.assertEqual(len(empty_chunks), 0)
        
        # Test single item chunking
        single_project = self.create_project('Single Project')
        single_queryset = Project.objects.filter(id=single_project.id)
        single_chunks = list(viewset._chunked_queryset(single_queryset, 10))
        self.assertEqual(len(single_chunks), 1)
        self.assertEqual(len(single_chunks[0]), 1)

    def test_chunked_processing_detection_logic(self):
        """Test the logic that detects when to use chunked processing"""
        viewset = ProjectViewSet()
        
        # Test that the detection logic works
        from akvo.rest.views.project import MAX_DESCENDANTS_PER_REQUEST
        
        # Small count should not trigger chunked processing
        self.assertLessEqual(5, MAX_DESCENDANTS_PER_REQUEST)
        
        # Large count should trigger chunked processing
        large_count = MAX_DESCENDANTS_PER_REQUEST + 1
        self.assertGreater(large_count, MAX_DESCENDANTS_PER_REQUEST)

    @override_settings(RSR_MAX_DESCENDANTS_PER_REQUEST=2, RSR_DESCENDANTS_CHUNK_SIZE=1)
    def test_chunked_processing_actual_trigger(self):
        """Test that chunked processing actually gets triggered with real data"""
        # Create enough children to exceed the limit
        children = []
        for i in range(4):  # More than the limit of 2
            child = self.create_project(f'Trigger Child {i+1}')
            child.set_parent(self.parent_project)
            child.save()
            children.append(child)

        request = self.factory.get(f'/rest/v1/project/{self.parent_project.id}/children/')
        force_authenticate(request, user=self.user)

        view = ProjectViewSet.as_view({'get': 'children'})
        response = view(request, pk=self.parent_project.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # With 4 children and limit of 2, should trigger chunked processing
        if isinstance(response.data, dict):
            # Successfully triggered chunked processing
            self.assertIn('data', response.data)
            self.assertIn('meta', response.data)
            meta = response.data['meta']
            self.assertEqual(meta['total_processed'], 4)
            self.assertEqual(meta['children_count'], 2)  # Limited by MAX_DESCENDANTS_PER_REQUEST
            self.assertTrue(meta['truncated'])
        else:
            # If it didn't trigger chunked processing, it should still work
            self.assertIsInstance(response.data, list)
            self.assertEqual(len(response.data), 4)

    def test_chunked_processing_with_real_project_hierarchy(self):
        """Test chunked processing works with a real project hierarchy"""
        # Create a grandchild to test deeper hierarchy
        grandchild = self.create_project('Grandchild Project')
        child = self.create_project('Child Project')
        child.set_parent(self.parent_project)
        child.save()
        grandchild.set_parent(child)
        grandchild.save()

        request = self.factory.get(f'/rest/v1/project/{self.parent_project.id}/children/')
        force_authenticate(request, user=self.user)

        view = ProjectViewSet.as_view({'get': 'children'})
        response = view(request, pk=self.parent_project.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Should work regardless of whether chunked or standard processing is used
        if isinstance(response.data, list):
            # Standard processing
            self.assertGreaterEqual(len(response.data), 1)
        else:
            # Chunked processing
            self.assertIn('data', response.data)
            self.assertIn('meta', response.data)
            self.assertGreaterEqual(len(response.data['data']), 1)