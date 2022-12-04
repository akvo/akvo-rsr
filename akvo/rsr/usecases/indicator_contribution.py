from django.db.models import Count, Sum, Q
from akvo.rsr.models import Indicator, IndicatorPeriodData


def get_indicator_contribution_count(indicator: Indicator) -> int:
    """Get the number of approved updates that have been made to an Indicator including its descendants."""
    return (
        indicator.descendants()
        .annotate(
            update_count=Count(
                "periods__data",
                filter=Q(
                    periods__data__status=IndicatorPeriodData.STATUS_APPROVED_CODE
                ),
            )
        )
        .aggregate(total=Sum("update_count"))["total"]
    )
