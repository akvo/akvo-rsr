# Results aggregation

In a [project hierarchies][project hierarchy], it's possible to see and sum up the data from the child projects.
This is an operation that bubbles upwards and is called an aggregation.

The target node of an aggregation is a program.

## Process

Once a result is submitted, an aggregation job is queued and executed by the worker.
The progress of the job can be tracked, there's an automatic retry mechanism, and when the max number of retries
 has been reached, specific users can be notified by email and it's possible to trigger a retry from the frontend.

:::{seealso}
Jobs are part of the [Task Management](#task-management).
:::

The main model is
[`akvo.rsr.models.aggregation_job.IndicatorPeriodAggregationJob`][IndicatorPeriodAggregationJob]
and the execution can be found in
[`akvo-rsr.doc.akvo.rsr.usecases.jobs.aggregation`](#akvo-rsr.doc.akvo.rsr.usecases.jobs.aggregation).

The general process is as follows

```python
from akvo.rsr.models.result.indicator_period import IndicatorPeriod
from akvo.rsr.usecases.jobs.aggregation import (
    schedule_aggregation_jobs,
    execute_aggregation_jobs,
)

period = IndicatorPeriod.objects.get(id=some_id)
schedule_aggregation_jobs(period)

# every interval (currently a minute)
execute_aggregation_jobs()
```

### Scheduling aggregation jobs

[`schedule_aggregation_jobs`](#schedule_aggregation_jobs)

The process of schedule is simply creating an [`IndicatorPeriodAggregationJob`][IndicatorPeriodAggregationJob].
The conditions are in the function, but they can be sums up to: only schedule if this job hasn't been schedule yet.

### Executing aggregation jobs

[`execute_aggregation_jobs`](#execute_aggregation_jobs) takes care of executing all aggregation jobs.
This is a remnant from when the task was executed in a cronjob.

Each aggregation job targets a period and runs all the way until the root of the tree.
The algorithm is as follows

```python
def aggregate_period(period):
    # Sum values of children
    if has_child(period):
        child_values = period.children.values()
        total = sum(child_values)
        period.actual_value = total
        period.save()

    if has_parent(period):
        aggregate_period(period.parent_period)
```

It is a monolithic, multi-step operation wrapped in a database transaction
 and there is much room for optimisation e.g

 - periods could make use of [`AkvoTreeModel`](#AkvoTreeModel) for traversing the hierarchy
 - each level could be done with an independent job using a [django-q Chain]
 - it might be possible to improve the model and make this unnecessary by allowing calculation at request time
   ([Sum] aggregation)

#### Handling failures

Should a job fail for whatever reason, the number of failures is updated and the job is marked as failed.
A check is then done to make sure the
 [`akvo/rsr/usecases/jobs/aggregation.MAX_ATTEMPTS`][MAX_ATTEMPTS] has been reached.
Should that be the case, the job is marked as "maxxed" and an email is sent to subscribers.

Subscribers are configured by the admin at request of the subscriber by setting
 [`akvo.rsr.models.employment.Employment.receives_indicator_aggregation_emails`](#receives_indicator_aggregation_emails)

[django-q Chain]: https://django-q.readthedocs.io/en/latest/chain.html
[IndicatorPeriodAggregationJob]: #IndicatorPeriodAggregationJob
[project hierarchy]: ../projects.md#programs-and-project-hierarchy
[MAX_ATTEMPTS]: #akvo/rsr/usecases/jobs/aggregation.MAX_ATTEMPTS
[Sum]: https://docs.djangoproject.com/en/3.2/ref/models/querysets/#sum
