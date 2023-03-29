# Projects and Programs

These are two fundamental models in RSR that organisations use.

Projects can be standalone, meaning they define their own [Results Framework] and can be quite small.
They often collect results for a short period of time and are then archived.

Projects can also be part of a group of projects that all contribute to a larger goal and track the same
 results and indicators over the same periods.
When that happens, they are put into a [Program](#programs-and-project-hierarchy) 

## Project

A project in RSR is composed of data from multiple sections:

 - General data about the project
 - Finance data
 - Location
 - [Result Framework]
 - TODO ...

We use the [Project] class for this. 

### Publishing

This has an effect on [Report generation] (making it possible) and also putting it on the map on the frontpage.

## Programs and Project Hierarchy

The [Project] class inherits from the [AkvoTreeModel] that allows storing projects in a tree structure in the DB.
It takes advantage of Postgres' [`ltree`][ltree] extension, which stores the path to a node in the tree.
The path is dot-separated e.g `root.child.grandchild`.  
Our path is a dot-separated UUID list.

```{note}
UUIDs are used because we can compute them while generating a project and before sending it to the DB.
The DB then creates the ID itself.
```

Programs are created by using the unfortunate class name [ProjectHierarchy] and a "root" project.
A root project is thus a project with a path containing no dots.

The presence of a [ProjectHierarchy] allows the frontend to query the backend for the models 
 and retrieve a list of "Programs".

### Result Framework within a hierarchy

The [results framework][Results Framework] of a parent project is inherited by its children.
This is done by creating a copy of the parent's results framework and assigning it to the child,
 an action that is done automatically when creating a child project using the frontend.
The important method is [`akvo.rsr.models.project.Project.import_results`](#akvo.rsr.models.project.Project.import_results).

For the specificities you can check out the [wiki][framework inheritance].

:::{note}
It should be noted that inheritance is currently done using a `parent_` field in the results framework models.
This forces making multiple requests in order to traverse the hierarchy.
A move to [`ltree`][lree] would be preferred.
:::

An important aspect that then comes into play is [results aggregation][aggregation]

[aggregation]: results_framework/aggregation.md
[AkvoTreeModel]: #AkvoTreeModel
[framework inheritance]: https://github.com/akvo/akvo-rsr/wiki/Details-on-inheriting-results-frameworks
[ltree]: https://www.postgresql.org/docs/current/ltree.html
[Report generation]: ../report_generation.md
[Results Framework]: results_framework/index.md
[Project]: #akvo.rsr.models.project.Project
[ProjectHierarchy]: #akvo.rsr.models.project_hierarchy.ProjectHierarchy
