# -*- coding: utf-8 -*-
#!/usr/bin/env python

"""
Script for setting all budgets with budget item 13 to 14 and remove budget item 13 (total) from RSR.
"""

from django.core.management import setup_environ
from akvo import settings
setup_environ(settings)

from akvo.rsr.models import BudgetItem, BudgetItemLabel, Project


def set_budget_totals():
    '''Change all budget items with id 13 to 14'''

    print "\nGetting all budget items...\n"

    budget_items = BudgetItem.objects.filter(label_id="13")

    for count, item in enumerate(budget_items, start=1):
        item.label_id = 14
        item.save()

        print "Budget item", str(item.pk), "adjusted (" + str(count) + "out of", str(budget_items.count()) + ")..."


def remove_budgetitem_label():
    '''Remove budget item label 13 (total)'''

    BudgetItemLabel.objects.filter(id="13").delete()
    print "\nRemoved the total budget item, label 13..."


def update_projects():
    '''Updates all projects using the budget sum calculator'''

    print "\nGetting all projects...\n"

    projects = Project.objects.all()

    for count, project in enumerate(projects):
        project.update_budget()
        project.update_funds_needed()

        print "Updating project:", project.id, "(" + str(count), "out of", str(projects.count()) + ")..."


if __name__ == '__main__':
    set_budget_totals()
    remove_budgetitem_label()
    update_projects()

    # Update all projects

    print "\nDone!\n"