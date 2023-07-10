from typing import Iterable
from akvo.rsr.models import (
    Project, DefaultPeriod, Result, IndicatorDimensionName, IndicatorDimensionValue,
    Indicator, IndicatorReference, IndicatorPeriod
)


def add_project_to_program(project: Project, program: Project):
    """
    This function assumes that the project is an empty newly created project.
    Program's validation set and results framework will be applied/inherited to the project.
    """
    project.set_reporting_org(program.reporting_org)
    for validation_set in program.validations.all():
        project.add_validation_set(validation_set)
    project.set_parent(program).save()
    inherit_results_framework(project, program)
    project.refresh_from_db()


def inherit_results_framework(child: Project, parent: Project):
    inherit_dimension_names(child, parent)
    inherit_results(child, parent)
    # Copy the default periods after copying the results to not create new
    # periods, from the parent, which may already be present from the parent!
    inherit_default_periods(child, parent)


def inherit_dimension_names(child: Project, parent: Project):
    inherited_dimension_names = child.dimension_names.exclude(parent_dimension_name__isnull=True).values_list('parent_dimension_name', flat=True)
    parent_names = parent.dimension_names.exclude(id__in=inherited_dimension_names)
    names = IndicatorDimensionName.objects.bulk_create([
        IndicatorDimensionName(project=child, parent_dimension_name=p, name=p.name)
        for p in parent_names
    ])
    name_parent_map = {n.parent_dimension_name.id: n for n in names}
    parent_values = IndicatorDimensionValue.objects.filter(name__in=(n.id for n in parent_names))
    IndicatorDimensionValue.objects.bulk_create([
        IndicatorDimensionValue(name=name_parent_map[dv.name.id], parent_dimension_value=dv, value=dv.value)
        for dv in parent_values
    ])


def inherit_results(child: Project, parent: Project):
    inherited_results = child.results.exclude(parent_result__isnull=True).values_list('parent_result', flat=True)
    parent_results = parent.results.exclude(id__in=inherited_results)
    results = Result.objects.bulk_create([
        Result(
            project=child,
            parent_result=r,
            title=r.title,
            type=r.type,
            aggregation_status=r.aggregation_status,
            description=r.description,
            order=r.order,
        )
        for r in parent_results
    ])
    inherit_indicators(child, results)


def inherit_indicators(child: Project, results: Iterable[Result]):
    result_parent_map = {r.parent_result.id: r for r in results}
    parent_indicators = Indicator.objects.filter(result__in=result_parent_map.keys())
    indicators = Indicator.objects.bulk_create([
        Indicator(
            result=result_parent_map[i.result.id],
            parent_indicator=i,
            title=i.title,
            description=i.description,
            measure=i.measure,
            ascending=i.ascending,
            cumulative=i.cumulative,
            type=i.type,
            export_to_iati=i.export_to_iati,
            scores=i.scores,
            order=i.order,
            baseline_comment=i.baseline_comment,
            baseline_year=i.baseline_year,
            baseline_value=i.baseline_value,
        )
        for i in parent_indicators
    ])
    inherit_periods(indicators)
    copy_references(indicators)
    connect_indicators_dimension_names(child, indicators)


def inherit_periods(indicators: Iterable[Indicator]):
    indicator_parent_map = {i.parent_indicator.id: i for i in indicators}
    parent_periods = IndicatorPeriod.objects.filter(indicator__in=indicator_parent_map.keys())
    IndicatorPeriod.objects.bulk_create([
        IndicatorPeriod(
            indicator=indicator_parent_map[p.indicator.id],
            parent_period=p,
            period_start=p.period_start,
            period_end=p.period_end
        )
        for p in parent_periods
    ])


def copy_references(indicators: Iterable[Indicator]):
    bulk = []
    for indicator in indicators:
        parent_references = indicator.parent_indicator.references.all()
        for reference in parent_references:
            bulk.append(IndicatorReference(
                indicator=indicator,
                reference=reference.reference,
                vocabulary=reference.vocabulary,
                vocabulary_uri=reference.vocabulary_uri,
            ))
    IndicatorReference.objects.bulk_create(bulk)


def connect_indicators_dimension_names(child: Project, indicators: Iterable[Indicator]):
    ThroughModel = Indicator.dimension_names.through
    bulk = []
    for indicator in indicators:
        parent_dimension_names = indicator.parent_indicator.dimension_names.all()
        candidates = IndicatorDimensionName.objects.filter(project=child, parent_dimension_name__in=parent_dimension_names)
        for dimension_name in candidates:
            bulk.append(ThroughModel(indicator_id=indicator.id, indicatordimensionname_id=dimension_name.id))
    ThroughModel.objects.bulk_create(bulk)


def inherit_default_periods(child: Project, parent: Project):
    inherited_parent_periods = child.default_periods.exclude(parent__isnull=True).values_list('parent', flat=True)
    parent_periods = parent.default_periods.exclude(id__in=inherited_parent_periods)
    DefaultPeriod.objects.bulk_create([
        DefaultPeriod(project=child, parent=p, period_start=p.period_start, period_end=p.period_end)
        for p in parent_periods
    ])
